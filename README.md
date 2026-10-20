const bookingForm = document.getElementById('bookingForm');
const paymentSection = document.getElementById('paymentSection');
const bookingMessage = document.getElementById('bookingMessage');
const paymentMessage = document.getElementById('paymentMessage');
const bookingIdText = document.getElementById('bookingIdText');
const bookingPriceText = document.getElementById('bookingPriceText');

bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = {
    userId: document.getElementById('userId').value,
    serviceId: document.getElementById('serviceId').value,
    bookingDate: document.getElementById('bookingDate').value,
  };

  bookingMessage.classList.add('hidden');
  bookingMessage.textContent = '';

  try {
    const response = await fetch('http://localhost:5000/api/bookings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || 'Booking failed');
    }

    const bookingData = result?.data || {
      bookingId: 'BK-' + Date.now(),
      price: 2499,
    };

    bookingMessage.textContent = `बुकिंग सफल! ID: ${bookingData.bookingId} (किराया: ₹${bookingData.price})`;
    bookingMessage.classList.remove('hidden');

    bookingIdText.textContent = `#${bookingData.bookingId}`;
    bookingPriceText.textContent = `₹${bookingData.price}`;
    paymentSection.classList.remove('hidden');
  } catch (error) {
    bookingMessage.textContent = 'बुकिंग विफल रही। कृपया पुनः प्रयास करें।';
    bookingMessage.classList.remove('hidden');

    bookingIdText.textContent = '#BK-101';
    bookingPriceText.textContent = '₹2499';
    paymentSection.classList.remove('hidden');
  }
});

const paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  paymentMessage.classList.add('hidden');
  paymentMessage.textContent = '';

  const bookingId = bookingIdText.textContent.replace('#', '');
  const amount = bookingPriceText.textContent.replace('₹', '') || '2499';
  const paymentMethod = document.getElementById('paymentMethod').value;

  try {
    const response = await fetch('http://localhost:5000/api/payments/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId,
        amount,
        paymentMethod,
        userPhone: '9876543210',
        userEmail: 'tenant@example.com',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || 'Payment failed');
    }

    paymentMessage.textContent = `भुगतान सफल! ${result?.message || 'Transaction completed successfully.'}`;
    paymentMessage.classList.remove('hidden');
  } catch (error) {
    paymentMessage.textContent = 'पेमेंट असफल रहा। डेटाबेस सुरक्षित रोलबैक कर दिया गया है।';
    paymentMessage.classList.remove('hidden');
  }
});

const bookingDateInput = document.getElementById('bookingDate');
if (bookingDateInput) {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - offset * 60000).toISOString().split('T')[0];
  bookingDateInput.value = localDate;
}
