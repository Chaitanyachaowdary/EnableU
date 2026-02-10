const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { readData, writeData, FILES } = require('../services/dataService');
const { validate } = require('../middleware/validation');

const registerSchema = {
    email: { required: true, type: 'email' },
    password: { required: true, minLength: 6 }
};

const loginSchema = {
    email: { required: true, type: 'email' },
    password: { required: true }
};

router.post('/register', validate(registerSchema), async (req, res, next) => {
    try {
        const { email, password, accessibilitySettings } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Required fields missing' });

        const users = await readData(FILES.USERS);
        if (users.find(u => u.email === email)) return res.status(409).json({ message: 'Email registered' });

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = {
            id: crypto.randomUUID(),
            email,
            passwordHash,
            role: 'student',
            gamification: { points: 0, level: 1, badges: [], streak: 0 },
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        await writeData(FILES.USERS, users);
        res.status(201).json({ message: 'Registration successful' });
    } catch (e) { next(e); }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const users = await readData(FILES.USERS);
        const user = users.find(u => u.email === email);

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'super-secret',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, role: user.role, gamification: user.gamification }
        });
    } catch (e) { next(e); }
});

router.post('/forgot-password', async (req, res, next) => {
    try {
        const { email } = req.body;
        // In a real app, we would check if the user exists and send an email
        console.log(`Password reset requested for: ${email}`);
        res.json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (e) { next(e); }
});

module.exports = router;
