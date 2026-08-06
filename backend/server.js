import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded PDFs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize DB
await initDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);


// Root health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: '🚀 AI Resume Analyzer API is running smoothly.',
    aiProvider: process.env.GEMINI_API_KEY ? 'Google Gemini API' : (process.env.OPENAI_API_KEY ? 'OpenAI API' : 'Smart Demo Mode')
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred on the server.'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌟 Backend API running on http://localhost:${PORT}`);
  console.log(`🤖 Active AI Engine: ${process.env.GEMINI_API_KEY ? 'Google Gemini API' : (process.env.OPENAI_API_KEY ? 'OpenAI API' : 'Smart Demo Mode (No API keys required)')}`);
});
