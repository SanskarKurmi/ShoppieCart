const mysql = require('mysql2/promise');
require('dotenv').config();

const poolConfig = process.env.MYSQL_URL
  ? {
      uri: process.env.MYSQL_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

if (!process.env.MYSQL_URL && !process.env.DB_HOST) {
  console.error(
    'Missing MySQL configuration. Set MYSQL_URL or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME in your environment.',
  );
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;