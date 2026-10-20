const db = require('./db');

const PROPERTY_TYPES = new Set([
  'Private room',
  'Shared room',
  '1 BHK flat',
  '2 BHK flat',
  'Studio apartment',
]);
const IMAGE_SIGNATURES = {
  'image/jpeg': (buffer) => buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
  'image/png': (buffer) => buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  'image/webp': (buffer) => buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP',
};
const MAP_HOSTS = new Set(['google.com', 'www.google.com', 'maps.google.com', 'maps.app.goo.gl', 'goo.gl', 'openstreetmap.org', 'www.openstreetmap.org']);

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
    image: row.RoomPhotoAvailable
      ? `/api/listings/${Number(row.ListingID)}/photos/room`
      : row.PhotoURL,
    bathroomImage: row.BathroomPhotoAvailable
      ? `/api/listings/${Number(row.ListingID)}/photos/bathroom`
      : null,
    mapUrl: row.MapURL || null,
  };
}

exports.listPublicListings = async (req, res, next) => {
  const location = textValue(req.query.location).slice(0, 100);
  const search = `%${location.replace(/[\\%_]/g, '\\$&')}%`;

  try {
    const [rows] = await db.execute(
      `SELECT l.ListingID, l.Title, l.PropertyType, l.City, l.Address, l.MonthlyRent,
              l.Bedrooms, l.Description, l.PhotoURL, l.MapURL,
              EXISTS (SELECT 1 FROM RentalListingPhotos p WHERE p.ListingID = l.ListingID AND p.RoomPhoto IS NOT NULL) AS RoomPhotoAvailable,
              EXISTS (SELECT 1 FROM RentalListingPhotos p WHERE p.ListingID = l.ListingID AND p.BathroomPhoto IS NOT NULL) AS BathroomPhotoAvailable
       FROM RentalListings l
       WHERE l.IsActive = 1 AND (? = '' OR l.City LIKE ? OR l.Address LIKE ?)
       ORDER BY l.CreatedAt DESC
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
  const mapUrl = textValue(req.body.mapUrl) || null;
  const roomPhoto = req.files?.roomPhoto?.[0];
  const bathroomPhoto = req.files?.bathroomPhoto?.[0];
  const price = Number(req.body.price);
  const beds = Number(req.body.beds);

  if (
    !title || title.length > 70
    || !PROPERTY_TYPES.has(type)
    || !location || location.length > 100
    || !address || address.length > 180
    || !mapUrl
    || !Number.isSafeInteger(price) || price < 1 || price > 1000000
    || !Number.isSafeInteger(beds) || beds < 1 || beds > 30
    || !description || description.length > 300
  ) {
    return res.status(400).json({
      success: false,
      message: 'Room ka naam, type, area, address, Google Maps link, valid monthly rent, beds aur description sahi bharein.',
    });
  }

  if (!roomPhoto) {
    return res.status(400).json({ success: false, message: 'Room ki photo upload karein.' });
  }

  if (mapUrl) {
    let parsedUrl;
    try {
      parsedUrl = new URL(mapUrl);
    } catch {
      return res.status(400).json({ success: false, message: 'Google Maps ka valid share link daalein.' });
    }
    if (
      parsedUrl.protocol !== 'https:'
      || parsedUrl.username
      || parsedUrl.password
      || !MAP_HOSTS.has(parsedUrl.hostname.toLowerCase())
      || mapUrl.length > 500
    ) {
      return res.status(400).json({ success: false, message: 'Google Maps ka valid https share link daalein.' });
    }
  }

  for (const file of [roomPhoto, bathroomPhoto].filter(Boolean)) {
    if (!IMAGE_SIGNATURES[file.mimetype]?.(file.buffer)) {
      return res.status(400).json({ success: false, message: 'Photo JPG, PNG ya WebP format mein honi chahiye.' });
    }
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO RentalListings
       (OwnerID, Title, PropertyType, City, Address, MonthlyRent, Bedrooms, Description, MapURL)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.auth.userId, title, type, location, address, price, beds, description, mapUrl],
    );

    await connection.execute(
      `INSERT INTO RentalListingPhotos
       (ListingID, RoomPhoto, RoomPhotoMime, BathroomPhoto, BathroomPhotoMime)
       VALUES (?, ?, ?, ?, ?)`,
      [
        result.insertId,
        roomPhoto.buffer,
        roomPhoto.mimetype,
        bathroomPhoto?.buffer || null,
        bathroomPhoto?.mimetype || null,
      ],
    );

    const [rows] = await connection.execute(
      `SELECT l.ListingID, l.Title, l.PropertyType, l.City, l.Address, l.MonthlyRent,
              l.Bedrooms, l.Description, l.PhotoURL, l.MapURL,
              EXISTS (SELECT 1 FROM RentalListingPhotos p WHERE p.ListingID = l.ListingID AND p.RoomPhoto IS NOT NULL) AS RoomPhotoAvailable,
              EXISTS (SELECT 1 FROM RentalListingPhotos p WHERE p.ListingID = l.ListingID AND p.BathroomPhoto IS NOT NULL) AS BathroomPhotoAvailable
       FROM RentalListings l WHERE l.ListingID = ? LIMIT 1`,
      [result.insertId],
    );

    await connection.commit();
    return res.status(201).json({
      success: true,
      message: 'Room listing sabhi visitors ke liye publish ho gayi.',
      data: publicListing(rows[0]),
    });
  } catch (error) {
    if (connection) await connection.rollback();
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

exports.getListingPhoto = async (req, res, next) => {
  const listingId = Number(req.params.id);
  const photoType = req.params.type === 'bathroom' ? 'Bathroom' : 'Room';
  if (!Number.isSafeInteger(listingId) || listingId < 1) {
    return res.status(400).json({ success: false, message: 'Room listing ID valid nahi hai.' });
  }

  try {
    const [rows] = await db.execute(
      `SELECT p.${photoType}Photo AS Photo, p.${photoType}PhotoMime AS PhotoMime
       FROM RentalListingPhotos p
       JOIN RentalListings l ON l.ListingID = p.ListingID
       WHERE p.ListingID = ? AND l.IsActive = 1 AND p.${photoType}Photo IS NOT NULL
       LIMIT 1`,
      [listingId],
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Is listing ki photo nahi mili.' });
    }

    res.set({
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    });
    return res.type(rows[0].PhotoMime).send(rows[0].Photo);
  } catch (error) {
    return next(error);
  }
};
