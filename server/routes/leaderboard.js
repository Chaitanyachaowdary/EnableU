const express = require('express');
const router = express.Router();
const { readData, writeData, FILES } = require('../services/dataService');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const users = await readData(FILES.USERS);
        const leaderboard = users
            .filter(u => u.email) // Ensure user has email
            .map(u => ({
                id: u.id,
                email: u.email,
                points: u.gamification?.points || 0,
                badges: u.gamification?.badges?.length || 0
            }))
            .sort((a, b) => b.points - a.points)
            .slice(0, 10);
        res.json(leaderboard);
    } catch (e) { next(e); }
});

module.exports = router;
