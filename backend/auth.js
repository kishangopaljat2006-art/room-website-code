const crypto = require('node:crypto');

const TOKEN_LIFETIME_SECONDS = 12 * 60 * 60;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.');
  }
  return secret;
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url');
}

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16);
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) return reject(error);
      resolve(`scrypt$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`);
    });
  });
}

function verifyPassword(password, storedHash) {
  const [algorithm, saltText, hashText] = String(storedHash).split('$');
  if (algorithm !== 'scrypt' || !saltText || !hashText) return Promise.resolve(false);

  const salt = Buffer.from(saltText, 'base64url');
  const expectedHash = Buffer.from(hashText, 'base64url');

  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, expectedHash.length, (error, derivedKey) => {
      if (error) return reject(error);
      resolve(
        expectedHash.length === derivedKey.length
        && crypto.timingSafeEqual(expectedHash, derivedKey),
      );
    });
  });
}

function createAccessToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(JSON.stringify({
    sub: Number(user.UserID),
    role: user.Role,
    iat: now,
    exp: now + TOKEN_LIFETIME_SECONDS,
  }));
  const unsignedToken = `${header}.${payload}`;
  const signature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(unsignedToken)
    .digest('base64url');

  return `${unsignedToken}.${signature}`;
}

function verifyAccessToken(token) {
  const [headerText, payloadText, signatureText, extra] = String(token).split('.');
  if (!headerText || !payloadText || !signatureText || extra) return null;

  const unsignedToken = `${headerText}.${payloadText}`;
  const expectedSignature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(unsignedToken)
    .digest();
  const suppliedSignature = Buffer.from(signatureText, 'base64url');

  if (
    suppliedSignature.length !== expectedSignature.length
    || !crypto.timingSafeEqual(expectedSignature, suppliedSignature)
  ) {
    return null;
  }

  let header;
  let payload;
  try {
    header = JSON.parse(Buffer.from(headerText, 'base64url').toString('utf8'));
    payload = JSON.parse(Buffer.from(payloadText, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (
    header.alg !== 'HS256'
    || typeof payload.sub !== 'number'
    || !Number.isSafeInteger(payload.sub)
    || typeof payload.exp !== 'number'
    || payload.exp <= Math.floor(Date.now() / 1000)
    || payload.role !== 'owner'
  ) {
    return null;
  }

  return { userId: payload.sub, role: payload.role };
}

module.exports = {
  createAccessToken,
  getJwtSecret,
  hashPassword,
  verifyAccessToken,
  verifyPassword,
};
