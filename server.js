import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import connectDB from './config/db.js';
import fileRoutes from './routes/fileRoutes.js';

// __dirname isn't available in ES modules by default — this recreates it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas before the app starts handling requests
connectDB();

app.use(express.json());

// Serve the uploads/ folder statically — this is what makes
// http://localhost:3000/uploads/<filename> actually return the image
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount the file routes at the root — paths are /upload, /files, /files/:id
app.use('/', fileRoutes);

// Catch-all for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler — checks for multer-specific errors first
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // e.g. file too large, or wrong field name
    return res.status(400).json({ error: err.message });
  }
  if (err.message === 'Only JPEG and PNG images are allowed') {
    // thrown manually from fileFilter — not a MulterError instance
    return res.status(400).json({ error: err.message });
  }

  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});