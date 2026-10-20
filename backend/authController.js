const db = require('./db');
const { createAccessToken, hashPassword, verifyPassword } = require('./auth');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function validateCredentials({ name, phone, email, password }, includeProfile) {
  if (
    (includeProfile && (typeof name !== 'string' || !name.trim() || name.trim().length > 100))
    || (includeProfile && (
      typeof phone !== 'string'
      || phone.trim().length < 7
      || phone.trim().length > 20
      || !/^[+\d][\d\s()-]{6,19}$/.test(phone.trim())
    ))
    || !EMAIL_PATTERN.test(email)
    || email.length > 254
    || typeof password !== 'string'
    || password.length < 10
    || password.length > 128
  ) {
    return 'Naam, valid email, phone number aur 10-128 characters ka password zaroori hai.';
  }
  return null;
}

exports.registerOwner = async (req, res, next) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;
  const validationMessage = validateCredentials({ name, phone, email, password }, true);

  if (validationMessage) {
    return res.status(400).json({ success: false, message: validationMessage });
  }

  try {
    const passwordHash = await hashPassword(password);
    const [result] = await db.execute(
      'INSERT INTO OwnerAccounts (Name, Email, Phone, PasswordHash) VALUES (?, ?, ?, ?)',
      [name, email, phone, passwordHash],
    );
    const user = { UserID: result.insertId, Role: 'owner' };

    res.set('Cache-Control', 'no-store');
    return res.status(201).json({
      success: true,
      message: 'Owner account ban gaya.',
      data: { token: createAccessToken(user), name, email, role: user.Role },
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Is email se pehle se account bana hua hai. Sign in karein.' });
    }
    return next(error);
  }
};

exports.loginOwner = async (req, res, next) => {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;

  if (!EMAIL_PATTERN.test(email) || email.length > 254 || typeof password !== 'string' || !password || password.length > 128) {
    return res.status(400).json({ success: false, message: 'Valid email aur password daalein.' });
  }

  try {
    const [rows] = await db.execute(
      `SELECT OwnerID AS UserID, Name, Email, PasswordHash, 'owner' AS Role
       FROM OwnerAccounts WHERE Email = ? LIMIT 1`,
      [email],
    );
    const user = rows[0];
    const passwordMatches = user ? await verifyPassword(password, user.PasswordHash) : false;

    if (!user || user.Role !== 'owner' || !passwordMatches) {
      return res.status(401).json({ success: false, message: 'Email ya password sahi nahi hai.' });
    }

    res.set('Cache-Control', 'no-store');
    return res.status(200).json({
      success: true,
      message: 'Sign in ho gaya.',
      data: {
        token: createAccessToken(user),
        name: user.Name,
        email: user.Email,
        role: user.Role,
      },
    });
  } catch (error) {
    return next(error);
  }
};
