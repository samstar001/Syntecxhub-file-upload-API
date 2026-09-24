import mongoose from 'mongoose';

// Defines the shape of a file-metadata document
const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },       // generated, unique name on disk
  originalName: { type: String, required: true },   // name before upload
  path: { type: String, required: true },            // location in uploads/
  url: { type: String, required: true },              // full servable URL
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

export default File;