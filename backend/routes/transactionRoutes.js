const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/db');

// Define transaction controllers
const transactionController = {
  getAllTransactions: (req, res) => {
    const userId = req.user.userId;
    
    db.query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
      [userId],
      (err, results) => {
        if (err) {
          console.error('Error fetching transactions:', err);
          return res.status(500).json({ 
            message: 'Error fetching transactions' 
          });
        }
        res.json(results || []);
      }
    );
  },

  addTransaction: (req, res) => {
    const userId = req.user.userId;
    const { description, amount, category, type } = req.body;

    db.query(
      'INSERT INTO transactions (user_id, description, amount, category, type) VALUES (?, ?, ?, ?, ?)',
      [userId, description, amount, category, type],
      (err, result) => {
        if (err) {
          console.error('Error adding transaction:', err);
          return res.status(500).json({ 
            message: 'Error adding transaction' 
          });
        }
        res.status(201).json({ 
          id: result.insertId,
          message: 'Transaction added successfully' 
        });
      }
    );
  }
};

// Define routes with authentication middleware
router.get('/', authenticateToken, transactionController.getAllTransactions);
router.post('/', authenticateToken, transactionController.addTransaction);

module.exports = router;
