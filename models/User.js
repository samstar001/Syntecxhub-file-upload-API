// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // holds the current profile picture's metadata, or is absent if none set
  picture: {
    filename: { type: String },
    originalName: { type: String },
    url: { type: String },
    uploadedAt: { type: Date },
  },
});

export default mongoose.model("User", UserSchema);
