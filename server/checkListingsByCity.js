import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./src/db/db.js";
import Listing from "./src/models/Listing.js";

dotenv.config();

async function run() {
  await connectDB();
  const results = await Listing.aggregate([
    { $group: { _id: "$location.city", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  console.log("Listing counts by city:");
  results.forEach((r) => console.log(`${r._id}: ${r.count}`));
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
