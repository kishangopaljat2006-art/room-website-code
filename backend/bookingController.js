const db = require('./db');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function textValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function indiaToday() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const part = (type) => parts.find((item) => item.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

exports.createBooking = async (req, res, next) => {
  const listingId = Number(req.body.listingId);
  const moveInDate = req.body.moveInDate;
  const today = indiaToday();

  if (
    !Number.isSafeInteger(listingId) || listingId < 1
    || !isValidDate(moveInDate) || moveInDate < today
  ) {
    return res.status(400).json({
      success: false,
      message: 'Room chunein aur aaj ya uske baad ki move-in date bharein.',
    });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [tenants] = await connection.execute(
      'SELECT TenantID, Name, Email, Phone FROM TenantAccounts WHERE TenantID = ? LIMIT 1',
      [req.auth.userId],
    );
    const tenant = tenants[0];
    if (
      !tenant
      || !textValue(tenant.Name)
      || !EMAIL_PATTERN.test(textValue(tenant.Email))
      || !/^[+\d][\d\s()-]{6,19}$/.test(textValue(tenant.Phone))
    ) {
      await connection.rollback();
      return res.status(401).json({ success: false, message: 'Tenant account verify nahi ho paaya. Dobara sign in karein.' });
    }

    const [listings] = await connection.execute(
      `SELECT ListingID, MonthlyRent
       FROM RentalListings
       WHERE ListingID = ? AND IsActive = 1
       FOR UPDATE`,
      [listingId],
    );

    if (!listings.length) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Yeh room ab available nahi hai.' });
    }

    const [result] = await connection.execute(
      `INSERT INTO RentalBookings
       (ListingID, TenantID, TenantName, TenantEmail, TenantPhone, MoveInDate, MonthlyRentSnapshot, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Requested')`,
      [listingId, tenant.TenantID, tenant.Name, tenant.Email, tenant.Phone, moveInDate, listings[0].MonthlyRent],
    );

    await connection.commit();
    return res.status(201).json({
      success: true,
      message: 'Booking request database mein save ho gayi. Payment abhi available nahi hai.',
      data: {
        bookingId: Number(result.insertId),
        listingId,
        moveInDate,
        tenantName: tenant.Name,
        monthlyRent: Number(listings[0].MonthlyRent),
        status: 'Requested',
      },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

exports.getOwnerBookings = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      `SELECT b.BookingID, b.ListingID, l.Title, b.TenantName, b.TenantEmail,
              b.TenantPhone, b.MoveInDate, b.MonthlyRentSnapshot, b.Status, b.CreatedAt
       FROM RentalBookings b
       JOIN RentalListings l ON l.ListingID = b.ListingID
       WHERE l.OwnerID = ?
       ORDER BY b.CreatedAt DESC
       LIMIT 100`,
      [req.auth.userId],
    );

    res.set('Cache-Control', 'no-store');
    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows.map((row) => ({
        bookingId: Number(row.BookingID),
        listingId: Number(row.ListingID),
        title: row.Title,
        tenantName: row.TenantName,
        tenantEmail: row.TenantEmail,
        tenantPhone: row.TenantPhone,
        moveInDate: row.MoveInDate,
        monthlyRent: Number(row.MonthlyRentSnapshot),
        status: row.Status,
        createdAt: row.CreatedAt,
      })),
    });
  } catch (error) {
    return next(error);
  }
};
