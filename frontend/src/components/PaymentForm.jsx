import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = ({ booking }) => {
    const [method, setMethod] = useState('UPI');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        try {
            const res = await axios.post('http://localhost:5000/api/payments/process', {
                bookingId: booking.bookingId,
                amount: booking.price,
                paymentMethod: method,
                userPhone: '9876543210',
                userEmail: 'tenant@example.com'
            });
            setStatus(`भुगतान सफल! ${res.data.message}`);
        } catch (err) {
            setStatus('पेमेंट असफल रहा। डेटाबेस सुरक्षित रोलबैक कर दिया गया है।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ borderLeft: '6px solid #10b981' }}>
            <h2>सुरक्षित ऑनलाइन पेमेंट गेटवे</h2>
            <p>Booking ID: <strong>#{booking.bookingId}</strong></p>
            <p>भुगतान राशि: <strong>₹{booking.price}</strong></p>
            <br/>
            <form onSubmit={handlePayment}>
                <div className="form-group">
                    <label>पेमेंट का तरीका चुनें:</label>
                    <select value={method} onChange={(e) => setMethod(e.target.value)}>
                        <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                        <option value="Debit Card">डेबिट / क्रेडिट कार्ड</option>
                        <option value="Net Banking">नेट बैंकिंग</option>
                    </select>
                </div>
                <button type="submit" className="btn" style={{ backgroundColor: '#10b981' }} disabled={loading}>
                    {loading ? 'पेमेंट हो रहा है...' : 'सुरक्षित ऑनलाइन भुगतान करें'}
                </button>
            </form>
            {status && <div className="alert-success">{status}</div>}
        </div>
    );
};

export default PaymentForm;
