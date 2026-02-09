const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'super-secret-key-change-this'; // In prod, use env var
const TASKS_FILE = path.join(__dirname, 'tasks.json');
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(bodyParser.json());

// Helper functions for file persistence
const readData = async (file, defaultData = []) => {
    try {
        const data = await fs.readFile(file, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(file, JSON.stringify(defaultData, null, 2));
            return defaultData;
        }
        throw error;
    }
};

const writeData = async (file, data) => {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
};

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // { id, email, role }
        next();
    });
};

// --- AUTH ROUTS ---

// Register (Story 1.1)
app.post('/api/auth/register', async (req, res) => {
    const { email, password, accessibilitySettings } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const users = await readData(USERS_FILE);
    if (users.find(u => u.email === email)) {
        return res.status(409).json({ message: 'Email already registered.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
        id: crypto.randomUUID(),
        email,
        passwordHash,
        role: 'student', // default
        isVerified: false, // verification simulation
        verificationToken: crypto.randomBytes(32).toString('hex'),
        accessibilitySettings: accessibilitySettings || { highContrast: false, reduceMotion: false },
        gamification: {
            points: 0,
            level: 1,
            badges: [],
            streak: 0
        },
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeData(USERS_FILE, users);

    console.log(`[SIMULATION] Verification email sent to ${email} with token: ${newUser.verificationToken}`);

    res.status(201).json({ message: 'Registration successful. Please check your email to verify account.' });
});

// Login (Story 1.2)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    const users = await readData(USERS_FILE);
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            accessibilitySettings: user.accessibilitySettings,
            gamification: user.gamification
        }
    });
});

// Password Recovery (Story 1.3 - Request)
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    const users = await readData(USERS_FILE);
    const user = users.find(u => u.email === email);

    if (user) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + 3600000; // 1 hour

        user.resetToken = resetToken;
        user.resetTokenExpires = expires;
        await writeData(USERS_FILE, users);

        console.log(`[SIMULATION] Password reset email sent to ${email}. Token: ${resetToken}`);
    }

    // Always return success to prevent enumeration
    res.json({ message: 'If that email exists, a reset link has been sent.' });
});

// Password Recovery (Story 1.3 - Reset)
app.post('/api/auth/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    const users = await readData(USERS_FILE);

    const user = users.find(u =>
        u.resetToken === token &&
        u.resetTokenExpires > Date.now()
    );

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await writeData(USERS_FILE, users);

    res.json({ message: 'Password has been reset successfully.' });
});


// --- GAMIFICATION & QUIZ ROUTES ---

const QUIZZES_FILE = path.join(__dirname, 'quizzes.json');
const RESULTS_FILE = path.join(__dirname, 'results.json');

// Get all quizzes
app.get('/api/quizzes', authenticateToken, async (req, res) => {
    const quizzes = await readData(QUIZZES_FILE);
    // Remove correct answers from client response
    const safeQuizzes = quizzes.map(q => ({
        ...q,
        questions: q.questions.map(qt => ({
            id: qt.id,
            text: qt.text,
            options: qt.options
        }))
    }));
    res.json(safeQuizzes);
});

// Get single quiz
app.get('/api/quizzes/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const quizzes = await readData(QUIZZES_FILE);
    const quiz = quizzes.find(q => q.id === id);

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Safe response
    const safeQuiz = {
        ...quiz,
        questions: quiz.questions.map(qt => ({
            id: qt.id,
            text: qt.text,
            options: qt.options
        }))
    };
    res.json(safeQuiz);
});

// Submit Quiz
app.post('/api/quizzes/:id/submit', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { answers } = req.body; // { q1: 'a', q2: 'b' }

    const quizzes = await readData(QUIZZES_FILE);
    const quiz = quizzes.find(q => q.id === id);

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    let correctCount = 0;

    quiz.questions.forEach(q => {
        if (answers[q.id] === q.correctOptionId) {
            correctCount++;
        }
    });

    // Calculate score (simple percentage * points)
    const percentage = correctCount / quiz.questions.length;
    const pointsAwarded = Math.round(percentage * quiz.points);

    // Update User Stats
    const users = await readData(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex !== -1) {
        users[userIndex].gamification.points += pointsAwarded;
        // Simple streak logic (increment if last activity was yesterday - skipped for MVP, just increment)
        users[userIndex].gamification.streak += 1;

        // Award badge if perfect score
        if (percentage === 1) {
            const badgeName = `Master of ${quiz.title}`;
            if (!users[userIndex].gamification.badges.includes(badgeName)) {
                users[userIndex].gamification.badges.push(badgeName);
            }
        }
        await writeData(USERS_FILE, users);
    }

    // Save Result
    const results = await readData(RESULTS_FILE);
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
    await writeData(RESULTS_FILE, results);

    res.json({
        message: 'Quiz submitted successfully',
        score: pointsAwarded,
        correctCount,
        totalQuestions: quiz.questions.length,
        badges: users[userIndex].gamification.badges
    });
});

// Leaderboard
app.get('/api/leaderboard', authenticateToken, async (req, res) => {
    const users = await readData(USERS_FILE);

    const leaderboard = users
        .map(u => ({
            id: u.id,
            email: u.email, // In real app, use display name
            points: u.gamification?.points || 0,
            badges: u.gamification?.badges?.length || 0
        }))
        .sort((a, b) => b.points - a.points)
        .slice(0, 10); // Top 10

    res.json(leaderboard);
});

// --- TASK ROUTES (Legacy/Admin) ---

app.get('/api/tasks', authenticateToken, async (req, res) => {
    const tasks = await readData(TASKS_FILE);
    res.json(tasks);
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
    const { title, status, description, priority, type } = req.body;
    const tasks = await readData(TASKS_FILE);

    const newTask = {
        id: Date.now().toString(),
        title,
        status: status || 'todo',
        description: description || '',
        priority: priority || 'medium', // Default to medium
        type: type || 'feature',       // Default to feature
        createdBy: req.user.email,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    await writeData(TASKS_FILE, tasks);
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const tasks = await readData(TASKS_FILE);

    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    await writeData(TASKS_FILE, tasks);

    res.json(tasks[taskIndex]);
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    let tasks = await readData(TASKS_FILE);
    tasks = tasks.filter(t => t.id !== id);
    await writeData(TASKS_FILE, tasks);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Enable U Server running on http://localhost:${PORT}`);
});
