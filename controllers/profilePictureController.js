// controllers/profilePictureController.js
import User from "../models/User.js";
import fs from "fs";
import path from "path";

// POST /api/users/me/picture — upload or replace the logged-in user's picture
export const uploadPicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the old picture file from disk, if one exists
    if (user.picture?.filename) {
      const oldPath = path.join("uploads", user.picture.filename);
      fs.unlink(oldPath, (err) => {
        if (err) console.error("Failed to delete old picture:", err.message);
      });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    user.picture = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: fileUrl,
      uploadedAt: new Date(),
    };

    await user.save();

    res
      .status(200)
      .json({ message: "Profile picture updated", picture: user.picture });
  } catch (err) {
    res.status(500).json({ error: "Failed to save profile picture" });
  }
};

// GET /api/users/me/picture — get the current picture's metadata
export const getPicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user?.picture?.url) {
      return res.status(404).json({ error: "No profile picture set" });
    }

    res.status(200).json({ picture: user.picture });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve picture" });
  }
};

// DELETE /api/users/me/picture — remove the current picture
export const deletePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user?.picture?.filename) {
      return res.status(404).json({ error: "No profile picture to delete" });
    }

    const filePath = path.join("uploads", user.picture.filename);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete picture file:", err.message);
    });

    user.picture = undefined;
    await user.save();

    res.status(200).json({ message: "Profile picture removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete picture" });
  }
};
