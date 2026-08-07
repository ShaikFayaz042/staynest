import express from "express";
import { getReviews, getReviewById, updateReview, createReview, deleteReview } from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = express.Router();

router.route("/")
.get(getReviews)
.post(verifyJWT, createReview);

router.route("/:id")
.get(getReviewById)
.patch(verifyJWT, updateReview)
.delete(verifyJWT, deleteReview);

export default router;
