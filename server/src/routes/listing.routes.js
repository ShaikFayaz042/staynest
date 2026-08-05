import express from "express";
import {getListings, getListingById, updateListing, createListing, deleteListing} from "../controllers/listing.controller.js";

const router = express.Router();

router.route("/")
.get(getListings)
.post(createListing);

router.route("/:id")
.get(getListingById)
.patch(updateListing)
.delete(deleteListing);

export default router;
