const express = require('express');
const asyncHandler = require('express-async-handler');
const Note = require('../models/Note'); 

const router = express.Router();

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const notes = await Note.find({});
    res.json(notes);
  })
);

// ✅ @desc    Create a new note
// ✅ @route   POST /api/notes
// ✅ @access  Public
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400);
      throw new Error('Please fill all fields');
    }

    const note = new Note({ title, content });
    const createdNote = await note.save();
    res.status(201).json(createdNote);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }
    res.json(note);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }
    note.title = title || note.title;
    note.content = content || note.content;
    const updatedNote = await note.save();
    res.json(updatedNote);
  })
); 

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }
    await Note.findByIdAndDelete(req.params.id);

    res.json({ message: 'Note removed' });
  })
);

module.exports = router;
