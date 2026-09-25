# File / Image Upload API

A RESTful API for uploading and serving images, built as Task 3 of the SYNTECXHUB Virtual Internship Program (Backend Development). Files are stored locally on disk; metadata is stored in MongoDB Atlas.

**Author:** Michael Samuel Oche
**Internship:** SYNTECXHUB — Backend Development, Virtual Internship Program

## Features

- Single image upload via `multipart/form-data`
- File type validation — JPEG and PNG only
- 5MB file size limit
- File metadata (filename, original name, path, URL, size, upload date) stored in MongoDB
- Uploaded images served directly by URL
- Consistent error handling for invalid file types, oversized files, and missing resources

## Getting started

```bash
npm install
```

Create a `.env` file in the project root:

```
MONGO_URI=your_mongodb_atlas_connection_string
```

Then run:

```bash
npm start
```

The server runs on `http://localhost:3000` by default (override with a `PORT` environment variable).

## Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/upload` | Upload an image (form-data field name: `image`) |
| GET | `/files` | List all uploaded files, newest first |
| GET | `/files/:id` | Get metadata for one uploaded file |
| GET | `/uploads/:filename` | Access the actual image file directly |

## Uploading a file

Send a `POST` request to `/upload` with `multipart/form-data`, using the field name **`image`**:

```
POST /upload
Content-Type: multipart/form-data

image: <your file>
```

Response:

```json
{
  "_id": "651f1a2b3c4d5e6f7a8b9c0d",
  "filename": "1727884213481-372910284.jpg",
  "originalName": "vacation_photo.jpg",
  "path": "uploads/1727884213481-372910284.jpg",
  "url": "http://localhost:3000/uploads/1727884213481-372910284.jpg",
  "mimetype": "image/jpeg",
  "size": 204800,
  "uploadedAt": "2026-09-25T10:15:32.000Z"
}
```

Open the `url` value directly in a browser to view the uploaded image.

## Validation rules

| Rule | Behavior on failure |
|---|---|
| File type must be JPEG or PNG | 400 — "Only JPEG and PNG images are allowed" |
| File size must be ≤ 2MB | 400 — multer's file-size-limit error |
| No file provided | 400 — "No file uploaded" |
| File ID doesn't exist (`GET /files/:id`) | 404 — "File not found" |

## Project structure

```
Syntecxhub-file-upload-API/
├── uploads/                  # Uploaded image files (empty in repo, populated at runtime)
├── config/
│   └── db.js                 # MongoDB Atlas connection
├── models/
│   └── File.js                # Mongoose schema for file metadata
├── middleware/
│   └── upload.js              # Multer configuration (storage, validation, limits)
├── controllers/
│   └── fileController.js     # Upload, list, and get-by-id logic
├── routes/
│   └── fileRoutes.js         # Route definitions
├── server.js                  # App entry point
└── package.json
```