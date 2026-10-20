const express = require('express');
const listingController = require('./listingController');
const { requireOwner } = require('./authMiddleware');
const createRateLimiter = require('./rateLimit');

const router = express.Router();

router.get(
  '/',
  createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 120,
    message: 'Bahut search requests ho gayi. Thodi der baad phir try karein.',
  }),
  listingController.listPublicListings,
);
router.post(
  '/',
  createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 20,
    message: 'Bahut listings add karne ki koshish hui. Thodi der baad phir try karein.',
  }),
  requireOwner,
  listingController.createListing,
);

module.exports = router;
