function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'Har photo 2 MB ya usse chhoti honi chahiye.',
    });
  }

  if (error.code?.startsWith('LIMIT_')) {
    return res.status(400).json({
      success: false,
      message: 'Ek room photo aur ek washroom photo tak hi upload karein.',
    });
  }

  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : error.status;
  if (Number.isInteger(statusCode) && statusCode >= 400 && statusCode < 500) {
    return res.status(statusCode).json({
      success: false,
      message: statusCode === 400 ? 'Request data sahi format mein bhejein.' : error.message,
    });
  }

  console.error('Rental API request failed:', error.stack || error.message);
  return res.status(500).json({
    success: false,
    message: 'Server request complete nahi kar saka. Thodi der baad phir koshish karein.',
  });
}

module.exports = errorHandler;
