// middleware/validateTransaction.js

module.exports = (req, res, next) => {
    const { description, amount, category_id, type } = req.body;

    // Check required fields
    if (!description || !amount || !category_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate amount is a number and positive
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // Validate category_id is a number
    const numCategoryId = parseInt(category_id, 10);
    if (isNaN(numCategoryId) || numCategoryId <= 0) {
        return res.status(400).json({ error: 'Invalid category ID' });
    }

    // Validate transaction type
    if (type && !['expense', 'income'].includes(type)) {
        return res.status(400).json({ error: 'Invalid transaction type' });
    }

    // If all validations pass, continue
    next();
};
