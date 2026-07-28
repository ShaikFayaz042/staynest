const WISHLIST_STORAGE_KEY = "wishlists";

function readWishlists() {
  try {
    const parsed = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeWishlists(wishlists) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlists));
}

function getOrCreateUserWishlist(wishlists, userId) {
  let savedList = wishlists.find((list) => list.userId === userId);

  if (!savedList) {
    savedList = {
      id: `wl-${Date.now()}`,
      userId,
      name: "Saved",
      listingIds: [],
    };
    wishlists.push(savedList);
  }

  return savedList;
}

export function getUserWishlistListings(userId) {
  if (!userId) return [];

  const wishlists = readWishlists();
  const userWishlist = wishlists.find((list) => list.userId === userId);
  return userWishlist?.listingIds || [];
}

export function isListingSaved(userId, listingId) {
  if (!userId || !listingId) return false;
  return getUserWishlistListings(userId).includes(listingId);
}

export function toggleListingWishlist(userId, listingId) {
  if (!userId || !listingId) return false;

  const wishlists = readWishlists();
  const userWishlist = getOrCreateUserWishlist(wishlists, userId);
  const listingIds = userWishlist.listingIds || [];
  const isAlreadySaved = listingIds.includes(listingId);

  if (isAlreadySaved) {
    userWishlist.listingIds = listingIds.filter((id) => id !== listingId);
  } else {
    userWishlist.listingIds = [...listingIds, listingId];
  }

  writeWishlists(wishlists);
  return !isAlreadySaved;
}

export function getUserWishlists(userId) {
  if (!userId) return [];
  return readWishlists().filter((list) => list.userId === userId);
}
