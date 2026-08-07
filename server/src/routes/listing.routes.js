import express from "express";
import { getListings, getListingById, updateListing, createListing, deleteListing } from "../controllers/listing.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.route("/")
.get(getListings)
.post(verifyJWT, authorizeRoles("Host", "Admin"), createListing);

router.route("/:id")
.get(getListingById)
.patch(verifyJWT, authorizeRoles("Host", "Admin"), updateListing)
.delete(verifyJWT, authorizeRoles("Host", "Admin"), deleteListing);

export default router;
