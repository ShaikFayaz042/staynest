import express from "express";
import {getWishlistItems, getWishlistItemById, updateWishlistItem, createWishlistItem, deleteWishlistItem} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.route("/")
.get(getWishlistItems)
.post(createWishlistItem);

router.route("/:id")
.get(getWishlistItemById)
.patch(updateWishlistItem)
.delete(deleteWishlistItem);

export default router;
