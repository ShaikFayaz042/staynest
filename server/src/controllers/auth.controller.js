import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hash,
    });

    const token = generateToken({
      userId: newUser._id,
      email: newUser.email,
      roles: Array.isArray(newUser.roles) ? newUser.roles : [newUser.roles],
    });

    res
      .cookie("accessToken", token, getCookieOptions())
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        data: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
  } catch (err) {
    console.log("Error registering user: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken({
      userId: user._id,
      email: user.email,
      roles: Array.isArray(user.roles) ? user.roles : [user.roles],
    });

    res
      .cookie("accessToken", token, getCookieOptions())
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (err) {
    console.log("Error logging user: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function logoutUser(req, res) {
  try {
    res.clearCookie("accessToken", getCookieOptions()).status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    console.log("Error logging out user: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getUser(req, res) {
  try {
    const user = await User.findById(req.user.userId).select("-password");

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
