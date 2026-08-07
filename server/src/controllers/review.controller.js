import mongoose from "mongoose";
import Review from "../models/Review.js";

export async function getReviews(req, res) {
  try {
    const filter = {};
    const { listing } = req.query;

    if (listing) {
      if (!mongoose.Types.ObjectId.isValid(listing)) {
        return res.status(400).json({
          success: false,
          message: "Invalid listing id",
        });
      }
      filter.listing = listing;
    }

    const reviews = await Review.find(filter).populate("user", "name avatar profile joinedAt");
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (err) {
    console.log("Error fetching reviews: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getReviewById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    const review = await Review.findById(id).populate("user", "name avatar profile joinedAt");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: review,
    });
  } catch (err) {
    console.log("Error fetching review: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function createReview(req, res) {
  try {
    const review = await Review.create({
      ...req.body,
      user: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (err) {
    console.log("Error creating review: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function updateReview(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const updates = { ...req.body };
    delete updates.user;

    const updatedReview = await Review.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (err) {
    console.log("Error updating review: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const deletedReview = await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: deletedReview,
    });
  } catch (err) {
    console.log("Error deleting review: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
