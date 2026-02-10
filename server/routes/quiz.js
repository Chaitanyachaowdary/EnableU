const express = require('express');
const router = express.Router();
const { readData, writeData, FILES } = require('../services/dataService');
const { authenticateToken } = require('../middleware/auth');

// Get all quizzes
router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const quizzes = await readData(FILES.QUIZZES);
        const safeQuizzes = quizzes.map(q => ({
            ...q,
            questions: q.questions.map(qt => ({ id: qt.id, text: qt.text, options: qt.options }))
        }));
        res.json(safeQuizzes);
    } catch (e) { next(e); }
});

// Submit Quiz (Fixes Leaderboard Update)
router.post('/:id/submit', authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { answers } = req.body;
        const quizzes = await readData(FILES.QUIZZES);
        const quiz = quizzes.find(q => q.id === id);

        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let correctCount = 0;
        quiz.questions.forEach(q => {
            if (answers[q.id] === q.correctOptionId) correctCount++;
        });

        const percentage = correctCount / quiz.questions.length;
        const pointsAwarded = Math.round(percentage * (quiz.points || 100)); // Ensure points exists

        const users = await readData(FILES.USERS);
        const userIndex = users.findIndex(u => u.id === req.user.id);

        if (userIndex !== -1) {
            // Ensure gamification structure exists
            if (!users[userIndex].gamification) {
                users[userIndex].gamification = { points: 0, level: 1, badges: [], streak: 0 };
            }

            users[userIndex].gamification.points += pointsAwarded;
            users[userIndex].gamification.streak += 1;

            if (percentage === 1) {
                const badgeName = `Master of ${quiz.title}`;
                if (!users[userIndex].gamification.badges.includes(badgeName)) {
                    users[userIndex].gamification.badges.push(badgeName);
                }
            }
            await writeData(FILES.USERS, users);
            console.log(`[GAME] Awarded ${pointsAwarded} pts to ${users[userIndex].email}`);
        }

        const results = await readData(FILES.RESULTS);
        const newResult = {
            id: Date.now().toString(),
            userId: req.user.id,
            quizId: id,
            score: pointsAwarded,
            correctCount,
            totalQuestions: quiz.questions.length,
            completedAt: new Date().toISOString()
        };
        results.push(newResult);
        await writeData(FILES.RESULTS, results);

        res.json({
            message: 'Quiz submitted',
            score: pointsAwarded,
            correctCount,
            totalQuestions: quiz.questions.length,
            badges: users[userIndex]?.gamification.badges || []
        });
    } catch (e) { next(e); }
});

module.exports = router;
