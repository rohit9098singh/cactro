import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// OAuth2 client for YouTube API
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// Generate YouTube auth URL
router.get('/youtube', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl'
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent' // Force consent to get refresh token
  });

  res.json({
    success: true,
    authUrl: authUrl
  });
});

// Handle YouTube OAuth callback
router.get('/youtube/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Authorization code is required'
    });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    // Set credentials for future requests
    oauth2Client.setCredentials(tokens);

    // You can save these tokens to your database here
    // For now, we'll return them in the response
    res.json({
      success: true,
      message: 'YouTube authentication successful!',
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date
      }
    });
  } catch (error) {
    console.error('Error getting YouTube tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get YouTube tokens',
      error: error.message
    });
  }
});

// Get current token status
router.get('/youtube/status', (req, res) => {
  const hasTokens = !!(process.env.YOUTUBE_ACCESS_TOKEN && process.env.YOUTUBE_REFRESH_TOKEN);
  
  res.json({
    success: true,
    hasTokens: hasTokens,
    accessToken: process.env.YOUTUBE_ACCESS_TOKEN ? 'Set' : 'Not set',
    refreshToken: process.env.YOUTUBE_REFRESH_TOKEN ? 'Set' : 'Not set'
  });
});

// Refresh YouTube access token
router.post('/youtube/refresh', async (req, res) => {
  try {
    if (!process.env.YOUTUBE_REFRESH_TOKEN) {
      return res.status(400).json({
        success: false,
        message: 'No refresh token available. Please re-authenticate.'
      });
    }

    oauth2Client.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
    });

    const { credentials } = await oauth2Client.refreshAccessToken();
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken: credentials.access_token,
      expiryDate: credentials.expiry_date
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: error.message
    });
  }
});

export default router;
