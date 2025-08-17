import mongoose from 'mongoose';

const eventLogSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: [
      'video_fetched',
      'video_updated', 
      'comment_added',
      'comment_replied',
      'comment_deleted',
      'note_created',
      'note_updated',
      'note_deleted',
      'api_error',
      'user_action'
    ]
  },
  videoId: {
    type: String,
    default: null
  },
  commentId: {
    type: String,
    default: null
  },
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    default: null
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  userAgent: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: ''
  },
  success: {
    type: Boolean,
    default: true
  },
  errorMessage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('EventLog', eventLogSchema);
