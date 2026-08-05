import mongoose from "mongoose";
import User from "../models/User.js";

export async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    console.log("Error fetching users: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    console.log("Error fetching user: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function createUser(req, res) {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    console.log("Error creating user: ", err);

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.log("Error updating user: ", err);

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (err) {
    console.log("Error deleting user: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}