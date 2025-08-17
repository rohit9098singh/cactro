import { google } from 'googleapis';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

class YouTubeService {
  constructor() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    });
    
    // Initialize OAuth client for authenticated requests
    this.oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );
    
    this.oauth2Client.setCredentials({
      access_token: process.env.YOUTUBE_ACCESS_TOKEN,
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
    });

    // Set up automatic token refresh
    this.oauth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        // Update the .env file with new tokens
        this.updateEnvTokens(tokens);
      }
    });
  }

  async updateEnvTokens(tokens) {
    try {
      const envPath = path.resolve('.env');
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      if (tokens.access_token) {
        envContent = envContent.replace(
          /YOUTUBE_ACCESS_TOKEN=.*/,
          `YOUTUBE_ACCESS_TOKEN=${tokens.access_token}`
        );
      }
      
      if (tokens.refresh_token) {
        envContent = envContent.replace(
          /YOUTUBE_REFRESH_TOKEN=.*/,
          `YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`
        );
      }
      
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Updated .env file with new YouTube tokens');
    } catch (error) {
      console.error('❌ Error updating .env file:', error);
    }
  }

  async ensureValidToken() {
    try {
      // Try to refresh the token if it's expired
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      this.oauth2Client.setCredentials(credentials);
      return true;
    } catch (error) {
      console.error('❌ Error refreshing token:', error);
      throw new Error('YouTube authentication failed. Please re-authorize the application.');
    }
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
      await this.ensureValidToken();

      const youtube = google.youtube({
        version: 'v3',
        auth: this.oauth2Client
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
      await this.ensureValidToken();

      const youtube = google.youtube({
        version: 'v3',
        auth: this.oauth2Client
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
      await this.ensureValidToken();

      const youtube = google.youtube({
        version: 'v3',
        auth: this.oauth2Client
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
      await this.ensureValidToken();

      const youtube = google.youtube({
        version: 'v3',
        auth: this.oauth2Client
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
