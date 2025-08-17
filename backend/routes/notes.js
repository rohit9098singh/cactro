import express from 'express';
import Note from '../models/Note.js';
import { eventLogger, logEvent } from '../middleware/eventLogger.js';

const router = express.Router();

// Get all notes for a video
router.get('/video/:videoId', eventLogger('user_action'), async (req, res) => {
  try {
    const { videoId } = req.params;
    const notes = await Note.find({ videoId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: notes
    });
  } catch (error) {
    await logEvent('api_error', req.params.videoId, null, null, { error: error.message }, req, false, error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching notes',
      error: error.message
    });
  }
});

// Create a new note
router.post('/', eventLogger('note_created'), async (req, res) => {
  try {
    const { videoId, title, content, category, priority } = req.body;

    if (!videoId || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Video ID, title, and content are required'
      });
    }

    const note = new Note({
      videoId,
      title,
      content,
      category: category || 'general',
      priority: priority || 'medium'
    });

    await note.save();
    
    res.status(201).json({
      success: true,
      data: note,
      message: 'Note created successfully'
    });
  } catch (error) {
    await logEvent('api_error', req.body.videoId, null, null, { error: error.message }, req, false, error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating note',
      error: error.message
    });
  }
});

// Update a note
router.put('/:noteId', eventLogger('note_updated'), async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content, category, priority } = req.body;

    const note = await Note.findByIdAndUpdate(
      noteId,
      { 
        title, 
        content, 
        category: category || 'general',
        priority: priority || 'medium'
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      data: note,
      message: 'Note updated successfully'
    });
  } catch (error) {
    await logEvent('api_error', null, null, req.params.noteId, { error: error.message }, req, false, error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating note',
      error: error.message
    });
  }
});

// Delete a note
router.delete('/:noteId', eventLogger('note_deleted'), async (req, res) => {
  try {
    const { noteId } = req.params;
    
    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    await logEvent('api_error', null, null, req.params.noteId, { error: error.message }, req, false, error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting note',
      error: error.message
    });
  }
});

// Get a single note
router.get('/:noteId', eventLogger('user_action'), async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    await logEvent('api_error', null, null, req.params.noteId, { error: error.message }, req, false, error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching note',
      error: error.message
    });
  }
});

export default router;
