// controllers/noteController.js

import Note from '../models/Note.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

// @desc Create a new note with optional PDF upload
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    let uploadedResponse = null;

    if (req.file) {
      uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'raw', // ✅ use 'raw' for PDFs
        folder: 'notes',
      });

      // Clean up temporary local file
      fs.unlinkSync(req.file.path);
    }

    const newNote = new Note({
      title,
      content,
      ...(uploadedResponse && {
        fileUrl: uploadedResponse.secure_url,
        publicId: uploadedResponse.public_id,
      }),
    });

    const savedNote = await newNote.save();
    res.status(201).json({
      message: 'Note created successfully',
      note: savedNote,
    });
  } catch (error) {
    console.error('❌ Error creating note:', error);
    res.status(500).json({ message: 'Server error while creating note' });
  }
};

// Get all notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('❌ Error fetching notes:', error);
    res.status(500).json({ message: 'Server error while fetching notes' });
  }
};

// Get a single note
export const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (error) {
    console.error('❌ Error fetching note:', error);
    res.status(500).json({ message: 'Server error while fetching note' });
  }
};

// Delete a note (and its Cloudinary file if any)
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (note.publicId) {
      await cloudinary.uploader.destroy(note.publicId, { resource_type: 'raw' });
    }

    await note.remove();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting note:', error);
    res.status(500).json({ message: 'Server error while deleting note' });
  }
};
