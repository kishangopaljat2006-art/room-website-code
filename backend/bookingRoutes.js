const express = require('express');
const bookingController = require('./bookingController');
const { requireOwner, requireTenant } = require('./authMiddleware');
const createRateLimiter = require('./rateLimit');

const router = express.Router();

router.post(
  '/',
  requireTenant,
  createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 10,
    message: 'Bahut booking requests ho gayi. 15 minute baad phir try karein.',
  }),
  bookingController.createBooking,
);
router.get('/owner', requireOwner, bookingController.getOwnerBookings);

module.exports = router;
