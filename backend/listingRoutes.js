const express = require('express');
const listingController = require('./listingController');
const { requireOwner } = require('./authMiddleware');
const createRateLimiter = require('./rateLimit');
const multer = require('multer');

const router = express.Router();
const uploadListingPhotos = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 2,
    fields: 10,
    fieldSize: 1000,
  },
  fileFilter(req, file, callback) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      const error = new Error('Photo JPG, PNG ya WebP format mein honi chahiye.');
      error.statusCode = 415;
      return callback(error);
    }
    return callback(null, true);
  },
});

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
  uploadListingPhotos.fields([
    { name: 'roomPhoto', maxCount: 1 },
    { name: 'bathroomPhoto', maxCount: 1 },
  ]),
  listingController.createListing,
);
router.get('/:id/photos/:type(room|bathroom)', listingController.getListingPhoto);

module.exports = router;
