import express from "express";
import { validateRegister } from "../middlewares/validateRegister.js";
import { validateLogin } from "../middlewares/validateLogin.js";
import { registerUser, loginUser, logoutUser, getUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = express.Router();

// signup
router.route("/register").post(validateRegister, registerUser);

// login
router.route("/login").post(validateLogin, loginUser);

// logout
router.route("/logout").post(logoutUser);

// authenticated current user
router.route("/me").get(verifyJWT, getUser);

export default router;