import express from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/").get(verifyJWT, authorizeRoles("Admin"), getUsers);

router.route("/:id")
.get(getUserById)
.patch(updateUser)
.delete(deleteUser);

export default router;