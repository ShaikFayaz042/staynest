import express from "express";
import { getBookings, getBookingById, updateBooking, createBooking, deleteBooking } from "../controllers/booking.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = express.Router();

router.route("/")
.get(verifyJWT, getBookings)
.post(verifyJWT, createBooking);

router.route("/:id")
.get(verifyJWT, getBookingById)
.patch(verifyJWT, updateBooking)
.delete(verifyJWT, deleteBooking);

export default router;
