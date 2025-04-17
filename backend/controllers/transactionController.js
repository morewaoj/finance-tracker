const db = require('../config/db');

const transactionController = {
    // Get all transactions for a user
    getTransactions: async (req, res) => {
        try {
            const userId = req.user.id;
            
            const query = `
                SELECT t.*, c.name as category_name 
                FROM transactions t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = ?
                ORDER BY t.date DESC
            `;
            
            db.query(query, [userId], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ 
                        error: 'Failed to fetch transactions' 
                    });
                }
                res.json(results);
            });
        } catch (error) {
            console.error('Controller error:', error);
            res.status(500).json({ error: 'Failed to fetch transactions' });
        }
    },

    // Create a new transaction
    createTransaction: async (req, res) => {
        try {
            const userId = req.user.id;
            const { description, amount, category_id, type } = req.body;

            // Validate input
            if (!description || amount === undefined || !category_id) {
                return res.status(400).json({ 
                    error: 'Missing required fields' 
                });
            }

            const numericAmount = Number(amount);
            if (isNaN(numericAmount) || numericAmount <= 0) {
                return res.status(400).json({ 
                    error: 'Amount must be a positive number' 
                });
            }

            const query = `
                INSERT INTO transactions 
                (user_id, category_id, description, amount, type) 
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                query,
                [userId, category_id, description, numericAmount, type || 'expense'],
                (err, result) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ 
                            error: 'Failed to create transaction' 
                        });
                    }

                    res.status(201).json({
                        id: result.insertId,
                        description,
                        amount: numericAmount,
                        category_id,
                        type: type || 'expense',
                        message: 'Transaction created successfully'
                    });
                }
            );
        } catch (error) {
            console.error('Controller error:', error);
            res.status(500).json({ error: 'Failed to process transaction' });
        }
    }
};

module.exports = transactionController;
