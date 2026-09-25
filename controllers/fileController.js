import File from '../models/File.js';

// POST /upload — handle a single file upload
async function uploadFile(req, res) {
  // multer rejects bad files before this runs
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const newFile = await File.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      url: fileUrl,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    res.status(201).json(newFile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save file metadata' });
  }
}

// GET /files — list all uploaded files
async function getFiles(req, res) {
  try {
    const files = await File.find().sort({ uploadedAt: -1 }); // newest first
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
}

// GET /files/:id — get metadata for one uploaded file
async function getFileById(req, res) {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.status(200).json(file);
  } catch (err) {
    res.status(500).json({ error: 'Invalid file ID' });
  }
}

export { uploadFile, getFiles, getFileById };