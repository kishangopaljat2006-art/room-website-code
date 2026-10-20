const db = require('../config/db');

exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({ success: false, message: 'Name, email, and phone are required.' });
        }
        const sql = 'INSERT INTO Users (Name, Email, Phone) VALUES (?, ?, ?)';
        const [result] = await db.execute(sql, [name, email, phone]);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { userId: result.insertId, name, email, phone }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT UserID, Name, Email, Phone FROM Users WHERE UserID = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        next(error);
    }
};
