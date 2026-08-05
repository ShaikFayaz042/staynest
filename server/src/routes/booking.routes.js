import express from "express";
import {getBookings, getBookingById, updateBooking, createBooking, deleteBooking} from "../controllers/booking.controller.js";

const router = express.Router();

router.route("/")
.get(getBookings)
.post(createBooking);

router.route("/:id")
.get(getBookingById)
.patch(updateBooking)
.delete(deleteBooking);

export default router;
