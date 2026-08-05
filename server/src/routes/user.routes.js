import express from "express";
import {getUsers, getUserById, updateUser, createUser, deleteUser} from "../controllers/user.controller.js";
const router = express.Router();
router.route("/")
.get(getUsers)
.post(createUser);

router.route("/:id")
.get(getUserById)
.patch(updateUser)
.delete(deleteUser);
export default router;