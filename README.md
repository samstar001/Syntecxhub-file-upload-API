# File Upload API with Metadata

A RESTful API for uploading and serving images, built for the Syntecxhub Backend
Development Internship. Started as Task 3 (general file upload with metadata),
and extended here as Project 3 to support user profile pictures — linking
uploaded files to an authenticated user's document, built on top of the User
Authentication System from Project 1.

**Author:** Michael Samuel Oche (Samstar)
**Internship:** Syntecxhub — Backend Development, Virtual Internship Program

## Features

### General file upload (original)

- Single image upload via `multipart/form-data`
- File type validation — JPEG and PNG only
- 2MB file size limit
- File metadata (filename, original name, path, URL, size, upload date) stored in MongoDB
- Uploaded images served directly by URL
- Consistent error handling for invalid file types, oversized files, and missing resources

### Profile pictures (new)

- Authenticated users can upload, update, or delete their own profile picture
- Uploading a new picture automatically replaces and removes the old file from disk
- Picture metadata is stored directly on the user's own document
- Reuses the same validation rules as general uploads (JPEG/PNG, 2MB max)
- Every profile picture route requires a valid JWT

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **File handling:** Multer
- **Authentication:** JSON Web Token (shared secret with the User Authentication System)

## Project Structure

```
Syntecxhub-file-upload-API/
├── uploads/                        # Uploaded files (empty in repo, populated at runtime)
├── config/
│   └── db.js                       # MongoDB Atlas connection
├── models/
│   ├── File.js                     # Metadata schema for general uploads
│   └── User.js                     # User schema, extended with a `picture` field
├── middleware/
│   ├── upload.js                   # Multer configuration (storage, validation, limits)
│   └── authMiddleware.js           # JWT verification (shared pattern with auth repo)
├── controllers/
│   ├── fileController.js           # General upload: create, list, get-by-id
│   └── profilePictureController.js # Profile picture: upload, get, delete
├── routes/
│   ├── fileRoutes.js                # General upload routes
│   └── userRoutes.js               # Profile picture routes
├── server.js
└── package.json
```

## Getting Started

```bash
npm install
```

Create a `.env` file in the project root:

```
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

> **Important:** `JWT_SECRET` must be the exact same value used in the User
> Authentication System repo. Tokens issued by logging in there are verified
> here — a mismatched secret will cause every profile picture request to
> fail with `401 Invalid or expired token`, even with a valid, freshly
> issued token.

Then run:

```bash
npm start
```

The server runs on `http://localhost:3000` by default (override with `PORT`).

## Endpoints

### General file upload

| Method | Path                 | Description                           | Access |
| ------ | -------------------- | ------------------------------------- | ------ |
| POST   | `/upload`            | Upload an image (form field: `image`) | Public |
| GET    | `/files`             | List all uploaded files, newest first | Public |
| GET    | `/files/:id`         | Get metadata for one uploaded file    | Public |
| GET    | `/uploads/:filename` | Access the actual image file directly | Public |

### Profile pictures

| Method | Path                    | Description                                                    | Access  |
| ------ | ----------------------- | -------------------------------------------------------------- | ------- |
| POST   | `/api/users/me/picture` | Upload or replace your profile picture (form field: `picture`) | Private |
| GET    | `/api/users/me/picture` | Get your current profile picture's metadata                    | Private |
| DELETE | `/api/users/me/picture` | Remove your profile picture                                    | Private |

Protected routes require:

```
Authorization: Bearer <your_jwt_token>
```

(Obtained by logging in through the User Authentication System repo — both
repos must share the same `JWT_SECRET`.)

## Uploading a General File

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

## Uploading a Profile Picture

```
POST /api/users/me/picture
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data

picture: <your file>
```

Response:

```json
{
  "message": "Profile picture updated",
  "picture": {
    "filename": "1727884213481-372910284.jpg",
    "originalName": "profile.jpg",
    "url": "http://localhost:3000/uploads/1727884213481-372910284.jpg",
    "uploadedAt": "2026-09-25T10:15:32.000Z"
  }
}
```

Uploading again automatically deletes the previous picture file from disk and
replaces the metadata on your user document.

## Validation Rules

| Rule                                     | Behavior on failure                                             |
| ---------------------------------------- | --------------------------------------------------------------- |
| File type must be JPEG or PNG            | 400 — "Only JPEG and PNG images are allowed"                    |
| File size must be ≤ 2MB                  | 400 — multer's file-size-limit error                            |
| No file provided                         | 400 — "No file uploaded"                                        |
| File ID doesn't exist (`GET /files/:id`) | 404 — "File not found"                                          |
| No valid/any JWT on a protected route    | 401 — "No token, access denied" / "Invalid or expired token"    |
| No profile picture set yet               | 404 — "No profile picture set" / "No profile picture to delete" |

## Security Notes

- Profile picture routes always resolve the user from the verified JWT
  (`req.user.id`), never from a client-supplied ID — a user can only ever
  upload, view, or delete their own picture.
- `User.js` and `authMiddleware.js` in this repo are duplicated from the
  User Authentication System repo rather than imported across projects,
  since the two are independent, separately deployed submissions. They're
  kept in sync manually; if the auth logic changes in one repo, it should
  be mirrored in the other.

## Testing

All endpoints were tested manually with Postman, covering:

- Successful upload, replace, and delete of a profile picture
- Rejected uploads for invalid file types and oversized files
- Requests to protected routes with no token, an invalid token, and a
  token issued by the separate auth repo
- Fetching/deleting a picture when none has been set yet

## License

This project is for educational purposes under the Syntecxhub Internship program.
