import mongoose from "mongoose";
import Booking from "../models/Booking.js";

export async function getBookings(req, res) {
  try {
    const { listing } = req.query;
    const filter = {};

    if (listing) {
      if (!mongoose.Types.ObjectId.isValid(listing)) {
        return res.status(400).json({
          success: false,
          message: "Invalid listing id",
        });
      }
      filter.listing = listing;
    } else {
      filter.user = req.user.userId;
    }

    let query = Booking.find(filter).populate("listing").populate("user", "name email profile _id");
    const bookings = await query;

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

    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
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
    const { listing, checkIn, checkOut } = req.body;

    if (!listing || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Listing, check-in, and check-out are required",
      });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    if (!(startDate instanceof Date) || isNaN(startDate) || !(endDate instanceof Date) || isNaN(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid check-in or check-out date",
      });
    }

    const conflict = await Booking.findOne({
      listing,
      status: { $ne: "cancelled" },
      checkIn: { $lt: endDate },
      checkOut: { $gt: startDate },
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: "Selected dates are no longer available",
      });
    }

    const booking = await Booking.create({
      ...req.body,
      user: req.user.userId,
    });

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

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const updates = { ...req.body };
    delete updates.user;

    const updatedBooking = await Booking.findByIdAndUpdate(id, updates, {
      new: true,
    });

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

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const deletedBooking = await Booking.findByIdAndDelete(id);

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
