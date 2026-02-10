require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Middleware
const errorHandler = require('./middleware/error');

// Routes
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const leaderboardRoutes = require('./routes/leaderboard');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 5000;

// Senior Best Practice: Security & Middleware configuration
app.use(cors({
    origin: '*', // In production, restrict this to your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Routes Integration
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/progress', progressRoutes);

// Legacy Task Routes (Example of modular expansion)
// app.use('/api/tasks', require('./routes/tasks'));

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Global Error Handler (MUST BE LAST)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`
🚀 Enable U - Senior Backend Architecture Online
📡 Server running on http://localhost:${PORT}
📁 Data Persistence: Local JSON with Atomic Writes
    `);
});
