import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email 
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      accessType: 'offline', // This is important to get refresh token
      prompt: 'consent', // This forces consent screen to appear and get refresh token
      scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.force-ssl']
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const { displayName, emails, photos } = profile;

        let user = await User.findOne({ email: emails[0].value });

        if (user) {
          // Update existing user with new tokens
          user.googleAccessToken = accessToken;
          if (refreshToken) {
            user.googleRefreshToken = refreshToken;
          }
          if (!user.profilePicture) {
            user.profilePicture = photos[0]?.value;
          }
          await user.save();
        } else {
          // Create new user with tokens
          user = await User.create({
            username: displayName,
            email: emails[0]?.value,
            profilePicture: photos[0]?.value,
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken,
          });
        }

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error);
      }
    }
  )
);

// Passport serialization (required for sessions)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Routes

// Debug route to check configuration
router.get("/debug", (req, res) => {
  res.json({
    clientID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    currentURL: `${req.protocol}://${req.get('host')}${req.originalUrl}`
  });
});

// Initiate Google OAuth
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email", "https://www.googleapis.com/auth/youtube", "https://www.googleapis.com/auth/youtube.force-ssl"],
  accessType: 'offline',
  prompt: 'consent'
}));

// Google OAuth callback
router.get("/google/callback", 
  passport.authenticate("google", { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
    session: false 
  }),
  (req, res) => {
    try {
      const accessToken = generateToken(req.user);
      
      // Include user data in the redirect
      const userData = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture
      };
      
      // Redirect with token and user data as URL parameters
      const userParam = encodeURIComponent(JSON.stringify(userData));
      res.redirect(`${process.env.FRONTEND_URL}?token=${accessToken}&user=${userParam}&success=oauth_complete`);
    } catch (error) {
      console.error('Token generation error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
  }
);

// Get user profile (protected route)
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-googleAccessToken -googleRefreshToken');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile"
    });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed"
      });
    }
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token"
      });
    }
    req.user = user;
    next();
  });
}

export default router;
