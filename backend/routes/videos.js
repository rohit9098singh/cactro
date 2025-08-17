import express from 'express';
import Video from '../models/Video.js';
import youtubeService from '../services/youtubeService.js';
import { eventLogger, logEvent } from '../middleware/eventLogger.js';

const router = express.Router();

// Get video details by YouTube ID
router.get('/:videoId', eventLogger('video_fetched'), async (req, res) => {
  try {
    const { videoId } = req.params;
    
    // Check if video exists in our database
    let video = await Video.findOne({ youtubeId: videoId });
    
    if (!video) {
      // Fetch from YouTube API
      const youtubeData = await youtubeService.getVideoDetails(videoId);
      
      // Save to database
      video = new Video({
        youtubeId: videoId,
        title: youtubeData.snippet.title,
        description: youtubeData.snippet.description,
        thumbnail: youtubeData.snippet.thumbnails.high?.url || youtubeData.snippet.thumbnails.default?.url,
        duration: youtubeData.contentDetails.duration,
        publishedAt: youtubeData.snippet.publishedAt,
        statistics: {
          viewCount: youtubeData.statistics.viewCount || '0',
          likeCount: youtubeData.statistics.likeCount || '0',
          commentCount: youtubeData.statistics.commentCount || '0'
        },
        status: {
          uploadStatus: youtubeData.status.uploadStatus,
          privacyStatus: youtubeData.status.privacyStatus
        }
      });
      
      await video.save();
    } else {
      // Update statistics from YouTube
      try {
        const youtubeData = await youtubeService.getVideoDetails(videoId);
        video.statistics = {
          viewCount: youtubeData.statistics.viewCount || '0',
          likeCount: youtubeData.statistics.likeCount || '0',
          commentCount: youtubeData.statistics.commentCount || '0'
        };
        await video.save();
      } catch (error) {
        console.log('Could not update statistics:', error.message);
      }
    }
    
    res.json({
      success: true,
      data: video
    });
  } catch (error) {
    await logEvent('api_error', req.params.videoId, null, null, { error: error.message }, req, false, error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching video details',
      error: error.message
    });
  }
});

// Update video title and description
router.put('/:videoId', eventLogger('video_updated'), async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Update on YouTube
    await youtubeService.updateVideoDetails(videoId, title, description || '');
    
    // Update in our database
    const video = await Video.findOneAndUpdate(
      { youtubeId: videoId },
      { 
        title: title,
        description: description || ''
      },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.json({
      success: true,
      data: video,
      message: 'Video updated successfully'
    });
  } catch (error) {
    await logEvent('api_error', req.params.videoId, null, null, { error: error.message }, req, false, error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating video',
      error: error.message
    });
  }
});

// Get video comments
router.get('/:videoId/comments', eventLogger('user_action'), async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await youtubeService.getVideoComments(videoId);
    
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    await logEvent('api_error', req.params.videoId, null, null, { error: error.message }, req, false, error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
});

// Add comment to video
router.post('/:videoId/comments', eventLogger('comment_added'), async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const comment = await youtubeService.addComment(videoId, text);
    
    res.json({
      success: true,
      data: comment,
      message: 'Comment added successfully'
    });
  } catch (error) {
    await logEvent('api_error', req.params.videoId, null, null, { error: error.message }, req, false, error.message);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
});

// Reply to comment
router.post('/:videoId/comments/:commentId/reply', eventLogger('comment_replied'), async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Reply text is required'
      });
    }

    const reply = await youtubeService.replyToComment(commentId, text);
    
    res.json({
      success: true,
      data: reply,
      message: 'Reply added successfully'
    });
  } catch (error) {
    await logEvent('api_error', req.params.videoId, req.params.commentId, null, { error: error.message }, req, false, error.message);
    res.status(500).json({
      success: false,
      message: 'Error replying to comment',
      error: error.message
    });
  }
});

// Delete comment
router.delete('/:videoId/comments/:commentId', eventLogger('comment_deleted'), async (req, res) => {
  try {
    const { commentId } = req.params;
    
    await youtubeService.deleteComment(commentId);
    
    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    await logEvent('api_error', req.params.videoId, req.params.commentId, null, { error: error.message }, req, false, error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
});

export default router;
