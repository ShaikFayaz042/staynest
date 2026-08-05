import mongoose from "mongoose";
import Booking from "../models/Booking.js";

export async function getBookings(req, res) {
  try {
    const bookings = await Booking.find();
    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (err) {
    console.log("Error fetching bookings: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getBookingById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking id",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (err) {
    console.log("Error fetching booking: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function createBooking(req, res) {
  try {
    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err) {
    console.log("Error creating booking: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function updateBooking(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking id",
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (err) {
    console.log("Error updating booking: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function deleteBooking(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking id",
      });
    }

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      data: deletedBooking,
    });
  } catch (err) {
    console.log("Error deleting booking: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
