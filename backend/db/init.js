const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        console.log('Connected to database successfully.');

        // Read and execute schema.sql
        const schemaSQL = await fs.readFile(
            path.join(__dirname, 'schema.sql'),
            'utf8'
        );
        
        await connection.query(schemaSQL);
        console.log('Database schema created successfully');

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
}

initializeDatabase();