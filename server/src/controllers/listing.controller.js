import mongoose from "mongoose";
import Listing from "../models/Listing.js";

export async function getListings(req, res) {
  try {
    const listings = await Listing.find();
    res.status(200).json({
      success: true,
      message: "Listings fetched successfully",
      data: listings,
    });
  } catch (err) {
    console.log("Error fetching listings: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getListingById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing id",
      });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Listing fetched successfully",
      data: listing,
    });
  } catch (err) {
    console.log("Error fetching listing: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function createListing(req, res) {
  try {
    const listing = await Listing.create(req.body);

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      data: listing,
    });
  } catch (err) {
    console.log("Error creating listing: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function updateListing(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing id",
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedListing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      data: updatedListing,
    });
  } catch (err) {
    console.log("Error updating listing: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function deleteListing(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing id",
      });
    }

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
      data: deletedListing,
    });
  } catch (err) {
    console.log("Error deleting listing: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
