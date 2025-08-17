import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  youtubeId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  statistics: {
    viewCount: { type: String, default: '0' },
    likeCount: { type: String, default: '0' },
    commentCount: { type: String, default: '0' }
  },
  status: {
    uploadStatus: { type: String, default: 'processed' },
    privacyStatus: { type: String, default: 'unlisted' }
  }
}, {
  timestamps: true
});

export default mongoose.model('Video', videoSchema);
