const bookingForm = document.getElementById('bookingForm');
const paymentForm = document.getElementById('paymentForm');
const paymentSection = document.getElementById('paymentSection');
const bookingMessage = document.getElementById('bookingMessage');
const paymentMessage = document.getElementById('paymentMessage');
const bookingIdText = document.getElementById('bookingIdText');
const bookingPriceText = document.getElementById('bookingPriceText');
const bookingDateInput = document.getElementById('bookingDate');
const checkInInput = document.getElementById('checkIn');
const serviceIdInput = document.getElementById('serviceId');
const roomGrid = document.getElementById('roomGrid');
const hostListingForm = document.getElementById('hostListingForm');
const hostListingMessage = document.getElementById('hostListingMessage');
const hostListingsKey = 'sukoon-stay-host-listings';

function getSavedListings() {
  const savedListings = localStorage.getItem(hostListingsKey);
  if (!savedListings) return [];

  const listings = JSON.parse(savedListings);
  if (!Array.isArray(listings)) {
    throw new Error('Saved listings ka data sahi format mein nahi hai.');
  }

  return listings;
}

function createLocationLink(address, location) {
  const link = document.createElement('a');
  link.className = 'room-location-link';
  link.href = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${address}, ${location}`)}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Map par dekhein ↗';
  return link;
}

function createHostListingCard(listing) {
  const card = document.createElement('article');
  card.className = 'room-card host-room-card';
  card.dataset.serviceId = listing.id;
  card.dataset.localOnly = 'true';
  card.dataset.location = `${listing.location} ${listing.address}`;

  const visual = document.createElement('div');
  visual.className = 'room-visual';
  const image = document.createElement('img');
  image.alt = `${listing.title} ki photo`;
  image.loading = 'lazy';
  image.src = listing.image || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85';
  image.addEventListener('error', () => {
    image.src = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85';
  }, { once: true });
  visual.append(image);

  const body = document.createElement('div');
  body.className = 'room-body';

  const heading = document.createElement('div');
  heading.className = 'room-top';
  const title = document.createElement('h3');
  title.textContent = listing.title;
  const rent = document.createElement('span');
  rent.textContent = `₹${Number(listing.price).toLocaleString('en-IN')} `;
  const rentPeriod = document.createElement('small');
  rentPeriod.textContent = '/ mahina';
  rent.append(rentPeriod);
  heading.append(title, rent);

  const description = document.createElement('p');
  description.textContent = listing.description;

  const locationDetails = document.createElement('div');
  locationDetails.className = 'room-location';
  const locationName = document.createElement('strong');
  locationName.textContent = listing.location;
  const address = document.createElement('span');
  address.textContent = listing.address;
  locationDetails.append(locationName, address, createLocationLink(listing.address, listing.location));

  const features = document.createElement('ul');
  const propertyType = document.createElement('li');
  propertyType.textContent = listing.type;
  const beds = document.createElement('li');
  beds.textContent = `${listing.beds} bed`;
  features.append(propertyType, beds);

  const bookButton = document.createElement('button');
  bookButton.className = 'room-book-btn';
  bookButton.type = 'button';
  bookButton.dataset.serviceId = listing.id;
  bookButton.textContent = 'Yeh room chunein';

  body.append(heading, description, locationDetails, features, bookButton);
  card.append(visual, body);
  return card;
}

try {
  getSavedListings().forEach((listing) => roomGrid.append(createHostListingCard(listing)));
} catch (error) {
  showMessage(hostListingMessage, `Purani room listings load nahi ho sakin: ${error.message}`, true);
}

function showMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.remove('hidden', 'error');
  if (isError) element.classList.add('error');
}

function setLoading(button, isLoading, loadingText, defaultText) {
  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : defaultText;
}

function localDateString(date = new Date()) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().split('T')[0];
}

const today = localDateString();
bookingDateInput.min = today;
checkInInput.min = today;
bookingDateInput.value = today;
checkInInput.value = today;

checkInInput.addEventListener('change', () => {
  bookingDateInput.value = checkInInput.value;
});

bookingDateInput.addEventListener('change', () => {
  checkInInput.value = bookingDateInput.value;
});

document.getElementById('searchForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const query = document.getElementById('destination').value.trim().toLocaleLowerCase();
  const cards = [...roomGrid.querySelectorAll('.room-card')];
  let visibleCount = 0;

  cards.forEach((card) => {
    const searchableText = `${card.dataset.location} ${card.querySelector('h3').textContent} ${card.querySelector('.room-body').textContent}`.toLocaleLowerCase();
    const matches = !query || searchableText.includes(query);
    card.classList.toggle('hidden', !matches);
    if (matches) visibleCount += 1;
  });

  const resultsMessage = document.getElementById('resultsMessage');
  resultsMessage.textContent = visibleCount
    ? `${visibleCount} stay mile${visibleCount === 1 ? '' : 's'} — apni pasand chunein.`
    : 'Is jagah par room nahi mila. Shehar ya area ka doosra naam try karein.';
  document.getElementById('stays').scrollIntoView({ behavior: 'smooth' });
});

roomGrid.addEventListener('click', (event) => {
  const button = event.target.closest('.room-book-btn');
  if (!button) return;

  const card = button.closest('.room-card');
  if (card.dataset.localOnly === 'true') {
    showMessage(bookingMessage, 'Yeh room demo listing hai jo sirf isi browser mein save hui hai. Iski online booking abhi available nahi hai.', true);
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  serviceIdInput.value = button.dataset.serviceId;
  bookingDateInput.value = checkInInput.value || today;
  bookingMessage.classList.add('hidden');
  paymentSection.classList.add('hidden');
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  bookingDateInput.focus({ preventScroll: true });
});

hostListingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  hostListingMessage.classList.add('hidden');

  const formData = new FormData(hostListingForm);
  const image = String(formData.get('image')).trim();
  if (image) {
    let parsedImage;
    try {
      parsedImage = new URL(image);
    } catch {
      showMessage(hostListingMessage, 'Photo ke liye valid https:// ya http:// link daalein.', true);
      return;
    }
    if (!['https:', 'http:'].includes(parsedImage.protocol)) {
      showMessage(hostListingMessage, 'Photo ke liye valid https:// ya http:// link daalein.', true);
      return;
    }
  }

  const listing = {
    id: String(Date.now()),
    title: String(formData.get('title')).trim(),
    type: String(formData.get('type')),
    location: String(formData.get('location')).trim(),
    address: String(formData.get('address')).trim(),
    price: Number(formData.get('price')),
    beds: Number(formData.get('beds')),
    description: String(formData.get('description')).trim(),
    image,
  };

  try {
    const listings = getSavedListings();
    listings.unshift(listing);
    localStorage.setItem(hostListingsKey, JSON.stringify(listings));
    roomGrid.prepend(createHostListingCard(listing));
    hostListingForm.reset();
    document.getElementById('listingBeds').value = '1';
    document.getElementById('resultsMessage').textContent = 'Aapka room location aur monthly rent ke saath list ho gaya.';
    showMessage(hostListingMessage, 'Room listing save ho gayi. Yeh address aur map link ke saath isi device ke browser mein dikhegi.');
    document.getElementById('stays').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showMessage(hostListingMessage, `Listing save nahi ho saki: ${error.message}`, true);
  }
});

bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  paymentSection.classList.add('hidden');
  bookingMessage.classList.add('hidden');
  paymentMessage.classList.add('hidden');

  const submitButton = bookingForm.querySelector('button[type="submit"]');
  const defaultText = submitButton.textContent;
  setLoading(submitButton, true, 'Request bheji ja rahi hai...', defaultText);

  try {
    const response = await fetch('http://localhost:5000/api/bookings/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: document.getElementById('userId').value,
        serviceId: serviceIdInput.value,
        bookingDate: bookingDateInput.value,
      }),
    });
    const result = await response.json();

    if (!response.ok || !result?.data) {
      throw new Error(result?.message || 'Booking request poori nahi ho saki.');
    }

    const bookingData = result.data;
    bookingIdText.textContent = `#${bookingData.bookingId}`;
    bookingPriceText.dataset.amount = bookingData.price;
    bookingPriceText.textContent = `₹${Number(bookingData.price).toLocaleString('en-IN')} / mahina`;
    showMessage(bookingMessage, `Booking request mil gayi! Aapki booking ID ${bookingData.bookingId} hai. Payment details neeche dekhein.`);
    paymentSection.classList.remove('hidden');
    paymentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (error) {
    showMessage(
      bookingMessage,
      error instanceof TypeError
        ? 'Booking service se connection nahi ho paaya. Thodi der baad phir koshish karein.'
        : error.message,
      true,
    );
  } finally {
    setLoading(submitButton, false, '', defaultText);
  }
});

paymentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  paymentMessage.classList.add('hidden');

  const submitButton = paymentForm.querySelector('button[type="submit"]');
  const defaultText = submitButton.textContent;
  setLoading(submitButton, true, 'Payment process ho raha hai...', defaultText);

  try {
    const response = await fetch('http://localhost:5000/api/payments/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: bookingIdText.textContent.replace('#', ''),
        amount: bookingPriceText.dataset.amount,
        paymentMethod: document.getElementById('paymentMethod').value,
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || 'Payment poora nahi ho paaya.');
    }

    showMessage(paymentMessage, result?.message || 'Payment safaltapurvak process ho gaya.');
  } catch (error) {
    showMessage(
      paymentMessage,
      error instanceof TypeError
        ? 'Payment service se connection nahi ho paaya. Aapki booking ID yahin surakshit hai; thodi der baad phir koshish karein.'
        : error.message,
      true,
    );
  } finally {
    setLoading(submitButton, false, '', defaultText);
  }
});
