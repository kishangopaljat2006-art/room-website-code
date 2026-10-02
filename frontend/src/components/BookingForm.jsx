import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = ({ onBookingCreated }) => {
    const [formData, setFormData] = useState({ userId: '1', serviceId: '101', bookingDate: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');
        try {
            const res = await axios.post('http://localhost:5000/api/bookings/create', formData);
            setMsg(`बुकिंग सफल! ID: ${res.data.data.bookingId} (किराया: ₹${res.data.data.price})`);
            if (onBookingCreated) onBookingCreated(res.data.data);
        } catch (err) {
            setMsg('बुकिंग विफल रही। कृपया पुनः प्रयास करें।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>डिजिटल बुकिंग एवं रूम आवंटन</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>User ID:</label>
                    <input type="number" name="userId" value={formData.userId} onChange={(e) => setFormData({...formData, userId: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Property / Service ID:</label>
                    <input type="number" name="serviceId" value={formData.serviceId} onChange={(e) => setFormData({...formData, serviceId: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Booking Date:</label>
                    <input type="date" name="bookingDate" value={formData.bookingDate} onChange={(e) => setFormData({...formData, bookingDate: e.target.value})} required />
                </div>
                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'प्रोसेसिंग...' : 'अभी बुकिंग करें'}
                </button>
            </form>
            {msg && <div className="alert-success">{msg}</div>}
        </div>
    );
};

export default BookingForm;
