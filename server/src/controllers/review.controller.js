import mongoose from "mongoose";
import Review from "../models/Review.js";

export async function getReviews(req, res) {
  try {
    const reviews = await Review.find();
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

    const review = await Review.findById(id);

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
    const review = await Review.create(req.body);

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

    const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

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

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

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
