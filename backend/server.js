require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');
const { getJwtSecret } = require('./auth');
const errorHandler = require('./errorHandler');
const userRoutes = require('./userRoutes');
const listingRoutes = require('./listingRoutes');
const bookingRoutes = require('./bookingRoutes');

const app = express();
if (process.env.TRUST_PROXY) {
  const trustProxy = Number(process.env.TRUST_PROXY);
  if (!Number.isInteger(trustProxy) || trustProxy < 0 || trustProxy > 5) {
    throw new Error('TRUST_PROXY must be an integer from 0 to 5.');
  }
  app.set('trust proxy', trustProxy);
}
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || 'http://localhost:8000,http://127.0.0.1:8000,https://kishangopaljat2006-art.github.io')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    const error = new Error('This website origin is not allowed.');
    error.statusCode = 403;
    return callback(error);
  },
}));
app.use(express.json({ limit: '16kb' }));

app.get('/health', async (req, res, next) => {
  try {
    await db.execute('SELECT 1');
    return res.status(200).json({ success: true, message: 'Rental API and database are ready.' });
  } catch (error) {
    return next(error);
  }
});

app.use('/api/auth', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use(errorHandler);

if (require.main === module) {
  try {
    getJwtSecret();
    const port = Number(process.env.PORT || 5000);
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Rental API listening on port ${port}`);
    });
    server.on('error', (error) => {
      console.error('Rental API could not start:', error.message);
      process.exitCode = 1;
    });
  } catch (error) {
    console.error('Rental API configuration error:', error.message);
    process.exitCode = 1;
  }
}

module.exports = app;
