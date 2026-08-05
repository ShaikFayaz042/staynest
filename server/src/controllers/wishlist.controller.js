import mongoose from "mongoose";
import Wishlist from "../models/Wishlist.js";

export async function getWishlistItems(req, res) {
  try {
    const wishlistItems = await Wishlist.find();
    res.status(200).json({
      success: true,
      message: "Wishlist items fetched successfully",
      data: wishlistItems,
    });
  } catch (err) {
    console.log("Error fetching wishlist items: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getWishlistItemById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid wishlist id",
      });
    }

    const wishlistItem = await Wishlist.findById(id);

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist item fetched successfully",
      data: wishlistItem,
    });
  } catch (err) {
    console.log("Error fetching wishlist item: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function createWishlistItem(req, res) {
  try {
    const wishlistItem = await Wishlist.create(req.body);

    res.status(201).json({
      success: true,
      message: "Wishlist item created successfully",
      data: wishlistItem,
    });
  } catch (err) {
    console.log("Error creating wishlist item: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function updateWishlistItem(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid wishlist id",
      });
    }

    const updatedWishlistItem = await Wishlist.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedWishlistItem) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist item updated successfully",
      data: updatedWishlistItem,
    });
  } catch (err) {
    console.log("Error updating wishlist item: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function deleteWishlistItem(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid wishlist id",
      });
    }

    const deletedWishlistItem = await Wishlist.findByIdAndDelete(id);

    if (!deletedWishlistItem) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist item deleted successfully",
      data: deletedWishlistItem,
    });
  } catch (err) {
    console.log("Error deleting wishlist item: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
