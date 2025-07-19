// config/db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection on startup
(async () => {
  try {
    const conn = await db.getConnection();
    console.log('✅ MySQL pool connected');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL pool connection failed:', err.message);
  }
})();

module.exports = db;
