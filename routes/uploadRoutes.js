import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Set up storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Route: POST /api/notes/upload
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

export default router;
