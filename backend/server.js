import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import videoRoutes from './routes/videos.js';
import noteRoutes from './routes/notes.js';
import eventLogRoutes from './routes/eventLogs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(express.json());
app.use(cors());

app.set('trust proxy', true);

// Routes
app.use('/api/videos', videoRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/event-logs', eventLogRoutes);

app.get("/", (req, res) => {
    res.json({ 
        message: "YouTube Video Management API is running!", 
        status: "OK",
    });
});


app.listen(PORT, () => {
    console.log("Server is started at port " + PORT);
});
