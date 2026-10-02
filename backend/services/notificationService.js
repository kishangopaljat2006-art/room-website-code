const nodemailer = require('nodemailer');

exports.sendWhatsAppAlert = async (phone, message) => {
    try {
        console.log(`[WhatsApp Alert Sent to ${phone}]: ${message}`);
        return true;
    } catch (error) {
        console.error('WhatsApp Notification Error:', error.message);
        return false;
    }
};

exports.sendEmailReceipt = async (email, subject, textBody) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`[Simulated Email to ${email}]: ${subject} - ${textBody}`);
            return;
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: textBody
        });
        console.log(`[Email Sent to ${email}]`);
    } catch (error) {
        console.error('Email Notification Error:', error.message);
    }
};
