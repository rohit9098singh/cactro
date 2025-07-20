import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

class YouTubeService {
  constructor() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    });
  }

  async getVideoDetails(videoId) {
    try {
      const response = await this.youtube.videos.list({
        part: ['snippet', 'statistics', 'status', 'contentDetails'],
        id: [videoId]
      });

      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0];
      }
      
      throw new Error('Video not found');
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw error;
    }
  }

  async updateVideoDetails(videoId, title, description) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET,
        process.env.YOUTUBE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        access_token: process.env.YOUTUBE_ACCESS_TOKEN,
        refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
      });

      const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
      });

      const response = await youtube.videos.update({
        part: ['snippet'],
        requestBody: {
          id: videoId,
          snippet: {
            title: title,
            description: description,
            categoryId: '22'
          }
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  }

  async getVideoComments(videoId, maxResults = 20) {
    try {
      const response = await this.youtube.commentThreads.list({
        part: ['snippet', 'replies'],
        videoId: videoId,
        maxResults: maxResults,
        order: 'time'
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async addComment(videoId, text) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET,
        process.env.YOUTUBE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        access_token: process.env.YOUTUBE_ACCESS_TOKEN,
        refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
      });

      const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
      });

      const response = await youtube.commentThreads.insert({
        part: ['snippet'],
        requestBody: {
          snippet: {
            videoId: videoId,
            topLevelComment: {
              snippet: {
                textOriginal: text
              }
            }
          }
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async replyToComment(commentId, text) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET,
        process.env.YOUTUBE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        access_token: process.env.YOUTUBE_ACCESS_TOKEN,
        refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
      });

      const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
      });

      const response = await youtube.comments.insert({
        part: ['snippet'],
        requestBody: {
          snippet: {
            parentId: commentId,
            textOriginal: text
          }
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error replying to comment:', error);
      throw error;
    }
  }

  async deleteComment(commentId) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET,
        process.env.YOUTUBE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        access_token: process.env.YOUTUBE_ACCESS_TOKEN,
        refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
      });

      const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
      });

      await youtube.comments.delete({
        id: commentId
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}

export default new YouTubeService();
