import express from "express";
import {getReviews, getReviewById, updateReview, createReview, deleteReview} from "../controllers/review.controller.js";

const router = express.Router();

router.route("/")
.get(getReviews)
.post(createReview);

router.route("/:id")
.get(getReviewById)
.patch(updateReview)
.delete(deleteReview);

export default router;
