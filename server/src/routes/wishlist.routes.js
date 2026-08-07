import express from "express";
import { getWishlistItems, getWishlistItemById, updateWishlistItem, createWishlistItem, deleteWishlistItem } from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = express.Router();

router.route("/")
.get(verifyJWT, getWishlistItems)
.post(verifyJWT, createWishlistItem);

router.route("/:id")
.get(verifyJWT, getWishlistItemById)
.patch(verifyJWT, updateWishlistItem)
.delete(verifyJWT, deleteWishlistItem);

export default router;
