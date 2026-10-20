function createRateLimiter({ windowMs, maxRequests, message }) {
  const clients = new Map();
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    clients.forEach((entry, key) => {
      if (entry.resetAt <= now) clients.delete(key);
    });
  }, Math.min(windowMs, 5 * 60 * 1000));
  cleanupTimer.unref();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    let entry = clients.get(key);

    if (!entry || entry.resetAt <= now) {
      if (clients.size >= 10000) {
        clients.forEach((client, clientKey) => {
          if (client.resetAt <= now) clients.delete(clientKey);
        });
      }
      if (clients.size >= 10000) {
        return res.status(429).json({ success: false, message: 'Abhi bahut requests aa rahi hain. Thodi der baad phir koshish karein.' });
      }
      entry = { count: 0, resetAt: now + windowMs };
      clients.set(key, entry);
    }

    entry.count += 1;
    if (entry.count > maxRequests) {
      res.set('Retry-After', String(Math.max(1, Math.ceil((entry.resetAt - now) / 1000))));
      return res.status(429).json({ success: false, message });
    }
    return next();
  };
}

module.exports = createRateLimiter;
