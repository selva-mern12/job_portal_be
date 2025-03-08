import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const [existingUsers] = await pool.query(
            `SELECT * FROM user WHERE username = ? OR email = ?`, 
            [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Username or Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO user (user_id, username, email, password) VALUES (UUID(), ?, ?, ?)`,
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await pool.query(`SELECT * FROM user WHERE email = ?`, [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/deactivate', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.user;

        const [user] = await pool.query(`SELECT * FROM user WHERE user_id = ?`, [userId]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        await pool.query(`DELETE FROM user WHERE user_id = ?`, [userId]);

        res.status(200).json({ message: 'Account deactivated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
