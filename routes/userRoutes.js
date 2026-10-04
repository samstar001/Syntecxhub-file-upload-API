// routes/userRoutes.js
import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  uploadPicture,
  getPicture,
  deletePicture,
} from "../controllers/profilePictureController.js";

const router = express.Router();

router.post("/me/picture", protect, upload.single("picture"), uploadPicture);
router.get("/me/picture", protect, getPicture);
router.delete("/me/picture", protect, deletePicture);

export default router;
