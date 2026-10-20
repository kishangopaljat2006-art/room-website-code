const { verifyAccessToken } = require('./auth');

function requireOwner(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer ([^\s]+)$/);
  const user = match ? verifyAccessToken(match[1]) : null;

  if (!user || user.role !== 'owner') {
    return res.status(401).json({
      success: false,
      message: 'Owner sign in karein. Aapka session expire ho sakta hai.',
    });
  }

  req.auth = user;
  return next();
}

function requireTenant(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const user = match ? verifyAccessToken(match[1]) : null;

  if (!user || user.role !== 'tenant') {
    return res.status(401).json({
      success: false,
      message: 'Booking request bhejne ke liye tenant account se sign in karein.',
    });
  }

  req.auth = user;
  return next();
}

module.exports = { requireOwner, requireTenant };
