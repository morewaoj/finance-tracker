require('dotenv').config();
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const jwt = require('jsonwebtoken');
const validateTransaction = require('./middleware/validateTransaction');

// Import routes
const authRoutes = require('./routes/authRoutes');
const transactionController = require('./controllers/transactionController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);

// Database connection
const db = require('./config/db');

// Transactions endpoint
app.post('/transactions', authenticateToken, validateTransaction, async (req, res) => {
    try {
        const userId = req.user.id;
        const { description, amount, category_id, type } = req.body;

        if (!description || !amount || !category_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const query = `
            INSERT INTO transactions 
            (user_id, category_id, description, amount, type)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            query,
            [userId, category_id, description, amount, type || 'expense'],
            (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ 
                        error: 'Failed to create transaction' 
                    });
                }

                res.status(201).json({
                    id: result.insertId,
                    message: 'Transaction created successfully'
                });
            }
        );
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/transactions', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const query = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC';
        
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to fetch transactions' });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Create HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (message) => {
        console.log('Received:', message);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
