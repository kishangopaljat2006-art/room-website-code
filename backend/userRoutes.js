const express = require('express');
const authController = require('./authController');
const createRateLimiter = require('./rateLimit');

const router = express.Router();

router.post(
  '/register-owner',
  createRateLimiter({
    windowMs: 60 * 60 * 1000,
    maxRequests: 5,
    message: 'Bahut attempts ho gaye. Ek ghante baad phir koshish karein.',
  }),
  authController.registerOwner,
);
router.post(
  '/login-owner',
  createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 10,
    message: 'Bahut sign-in attempts ho gaye. 15 minute baad phir koshish karein.',
  }),
  authController.loginOwner,
);

module.exports = router;
