const mysql = require('mysql2/promise');
require('dotenv').config();

function databaseUrlConfig(connectionString) {
  const url = new URL(connectionString);
  if (url.protocol !== 'mysql:') {
    throw new Error('DATABASE_URL must use the mysql:// protocol.');
  }

  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.replace(/^\/+/, '')),
  };
}

const poolConfig = {
  ...(process.env.DATABASE_URL
    ? databaseUrlConfig(process.env.DATABASE_URL)
    : {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'booking_system',
    }),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  dateStrings: true,
};

if (process.env.DB_SSL === 'true') {
  poolConfig.ssl = { rejectUnauthorized: true };
}

module.exports = mysql.createPool(poolConfig);
