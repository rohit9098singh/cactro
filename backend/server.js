import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import connectDB from './config/db.js';
import videoRoutes from './routes/videos.js';
import noteRoutes from './routes/notes.js';
import eventLogRoutes from './routes/eventLogs.js';
import googleController from './routes/googleController.js';
import youtubeAuth from './routes/youtubeAuth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    credentials: true
}));

app.set('trust proxy', true);

// Session configuration for Passport
app.use(session({
    secret: process.env.JWT_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/videos', videoRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/event-logs', eventLogRoutes);
app.use('/auth', googleController);
app.use('/auth', youtubeAuth);

app.get("/", (req, res) => {
    res.json({ 
        message: "YouTube Video Management API is running!", 
        status: "OK",
    });
});


app.listen(PORT, () => {
    console.log("Server is started at port " + PORT);
});
