import express from "express";
import { getUsers, getUserById, getPublicUserById, updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

// Public endpoint for fetching limited user/host info (used by listing pages)
router.route("/public/:id").get(getPublicUserById);

// Admin-only: list all users
router.route("/").get(verifyJWT, authorizeRoles("Admin"), getUsers);

// Protected endpoints for user-specific actions
router.route("/:id")
	.get(verifyJWT, getUserById)
	.patch(verifyJWT, updateUser)
	.delete(verifyJWT, deleteUser);

export default router;