const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Changed from bcrypt to bcryptjs
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const checkUser = 'SELECT * FROM users WHERE username = ? OR email = ?';
        db.query(checkUser, [username, email], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (results.length > 0) {
                return res.status(400).json({ 
                    error: 'Username or email already exists' 
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert new user
            const insertUser = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(insertUser, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to register user' });
                }

                const token = jwt.sign(
                    { id: result.insertId, username },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.status(201).json({ token });
            });
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = results[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
