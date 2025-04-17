require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Additional recommended settings
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err);
    console.log('Please check your .env file and MySQL credentials');
    process.exit(1); // Exit if we can't connect
  } else {
    console.log('✅ Connected to the MySQL database');
  }
});

// Handle connection errors
connection.on('error', (err) => {
  console.error('Database connection error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Database connection was closed. Attempting to reconnect...');
    connection.connect();
  } else {
    throw err;
  }
});

module.exports = connection;  // Export the entire connection object
