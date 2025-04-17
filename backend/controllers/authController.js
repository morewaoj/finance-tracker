const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Registration
exports.register = (req, res) => {
  const { name, username, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });

    db.query(
      'INSERT INTO users (name, username, password) VALUES (?, ?, ?)',
      [name, username, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Error registering user' });
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
};

// Login
exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: 'Invalid username or password' });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) return res.status(400).json({ message: 'Invalid username or password' });

      const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    });
  });
};
