const db = require('../config/db');

exports.createBooking = async (req, res, next) => {
    try {
        const { userId, serviceId, bookingDate } = req.body;
        if (!userId || !serviceId || !bookingDate) {
            return res.status(400).json({ success: false, message: 'UserId, ServiceId, and BookingDate are required.' });
        }

        const [service] = await db.execute('SELECT ServiceID, Price FROM Services WHERE ServiceID = ?', [serviceId]);
        const price = service.length > 0 ? service[0].Price : 5000.00;

        const sql = 'INSERT INTO Bookings (UserID, ServiceID, BookingDate, Status) VALUES (?, ?, ?, "Pending")';
        const [result] = await db.execute(sql, [userId, serviceId, bookingDate]);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: {
                bookingId: result.insertId,
                userId,
                serviceId,
                bookingDate,
                status: 'Pending',
                price: price
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserBookings = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const sql = `
            SELECT b.BookingID, b.BookingDate, b.Status, s.Name AS ServiceName, s.Price 
            FROM Bookings b
            LEFT JOIN Services s ON b.ServiceID = s.ServiceID
            WHERE b.UserID = ?
            ORDER BY b.BookingDate DESC
        `;
        const [bookings] = await db.execute(sql, [userId]);
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        next(error);
    }
};
