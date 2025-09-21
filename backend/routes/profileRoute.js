import express from "express";
import authProfile from "../middlewares/authProfile.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.get("/profile", authProfile, getProfile);
router.put("/profile", authProfile, upload.single("image"), updateProfile);

export default router;
