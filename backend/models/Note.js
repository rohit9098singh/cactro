import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['improvement', 'ideas', 'feedback', 'general'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

export default mongoose.model('Note', noteSchema);
