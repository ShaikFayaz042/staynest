import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../src/db/db.js";
import User from "../src/models/User.js";
import Listing from "../src/models/Listing.js";
import Booking from "../src/models/Booking.js";
import Review from "../src/models/Review.js";
import Wishlist from "../src/models/Wishlist.js";
import usersData from "../client/src/data/users.js";
import listingsData from "../client/src/data/listings.js";
import bookingsData from "../client/src/data/bookings.js";
import reviewsData from "../client/src/data/reviews.js";

dotenv.config();

const LISTING_COUNT = 25;

// Minimum constraints: need 4 cities with 6+ listings => 24 listings, plus one more city => 25

function normalizeRoles(roles = []) {
  return Array.from(
    new Set(
      (roles || []).map((role) => {
        if (typeof role !== "string") return role;
        const lower = role.toLowerCase();
        if (lower === "host") return "Host";
        if (lower === "traveller" || lower === "traveler") return "Guest";
        // Capitalize first letter for other roles
        return role.charAt(0).toUpperCase() + role.slice(1);
      })
    )
  );
}

function ensureUniqueWishlistPairs(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.user.toString()}::${item.listing.toString()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeBookingStatus(status = "") {
  const lower = String(status).toLowerCase();
  if (["pending", "confirmed", "checked_in", "checked_out", "cancelled"].includes(lower)) {
    return lower;
  }
  if (lower === "completed") {
    return "checked_out";
  }
  return "pending";
}

function normalizePaymentStatus(status = "") {
  const lower = String(status).toLowerCase();
  if (["pending", "paid", "failed", "refunded"].includes(lower)) {
    return lower;
  }
  return "pending";
}

const ALLOWED_CATEGORIES = new Set([
  "House", "Flat / apartment", "Barn", "Bed & breakfast", "Boat", 
  "Cabin", "Campervan / motorhome", "Casa particular", "Castle", 
  "Cave", "Container", "Cycladic home", "Dammuso", "Dome", 
  "Earth home", "Farm", "Guest house", "Hotel", "Houseboat", 
  "Minsu", "Riad", "Ryokan", "Shepherd's hut", "Tent", 
  "Tiny home", "Tower", "Tree house", "Trullo", "Windmill", "Yurt"
]);

const ALLOWED_AMENITIES = new Set([
  "Air conditioning", "Essentials", "Fridge", "Heating", "Hot water",
  "Kitchen", "TV", "Tumble dryer", "Washing machine", "Wifi",
  "Coffee maker", "Cooking basics", "Hairdryer", "Hangers", "Iron",
  "Shampoo", "Dedicated workspace", "EV charger", "Free parking", "Gym",
  "Hot tub", "Indoor fireplace", "Outdoor furniture", "Pool",
  "Beach access", "Waterfront", "Mountain view", "City view", "Garden view",
  "Carbon monoxide alarm", "Smoke alarm", "First aid kit", 
  "Fire extinguisher", "Security cameras"
]);

function normalizeListingCategory(cat) {
  if (!cat) return "House";
  const trimmed = String(cat).trim();
  if (ALLOWED_CATEGORIES.has(trimmed)) return trimmed;
  const lower = trimmed.toLowerCase();
  if (lower.includes("penthouse") || lower.includes("apartment") || lower.includes("flat")) {
    return "Flat / apartment";
  }
  if (lower.includes("hotel")) return "Hotel";
  if (lower.includes("cabin")) return "Cabin";
  return "House"; // fallback
}

function normalizeAmenities(list = []) {
  return (list || []).filter((a) => ALLOWED_AMENITIES.has(a));
}

function selectListingsForConstraints(allListings, desiredCount) {
  // Group by city
  const byCity = new Map();
  allListings.forEach((l) => {
    const city = (l.location && l.location.city) ? l.location.city : "Unknown";
    if (!byCity.has(city)) byCity.set(city, []);
    byCity.get(city).push(l);
  });

  // Sort cities by availability
  const cities = [...byCity.entries()].sort((a, b) => b[1].length - a[1].length);

  const selected = [];
  const usedIds = new Set();

  // Step 1: ensure at least 5 distinct cities (one from each if possible)
  for (let i = 0; i < Math.min(5, cities.length); i++) {
    const arr = cities[i][1];
    for (const l of arr) {
      if (!usedIds.has(l.id)) {
        selected.push(l);
        usedIds.add(l.id);
        break;
      }
    }
  }

  // Step 2: try to make 4 cities have 6+ listings
  let citiesWithSix = 0;
  // Make a copy of cities sorted by available
  const citiesByAvail = [...cities];
  for (let i = 0; i < citiesByAvail.length && citiesWithSix < 4; i++) {
    const [city, arr] = citiesByAvail[i];
    // fill this city's selections up to 6
    const needed = 6 - arr.filter((l) => usedIds.has(l.id)).length;
    let added = 0;
    for (const l of arr) {
      if (added >= needed) break;
      if (usedIds.has(l.id)) continue;
      selected.push(l);
      usedIds.add(l.id);
      added++;
    }
    const totalForCity = arr.filter((l) => usedIds.has(l.id)).length;
    if (totalForCity >= 6) citiesWithSix++;
  }

  // Step 3: fill remaining slots preferring cities with most remaining listings
  const flat = allListings.filter((l) => !usedIds.has(l.id));
  flat.sort((a, b) => 0); // keep original order
  for (const l of flat) {
    if (selected.length >= desiredCount) break;
    selected.push(l);
    usedIds.add(l.id);
  }

  // Final trim to desiredCount
  return selected.slice(0, desiredCount);
}

function normalizeReviewCategories(categories = {}) {
  const keys = ["cleanliness", "accuracy", "checkIn", "communication", "location", "value"];
  return keys.reduce((acc, key) => {
    const value = typeof categories[key] === "number" ? categories[key] : null;
    acc[key] = value;
    return acc;
  }, {});
}

function normalizeReviewReference(review, userIdMap, listingIdMap, bookingIdMap) {
  const user = userIdMap.get(review.userId);
  const listing = listingIdMap.get(review.listingId);
  if (!user || !listing) return null;
  return {
    user,
    listing,
    booking: review.bookingId && bookingIdMap.has(review.bookingId)
      ? bookingIdMap.get(review.bookingId)
      : null,
    rating: review.rating ?? 0,
    categories: normalizeReviewCategories(review.categories),
    comment: review.comment || "",
    isApproved: review.isApproved !== undefined ? review.isApproved : true,
  };
}

function normalizeWishlistReference(userId, listingId, userIdMap, listingIdMap) {
  const user = userIdMap.get(userId);
  const listing = listingIdMap.get(listingId);
  if (!user || !listing) return null;
  return { user, listing };
}

function buildIdMaps(selectedListings = []) {
  const userIdMap = new Map();
  const listingIdMap = new Map();
  const bookingIdMap = new Map();
  const reviewIdMap = new Map();

  usersData.forEach((user) => userIdMap.set(user.id, new mongoose.Types.ObjectId()));
  selectedListings.forEach((listing) => listingIdMap.set(listing.id, new mongoose.Types.ObjectId()));
  bookingsData.forEach((booking) => bookingIdMap.set(booking.id, new mongoose.Types.ObjectId()));
  reviewsData.forEach((review) => reviewIdMap.set(review.id, new mongoose.Types.ObjectId()));

  return { userIdMap, listingIdMap, bookingIdMap, reviewIdMap };
}

function buildUserDocs(userIdMap) {
  return usersData.map((user) => ({
    _id: userIdMap.get(user.id),
    name: user.name,
    email: user.email,
    password: user.password || "password123",
    roles: normalizeRoles(user.roles),
    profile: user.avatar || user.profile || "",
    phone: user.phone || "",
    address: user.address || "",
    bio: user.about || "",
    isVerified: Boolean(user.verified),
  }));
}

function buildListingDocs(listingIdMap, userIdMap, selectedListings) {
  return selectedListings.map((listing) => ({
    _id: listingIdMap.get(listing.id),
    host: userIdMap.get(listing.hostId),
    title: listing.title,
    description: listing.description,
    category: normalizeListingCategory(listing.category),
    location: {
      country: listing.location?.country || "",
      state: listing.location?.state || "",
      city: listing.location?.city || "",
      address: listing.location?.address || "",
      latitude: listing.location?.latitude || "",
      longitude: listing.location?.longitude || "",
    },
    pricePerNight: listing.pricePerNight ?? 0,
    guests: listing.guests ?? 1,
    beds: listing.beds ?? 1,
    bathrooms: listing.bathrooms ?? 1,
    rating: listing.rating ?? 0,
    reviewCount: listing.reviewCount ?? 0,
    images: listing.images ?? [],
    bedrooms: (listing.bedrooms ?? []).map((bedroom) => ({
      title: bedroom.title || "Bedroom",
      beds: bedroom.beds ?? 1,
      images: bedroom.images ?? [],
    })),
    amenities: normalizeAmenities(listing.amenities ?? []),
    discount: listing.discount ?? 0,
  }));
}

function buildBookingDocs(bookingIdMap, userIdMap, listingIdMap) {
  return bookingsData
    .filter((booking) => userIdMap.has(booking.userId) && listingIdMap.has(booking.listingId))
    .map((booking) => ({
      _id: bookingIdMap.get(booking.id),
      user: userIdMap.get(booking.userId),
      listing: listingIdMap.get(booking.listingId),
      checkIn: new Date(booking.checkIn),
      checkOut: new Date(booking.checkOut),
      guests: booking.guests ?? 1,
      totalPrice: booking.totalPrice ?? 0,
      status: normalizeBookingStatus(booking.status),
      paymentStatus: normalizePaymentStatus(booking.paymentStatus),
      specialRequests: booking.specialRequests || "",
    }));
}

function buildReviewDocs(reviewIdMap, userIdMap, listingIdMap, bookingIdMap) {
  return reviewsData
    .map((review) => {
      const normalized = normalizeReviewReference(review, userIdMap, listingIdMap, bookingIdMap);
      if (!normalized) return null;
      return {
        _id: reviewIdMap.get(review.id),
        ...normalized,
      };
    })
    .filter(Boolean);
}

function buildWishlistDocs(userIdMap, listingIdMap) {
  const list = [];
  usersData.forEach((user) => {
    (user.wishlist ?? []).forEach((listingId) => {
      const normalized = normalizeWishlistReference(user.id, listingId, userIdMap, listingIdMap);
      if (!normalized) return;
      list.push(normalized);
    });
  });
  return ensureUniqueWishlistPairs(list);
}

async function seedDatabase() {
  await connectDB();
  console.log("Database connected.");

  console.log("Clearing existing collections...");
  await Promise.all([
    User.deleteMany({}),
    Listing.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
    Wishlist.deleteMany({}),
  ]);

  const selectedListings = selectListingsForConstraints(listingsData, LISTING_COUNT);

  const { userIdMap, listingIdMap, bookingIdMap, reviewIdMap } = buildIdMaps(selectedListings);

  const users = buildUserDocs(userIdMap);
  const listings = buildListingDocs(listingIdMap, userIdMap, selectedListings);
  const bookings = buildBookingDocs(bookingIdMap, userIdMap, listingIdMap);
  const reviews = buildReviewDocs(reviewIdMap, userIdMap, listingIdMap, bookingIdMap);
  const wishlists = buildWishlistDocs(userIdMap, listingIdMap);

  console.log(`Seeding ${users.length} users, ${listings.length} listings, ${bookings.length} bookings, ${reviews.length} reviews, ${wishlists.length} wishlist items...`);

  await User.insertMany(users, { runValidators: true });
  await Listing.insertMany(listings, { runValidators: true });
  await Booking.insertMany(bookings, { runValidators: true });
  await Review.insertMany(reviews, { runValidators: true });
  if (wishlists.length > 0) {
    await Wishlist.insertMany(wishlists, { runValidators: true });
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
