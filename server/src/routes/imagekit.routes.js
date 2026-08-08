import express from "express";
import { getImageKitAuth, deleteImageKitFile } from "../controllers/imagekit.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = express.Router();

router.get("/auth", verifyJWT, getImageKitAuth);
router.delete("/file", verifyJWT, deleteImageKitFile);

export default router;
