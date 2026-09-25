import express from 'express';
import { uploadFile, getFiles, getFileById } from '../controllers/fileController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// upload.single('image') runs multer BEFORE uploadFile — it parses the
// multipart request and populates req.file, using 'image' as the form field name
router.post('/upload', upload.single('image'), uploadFile);

router.get('/files', getFiles);
router.get('/files/:id', getFileById);

export default router;