import express from "express";
import { getImageKitAuth } from "../controllers/imagekit.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = express.Router();

router.get("/auth", verifyJWT, getImageKitAuth);

export default router;
