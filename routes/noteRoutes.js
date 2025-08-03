// routes/noteRoutes.js

import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Middleware to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to uploads/ folder
  },
  filename: (req, file, cb) => {
    // Unique filename: timestamp + original name
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const notes = []; // This will reset every time server restarts

// Create a note
router.post('/', upload.single('file'), (req, res) => {
  const { title, content } = req.body;

  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const note = {
    id: Date.now(),
    title,
    content,
    filePath: `/uploads/${req.file.filename}`
  };

  notes.push(note);

  res.json({
    message: 'File uploaded successfully',
    note
  });
});

// Get all notes
router.get('/', (req, res) => {
  res.json(notes);
});

// Get a single note by ID
router.get('/:id', (req, res) => {
  const note = notes.find(n => n.id == req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// Delete a note by ID
router.delete('/:id', (req, res) => {
  const index = notes.findIndex(n => n.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Note not found' });

  notes.splice(index, 1);
  res.json({ message: 'Note deleted' });
});

export default router;
