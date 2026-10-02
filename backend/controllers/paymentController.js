const db = require('../config/db');
const { sendWhatsAppAlert, sendEmailReceipt } = require('../services/notificationService');

exports.processPayment = async (req, res, next) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { bookingId, amount, paymentMethod, userPhone, userEmail } = req.body;
        if (!bookingId || !amount || !paymentMethod) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'BookingId, Amount, and PaymentMethod are required.' });
        }

        const paySql = 'INSERT INTO Payment (BookingID, Amount, PaymentMethod) VALUES (?, ?, ?)';
        const [payResult] = await connection.execute(paySql, [bookingId, amount, paymentMethod]);

        const updateBookingSql = 'UPDATE Bookings SET Status = "Confirmed" WHERE BookingID = ?';
        await connection.execute(updateBookingSql, [bookingId]);

        await connection.commit();

        const successMsg = `आपकी बुकिंग (ID: ${bookingId}) का ₹${amount} भुगतान सफल रहा। थैंक यू!`;
        if (userPhone) await sendWhatsAppAlert(userPhone, successMsg);
        if (userEmail) await sendEmailReceipt(userEmail, 'Payment Receipt', successMsg);

        res.status(200).json({
            success: true,
            message: 'Payment processed and booking confirmed.',
            data: { paymentId: payResult.insertId, bookingId, amount, paymentMethod }
        });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};
