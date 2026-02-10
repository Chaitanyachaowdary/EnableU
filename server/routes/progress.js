const express = require('express');
const router = express.Router();
const { readData, FILES } = require('../services/dataService');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const results = await readData(FILES.RESULTS);
        const userResults = results.filter(r => r.userId === req.user.id);
        const quizzes = await readData(FILES.QUIZZES);

        const totalPoints = userResults.reduce((sum, r) => sum + r.score, 0);
        const completedQuizzes = [...new Set(userResults.map(r => r.quizId))].length;
        const averageScore = userResults.length > 0
            ? Math.round(userResults.reduce((sum, r) => sum + r.score, 0) / userResults.length)
            : 0;

        res.json({
            totalPoints,
            completedQuizzes,
            totalQuizzes: quizzes.length,
            completionPercentage: Math.round((completedQuizzes / (quizzes.length || 1)) * 100),
            averageScore,
            totalTimeSpent: userResults.reduce((sum, r) => sum + (r.timeSpent || 0), 0),
            recentActivity: userResults.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0, 5),
            totalBadges: userResults.filter(r => r.score >= 100).length // Simplified badge count
        });
    } catch (e) { next(e); }
});

module.exports = router;
