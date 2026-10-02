import React, { useState } from 'react';
import './App.css';
import BookingForm from './components/BookingForm';
import PaymentForm from './components/PaymentForm';

function App() {
  const [currentBooking, setCurrentBooking] = useState(null);

  return (
    <div className="App">
      <header className="navbar">
        <h1>Digital Rental & Booking Portal</h1>
        <span>MERN Stack Project</span>
      </header>

      <main className="container">
        <BookingForm onBookingCreated={(b) => setCurrentBooking(b)} />
        {currentBooking && <PaymentForm booking={currentBooking} />}
      </main>
    </div>
  );
}

export default App;
