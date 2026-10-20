const apiBaseUrl = document.querySelector('meta[name="api-base-url"]').content.trim().replace(/\/+$/, '');
const ownerTokenKey = 'sukoon-stay-owner-token';
const ownerNameKey = 'sukoon-stay-owner-name';
const tenantTokenKey = 'sukoon-stay-tenant-token';
const tenantNameKey = 'sukoon-stay-tenant-name';
const tenantEmailKey = 'sukoon-stay-tenant-email';
const tenantPhoneKey = 'sukoon-stay-tenant-phone';
const bookingForm = document.getElementById('bookingForm');
const bookingMessage = document.getElementById('bookingMessage');
const bookingDateInput = document.getElementById('bookingDate');
const checkInInput = document.getElementById('checkIn');
const listingSelect = document.getElementById('listingId');
const roomGrid = document.getElementById('roomGrid');
const resultsMessage = document.getElementById('resultsMessage');
const hostListingForm = document.getElementById('hostListingForm');
const hostListingMessage = document.getElementById('hostListingMessage');
const ownerAuthMessage = document.getElementById('ownerAuthMessage');
const ownerBookings = document.getElementById('ownerBookings');
const ownerBookingsList = document.getElementById('ownerBookingsList');
const hostListingFields = document.getElementById('hostListingFields');
const hostListingSubmit = hostListingForm.querySelector('button[type="submit"]');
const ownerLogoutButton = document.getElementById('ownerLogoutButton');
const tenantAuthForms = document.getElementById('tenantAuthForms');
const tenantAuthMessage = document.getElementById('tenantAuthMessage');
const tenantLogoutButton = document.getElementById('tenantLogoutButton');
const bookingSubmit = bookingForm.querySelector('button[type="submit"]');
let publicListings = [];

function showMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.remove('hidden', 'error');
  if (isError) element.classList.add('error');
}

function setLoading(button, isLoading, loadingText, defaultText) {
  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : defaultText;
}

function renderOwnerBookings(bookings) {
  ownerBookingsList.replaceChildren();
  if (!bookings.length) {
    ownerBookingsList.textContent = 'Abhi koi booking request nahi aayi.';
    return;
  }

  bookings.forEach((booking) => {
    const item = document.createElement('article');
    item.className = 'owner-booking-card';
    const title = document.createElement('h4');
    title.textContent = `${booking.title} · Request #${booking.bookingId}`;
    const tenant = document.createElement('p');
    tenant.textContent = `Tenant: ${booking.tenantName}`;
    const contact = document.createElement('p');
    contact.textContent = `Contact: ${booking.tenantPhone} · ${booking.tenantEmail}`;
    const date = document.createElement('p');
    date.textContent = `Move-in: ${booking.moveInDate} · Kiraya: ₹${Number(booking.monthlyRent).toLocaleString('en-IN')} / mahina`;
    item.append(title, tenant, contact, date);
    ownerBookingsList.append(item);
  });
}

async function loadOwnerBookings() {
  const token = sessionStorage.getItem(ownerTokenKey);
  if (!token || !apiBaseUrl) return;

  try {
    const result = await apiRequest('/api/bookings/owner', {
      headers: { Authorization: `Bearer ${token}` },
    });
    renderOwnerBookings(result.data || []);
  } catch (error) {
    showMessage(ownerAuthMessage, `Booking requests load nahi ho paayin: ${error.message}`, true);
  }
}

function localDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

async function apiRequest(path, options = {}) {
  if (!apiBaseUrl) {
    throw new Error('Shared listings aur bookings ke liye cloud backend setup pending hai.');
  }

  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, options);
  } catch {
    throw new Error('Cloud server se connection nahi ho paaya. Thodi der baad phir koshish karein.');
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('Server se valid response nahi mila.');
  }

  if (!response.ok) {
    if (response.status === 401) {
      const token = options.headers?.Authorization?.replace(/^Bearer\s+/i, '');
      if (token && token === sessionStorage.getItem(ownerTokenKey)) clearOwnerSession();
      if (token && token === sessionStorage.getItem(tenantTokenKey)) clearTenantSession();
    }
    throw new Error(result?.message || 'Request poori nahi ho saki.');
  }

  return result;
}

function requestOptions(body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return { method: 'POST', headers, body: JSON.stringify(body) };
}

function createLocationLink(listing) {
  const link = document.createElement('a');
  link.className = 'room-location-link';
  link.href = listing.mapUrl || `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${listing.address}, ${listing.location}`)}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = listing.mapUrl ? 'Owner ka Google Maps link ↗' : 'Address map par dekhein ↗';
  return link;
}

function createListingCard(listing) {
  const card = document.createElement('article');
  card.className = 'room-card';
  card.dataset.listingId = String(listing.id);
  card.dataset.location = `${listing.location} ${listing.address}`.toLocaleLowerCase();

  const visual = document.createElement('div');
  visual.className = 'room-visual';
  const image = document.createElement('img');
  image.alt = `${listing.title} ki photo`;
  image.loading = 'lazy';
  image.src = listing.image
    ? (listing.image.startsWith('/') ? `${apiBaseUrl}${listing.image}` : listing.image)
    : 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85';
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
  locationDetails.append(locationName, address, createLocationLink(listing));

  const features = document.createElement('ul');
  const propertyType = document.createElement('li');
  propertyType.textContent = listing.type;
  const beds = document.createElement('li');
  beds.textContent = `${listing.beds} bed`;
  features.append(propertyType, beds);

  if (listing.bathroomImage) {
    const bathroomPhoto = document.createElement('div');
    bathroomPhoto.className = 'bathroom-photo';
    const bathroomImage = document.createElement('img');
    bathroomImage.src = `${apiBaseUrl}${listing.bathroomImage}`;
    bathroomImage.alt = `${listing.title} ke washroom ki photo`;
    bathroomImage.loading = 'lazy';
    const bathroomLabel = document.createElement('span');
    bathroomLabel.textContent = 'Washroom ki photo';
    bathroomPhoto.append(bathroomImage, bathroomLabel);
    body.append(bathroomPhoto);
  }

  const bookButton = document.createElement('button');
  bookButton.className = 'room-book-btn';
  bookButton.type = 'button';
  bookButton.dataset.listingId = String(listing.id);
  bookButton.textContent = 'Yeh room chunein';

  body.append(heading, description, locationDetails, features, bookButton);
  card.append(visual, body);
  return card;
}

function updateOwnerSession() {
  const isSignedIn = Boolean(apiBaseUrl && sessionStorage.getItem(ownerTokenKey));
  hostListingFields.disabled = !isSignedIn;
  hostListingSubmit.disabled = !isSignedIn;
  hostListingSubmit.textContent = isSignedIn ? 'Room listing publish karein' : 'Listing ke liye owner sign in karein';
  ownerLogoutButton.classList.toggle('hidden', !isSignedIn);
  ownerBookings.classList.toggle('hidden', !isSignedIn);
  if (!isSignedIn) ownerBookingsList.replaceChildren();
  if (isSignedIn) {
    showMessage(ownerAuthMessage, `Owner sign in hai${sessionStorage.getItem(ownerNameKey) ? `: ${sessionStorage.getItem(ownerNameKey)}` : ''}.`);
    loadOwnerBookings();
  }
}

function clearOwnerSession() {
  sessionStorage.removeItem(ownerTokenKey);
  sessionStorage.removeItem(ownerNameKey);
  updateOwnerSession();
}

function updateBookingAccess() {
  const isSignedIn = Boolean(apiBaseUrl && sessionStorage.getItem(tenantTokenKey));
  bookingSubmit.disabled = !isSignedIn || publicListings.length === 0;
  bookingSubmit.textContent = isSignedIn
    ? 'Booking request bhejein'
    : 'Booking ke liye renter sign in karein';
}

function updateTenantSession() {
  const isSignedIn = Boolean(apiBaseUrl && sessionStorage.getItem(tenantTokenKey));
  tenantAuthForms.classList.toggle('hidden', isSignedIn);
  tenantLogoutButton.classList.toggle('hidden', !isSignedIn);
  document.getElementById('tenantName').value = isSignedIn ? sessionStorage.getItem(tenantNameKey) || '' : '';
  document.getElementById('tenantEmail').value = isSignedIn ? sessionStorage.getItem(tenantEmailKey) || '' : '';
  document.getElementById('tenantPhone').value = isSignedIn ? sessionStorage.getItem(tenantPhoneKey) || '' : '';
  if (isSignedIn) {
    showMessage(tenantAuthMessage, `Renter sign in hai: ${sessionStorage.getItem(tenantNameKey) || ''}. Booking request mein aapki saved profile details jayengi.`);
  } else {
    tenantAuthMessage.classList.add('hidden');
  }
  updateBookingAccess();
}

function clearTenantSession() {
  sessionStorage.removeItem(tenantTokenKey);
  sessionStorage.removeItem(tenantNameKey);
  sessionStorage.removeItem(tenantEmailKey);
  sessionStorage.removeItem(tenantPhoneKey);
  updateTenantSession();
}

function renderListings(listings, updateSource = true) {
  if (updateSource) publicListings = listings;
  roomGrid.replaceChildren(...listings.map(createListingCard));

  listingSelect.replaceChildren();
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = listings.length ? 'Room ya flat chunein' : 'Abhi room available nahi hai';
  listingSelect.append(placeholder);

  listings.forEach((listing) => {
    const option = document.createElement('option');
    option.value = String(listing.id);
    option.textContent = `${listing.title} · ${listing.location} · ₹${Number(listing.price).toLocaleString('en-IN')}/mahina`;
    listingSelect.append(option);
  });

  updateBookingAccess();
  resultsMessage.textContent = listings.length
    ? `${listings.length} room${listings.length === 1 ? '' : 's'} aur flat mile — location aur monthly rent dekhein.`
    : 'Abhi koi room listed nahi hai. Makan malik apna room list kar sakte hain.';
}

async function loadListings() {
  if (!apiBaseUrl) {
    resultsMessage.textContent = 'Shared listings dekhne ke liye cloud backend setup pending hai.';
    listingSelect.innerHTML = '<option value="">Backend setup pending</option>';
    updateBookingAccess();
    return;
  }

  try {
    const result = await apiRequest('/api/listings');
    renderListings(result.data || []);
  } catch (error) {
    resultsMessage.textContent = error.message;
    listingSelect.innerHTML = '<option value="">Rooms load nahi ho paaye</option>';
    updateBookingAccess();
  }
}

const today = localDateString();
bookingDateInput.min = today;
checkInInput.min = today;
bookingDateInput.value = today;
checkInInput.value = today;
updateOwnerSession();
updateTenantSession();

checkInInput.addEventListener('change', () => {
  bookingDateInput.value = checkInInput.value;
});

bookingDateInput.addEventListener('change', () => {
  checkInInput.value = bookingDateInput.value;
});

document.getElementById('searchForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const query = document.getElementById('destination').value.trim().toLocaleLowerCase();
  const matchingListings = publicListings.filter((listing) => {
    const searchableText = `${listing.location} ${listing.address} ${listing.title} ${listing.description}`.toLocaleLowerCase();
    return !query || searchableText.includes(query);
  });

  renderListings(matchingListings, false);
  if (query && matchingListings.length === 0) {
    resultsMessage.textContent = 'Is area mein room nahi mila. Shehar ya area ka doosra naam try karein.';
  }
  document.getElementById('stays').scrollIntoView({ behavior: 'smooth' });
});

roomGrid.addEventListener('click', (event) => {
  const button = event.target.closest('.room-book-btn');
  if (!button) return;

  listingSelect.value = button.dataset.listingId;
  bookingDateInput.value = checkInInput.value || today;
  bookingMessage.classList.add('hidden');
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  listingSelect.focus({ preventScroll: true });
});

async function submitOwnerAuth(form, endpoint, submitLabel) {
  const button = form.querySelector('button[type="submit"]');
  const defaultText = button.textContent;
  setLoading(button, true, 'Please wait…', defaultText);
  ownerAuthMessage.classList.add('hidden');

  try {
    const values = Object.fromEntries(new FormData(form));
    const result = await apiRequest(endpoint, requestOptions(values));
    sessionStorage.setItem(ownerTokenKey, result.data.token);
    sessionStorage.setItem(ownerNameKey, result.data.name);
    form.reset();
    updateOwnerSession();
    showMessage(ownerAuthMessage, `${result.data.name}, aap sign in ho gaye. Ab room listing publish kar sakte hain.`);
  } catch (error) {
    showMessage(ownerAuthMessage, error.message, true);
  } finally {
    setLoading(button, false, '', defaultText || submitLabel);
  }
}

document.getElementById('ownerRegisterForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  await submitOwnerAuth(event.currentTarget, '/api/auth/register-owner', 'Owner account banayein');
});

document.getElementById('ownerLoginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  await submitOwnerAuth(event.currentTarget, '/api/auth/login-owner', 'Sign in');
});

async function submitTenantAuth(form, endpoint) {
  const button = form.querySelector('button[type="submit"]');
  const defaultText = button.textContent;
  setLoading(button, true, 'Please wait…', defaultText);
  tenantAuthMessage.classList.add('hidden');

  try {
    const values = Object.fromEntries(new FormData(form));
    const result = await apiRequest(endpoint, requestOptions(values));
    sessionStorage.setItem(tenantTokenKey, result.data.token);
    sessionStorage.setItem(tenantNameKey, result.data.name);
    sessionStorage.setItem(tenantEmailKey, result.data.email);
    sessionStorage.setItem(tenantPhoneKey, result.data.phone);
    form.reset();
    updateTenantSession();
  } catch (error) {
    showMessage(tenantAuthMessage, error.message, true);
  } finally {
    setLoading(button, false, '', defaultText);
  }
}

document.getElementById('tenantRegisterForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  await submitTenantAuth(event.currentTarget, '/api/auth/register-tenant');
});

document.getElementById('tenantLoginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  await submitTenantAuth(event.currentTarget, '/api/auth/login-tenant');
});

tenantLogoutButton.addEventListener('click', () => {
  clearTenantSession();
  showMessage(tenantAuthMessage, 'Aap renter account se sign out ho gaye.');
});

ownerLogoutButton.addEventListener('click', () => {
  clearOwnerSession();
  showMessage(ownerAuthMessage, 'Aap sign out ho gaye.');
});

hostListingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  hostListingMessage.classList.add('hidden');

  const button = hostListingForm.querySelector('button[type="submit"]');
  const defaultText = button.textContent;
  const roomPhoto = document.getElementById('listingImage').files[0];
  const bathroomPhoto = document.getElementById('bathroomImage').files[0];
  if (!roomPhoto || roomPhoto.size > 2 * 1024 * 1024 || (bathroomPhoto && bathroomPhoto.size > 2 * 1024 * 1024)) {
    showMessage(hostListingMessage, 'Room ki photo zaroori hai. Har photo 2 MB ya usse chhoti honi chahiye.', true);
    return;
  }
  setLoading(button, true, 'Listing publish ho rahi hai…', defaultText);

  try {
    const formData = new FormData(hostListingForm);
    if (!formData.get('bathroomPhoto')?.size) formData.delete('bathroomPhoto');
    const result = await apiRequest(
      '/api/listings',
      {
        method: 'POST',
        headers: { Authorization: "Bearer " + sessionStorage.getItem(ownerTokenKey) },
        body: formData,
      },
    );
    hostListingForm.reset();
    document.getElementById('listingBeds').value = '1';
    renderListings([result.data, ...publicListings]);
    document.getElementById('resultsMessage').textContent = 'Aapka room photos, map aur monthly rent ke saath sabhi visitors ke liye publish ho gaya.';
    showMessage(hostListingMessage, 'Room listing, photo aur map link cloud database mein save aur publish ho gaye.');
    document.getElementById('stays').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showMessage(hostListingMessage, error.message, true);
  } finally {
    setLoading(button, false, '', defaultText);
  }
});

[
  ['listingImage', 'roomPhotoPreview'],
  ['bathroomImage', 'bathroomPhotoPreview'],
].forEach(([inputId, previewId]) => {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  let previewUrl;

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    preview.classList.add('hidden');
    preview.removeAttribute('src');

    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      input.value = '';
      showMessage(hostListingMessage, 'Har photo 2 MB ya usse chhoti honi chahiye.', true);
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      input.value = '';
      showMessage(hostListingMessage, 'Sirf JPG, PNG ya WebP photo upload karein.', true);
      return;
    }

    previewUrl = URL.createObjectURL(file);
    preview.src = previewUrl;
    preview.classList.remove('hidden');
    hostListingMessage.classList.add('hidden');
  });
});

bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  bookingMessage.classList.add('hidden');

  const button = bookingForm.querySelector('button[type="submit"]');
  const defaultText = button.textContent;
  setLoading(button, true, 'Booking request save ho rahi hai…', defaultText);

  const body = {
    listingId: listingSelect.value,
    moveInDate: bookingDateInput.value,
  };

  try {
    const result = await apiRequest(
      '/api/bookings',
      requestOptions(body, sessionStorage.getItem(tenantTokenKey)),
    );
    const booking = result.data;
    document.getElementById('bookingIdText').textContent = `#${booking.bookingId}`;
    document.getElementById('bookingPriceText').textContent = `₹${Number(booking.monthlyRent).toLocaleString('en-IN')} / mahina`;
    showMessage(bookingMessage, `Aapki booking request save ho gayi. Request ID: ${booking.bookingId}. Makan malik aapse diye gaye phone/email par sampark kar sakte hain.`);
    document.getElementById('paymentSection').classList.remove('hidden');
    document.getElementById('payments').scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (error) {
    showMessage(bookingMessage, error.message, true);
  } finally {
    setLoading(button, false, '', defaultText);
  }
});

loadListings();
