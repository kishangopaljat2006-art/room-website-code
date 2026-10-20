const db = require('./db');

const PROPERTY_TYPES = new Set([
  'Private room',
  'Shared room',
  '1 BHK flat',
  '2 BHK flat',
  'Studio apartment',
]);

function textValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function publicListing(row) {
  return {
    id: Number(row.ListingID),
    title: row.Title,
    type: row.PropertyType,
    location: row.City,
    address: row.Address,
    price: Number(row.MonthlyRent),
    beds: Number(row.Bedrooms),
    description: row.Description,
    image: row.PhotoURL,
  };
}

exports.listPublicListings = async (req, res, next) => {
  const location = textValue(req.query.location).slice(0, 100);
  const search = `%${location.replace(/[\\%_]/g, '\\$&')}%`;

  try {
    const [rows] = await db.execute(
      `SELECT ListingID, Title, PropertyType, City, Address, MonthlyRent, Bedrooms, Description, PhotoURL
       FROM RentalListings
       WHERE IsActive = 1 AND (? = '' OR City LIKE ? OR Address LIKE ?)
       ORDER BY CreatedAt DESC
       LIMIT 100`,
      [location, search, search],
    );
    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows.map(publicListing),
    });
  } catch (error) {
    return next(error);
  }
};

exports.createListing = async (req, res, next) => {
  const title = textValue(req.body.title);
  const type = textValue(req.body.type);
  const location = textValue(req.body.location);
  const address = textValue(req.body.address);
  const description = textValue(req.body.description);
  const photoUrl = textValue(req.body.image) || null;
  const price = Number(req.body.price);
  const beds = Number(req.body.beds);

  if (
    !title || title.length > 70
    || !PROPERTY_TYPES.has(type)
    || !location || location.length > 100
    || !address || address.length > 180
    || !Number.isSafeInteger(price) || price < 1 || price > 1000000
    || !Number.isSafeInteger(beds) || beds < 1 || beds > 30
    || !description || description.length > 300
  ) {
    return res.status(400).json({
      success: false,
      message: 'Room ka naam, type, area, address, valid monthly rent, beds aur description sahi bharein.',
    });
  }

  if (photoUrl) {
    let parsedUrl;
    try {
      parsedUrl = new URL(photoUrl);
    } catch {
      return res.status(400).json({ success: false, message: 'Photo link valid http ya https URL hona chahiye.' });
    }
    if (!['http:', 'https:'].includes(parsedUrl.protocol) || photoUrl.length > 500) {
      return res.status(400).json({ success: false, message: 'Photo link valid http ya https URL hona chahiye.' });
    }
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO RentalListings
       (OwnerID, Title, PropertyType, City, Address, MonthlyRent, Bedrooms, Description, PhotoURL)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.auth.userId, title, type, location, address, price, beds, description, photoUrl],
    );
    const [rows] = await db.execute(
      `SELECT ListingID, Title, PropertyType, City, Address, MonthlyRent, Bedrooms, Description, PhotoURL
       FROM RentalListings WHERE ListingID = ? LIMIT 1`,
      [result.insertId],
    );

    return res.status(201).json({
      success: true,
      message: 'Room listing sabhi visitors ke liye publish ho gayi.',
      data: publicListing(rows[0]),
    });
  } catch (error) {
    return next(error);
  }
};
