import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false } 
);

const bedroomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    beds: { type: Number, required: true, default: 1, min: 1 }, // Added validation
    images: { type: [String], default: [] }, // Added default array
  }
);

// 3. Main Listing Schema
const listingSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "House", "Flat / apartment", "Barn", "Bed & breakfast", "Boat", 
        "Cabin", "Campervan / motorhome", "Casa particular", "Castle", 
        "Cave", "Container", "Cycladic home", "Dammuso", "Dome", 
        "Earth home", "Farm", "Guest house", "Hotel", "Houseboat", 
        "Minsu", "Riad", "Ryokan", "Shepherd's hut", "Tent", 
        "Tiny home", "Tower", "Tree house", "Trullo", "Windmill", "Yurt"
      ],
      required: true,
    },
    location: locationSchema,
    pricePerNight: {
      type: Number,
      required: true,
      min: 0, // Validation added
    },
    guests: {
      type: Number,
      required: true,
      min: 1, // Validation added
    },
    beds: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    bathrooms: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0, // Validation added
      max: 5, // Validation added
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: {
      type: [String],
      default: [], // Default empty array added
    },
    bedrooms: [bedroomSchema],
    amenities: [
      {
        type: String,
        enum: [
          "Air conditioning", "Essentials", "Fridge", "Heating", "Hot water",
          "Kitchen", "TV", "Tumble dryer", "Washing machine", "Wifi",
          "Coffee maker", "Cooking basics", "Hairdryer", "Hangers", "Iron",
          "Shampoo", "Dedicated workspace", "EV charger", "Free parking", "Gym",
          "Hot tub", "Indoor fireplace", "Outdoor furniture", "Pool",
          "Beach access", "Waterfront", "Mountain view", "City view", "Garden view",
          "Carbon monoxide alarm", "Smoke alarm", "First aid kit", 
          "Fire extinguisher", "Security cameras"
        ],
      },
    ],
    discount: {
      type: Number,
      default: 0,
      min: 0,   // Validation added
      max: 100, // Validation added
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;