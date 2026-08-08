import express from "express";
import { getListings, getListingById, updateListing, createListing, deleteListing } from "../controllers/listing.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.route("/")
.get(getListings)
.post(verifyJWT, createListing);

router.route("/:id")
.get(getListingById)
.patch(verifyJWT, updateListing)
.delete(verifyJWT, deleteListing);

export default router;
