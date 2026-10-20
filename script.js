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
let visibleListings = [];
let ownerBookingData = [];
const languageStorageKey = 'sukoon-stay-language';
let currentLanguage = localStorage.getItem(languageStorageKey) === 'en' ? 'en' : 'hi';

const messages = {
  en: {
    noBookings: 'No booking requests yet.',
    bookingLoadFailed: (message) => `Could not load booking requests: ${message}`,
    backendPending: 'Cloud backend setup is pending for shared listings and bookings.',
    cloudConnection: 'Could not connect to the cloud server. Please try again shortly.',
    invalidResponse: 'The server returned an invalid response.',
    requestFailed: 'The request could not be completed.',
    mapOwner: 'View owner’s Google Maps link ↗',
    mapAddress: 'View address on map ↗',
    roomPhotoAlt: (title) => `Photo of ${title}`,
    rentPeriod: '/ month',
    bed: (count) => `${count} bed${Number(count) === 1 ? '' : 's'}`,
    bathroomPhotoAlt: (title) => `Washroom photo for ${title}`,
    bathroomPhoto: 'Washroom photo',
    chooseRoom: 'Choose this room',
    publishRoom: 'Publish room listing',
    ownerSignIn: 'Sign in as owner to manage listings',
    sendBooking: 'Send booking request',
    renterSignIn: 'Sign in as renter to book',
    renterSignedIn: (name) => `Signed in as renter: ${name}. Your saved profile will be used for booking requests.`,
    selectRoom: 'Choose a room or flat',
    noRoomAvailable: 'No rooms are available yet',
    roomsFound: (count) => `${count} room${count === 1 ? '' : 's'} and flat${count === 1 ? '' : 's'} found — view locations and monthly rent.`,
    noRooms: 'No rooms are listed yet. Property owners can add their rooms.',
    backendSetup: 'Cloud backend setup is pending to show shared listings.',
    roomsFailed: 'Could not load rooms',
    noSearchMatch: 'No rooms found in this area. Try another city or area name.',
    pleaseWait: 'Please wait…',
    ownerSignedIn: (name) => `Signed in as owner${name ? `: ${name}` : ''}.`,
    ownerReady: (name) => `${name}, you are signed in. You can now publish a room listing.`,
    tenantSignedOut: 'You have signed out of your renter account.',
    ownerSignedOut: 'You have signed out.',
    roomPhotoRequired: 'A room photo is required. Each photo must be 2 MB or smaller.',
    photoTooLarge: 'Each photo must be 2 MB or smaller.',
    photoType: 'Please upload JPG, PNG, or WebP photos only.',
    publishing: 'Publishing listing…',
    publishedResults: 'Your room, photos, map, and monthly rent are now visible to all visitors.',
    published: 'Your room listing, photos, and map link have been saved and published.',
    bookingSaving: 'Saving booking request…',
    bookingSaved: (id, name) => `Your booking request is saved. Request ID: ${id}. The property owner can contact you at your registered phone or email.`,
    ownerBooking: (id) => `Request #${id}`,
    tenant: (name) => `Renter: ${name}`,
    contact: (phone, email) => `Contact: ${phone} · ${email}`,
    moveIn: (date, rent) => `Move-in: ${date} · Rent: ₹${rent} / month`,
    bookingRequests: 'Booking requests for your rooms',
    language: 'Switch language to Hindi',
  },
  hi: {
    noBookings: 'अभी कोई बुकिंग अनुरोध नहीं आया है।',
    bookingLoadFailed: (message) => `बुकिंग अनुरोध लोड नहीं हो पाए: ${message}`,
    backendPending: 'साझा लिस्टिंग और बुकिंग के लिए क्लाउड बैकएंड सेटअप बाकी है।',
    cloudConnection: 'क्लाउड सर्वर से कनेक्ट नहीं हो पाया। थोड़ी देर बाद फिर कोशिश करें।',
    invalidResponse: 'सर्वर से सही जवाब नहीं मिला।',
    requestFailed: 'अनुरोध पूरा नहीं हो पाया।',
    mapOwner: 'मालिक का Google Maps लिंक देखें ↗',
    mapAddress: 'पता मैप पर देखें ↗',
    roomPhotoAlt: (title) => `${title} की तस्वीर`,
    rentPeriod: '/ महीना',
    bed: (count) => `${count} बेड`,
    bathroomPhotoAlt: (title) => `${title} के वॉशरूम की तस्वीर`,
    bathroomPhoto: 'वॉशरूम की तस्वीर',
    chooseRoom: 'यह कमरा चुनें',
    publishRoom: 'कमरे की लिस्टिंग प्रकाशित करें',
    ownerSignIn: 'लिस्टिंग के लिए मकान मालिक साइन इन करें',
    sendBooking: 'बुकिंग अनुरोध भेजें',
    renterSignIn: 'बुकिंग के लिए किरायेदार साइन इन करें',
    renterSignedIn: (name) => `किरायेदार के रूप में साइन इन हैं: ${name}। बुकिंग अनुरोध में आपकी सेव की हुई जानकारी इस्तेमाल होगी।`,
    selectRoom: 'कमरा या फ्लैट चुनें',
    noRoomAvailable: 'अभी कोई कमरा उपलब्ध नहीं है',
    roomsFound: (count) => `${count} कमरे और फ्लैट मिले — लोकेशन और मासिक किराया देखें।`,
    noRooms: 'अभी कोई कमरा लिस्ट नहीं हुआ है। मकान मालिक अपने कमरे जोड़ सकते हैं।',
    backendSetup: 'साझा लिस्टिंग देखने के लिए क्लाउड बैकएंड सेटअप बाकी है।',
    roomsFailed: 'कमरे लोड नहीं हो पाए',
    noSearchMatch: 'इस इलाके में कमरा नहीं मिला। किसी दूसरे शहर या इलाके का नाम आज़माएँ।',
    pleaseWait: 'कृपया रुकें…',
    ownerSignedIn: (name) => `मकान मालिक के रूप में साइन इन हैं${name ? `: ${name}` : ''}।`,
    ownerReady: (name) => `${name}, आप साइन इन हो गए हैं। अब कमरे की लिस्टिंग प्रकाशित कर सकते हैं।`,
    tenantSignedOut: 'आप अपने किरायेदार खाते से साइन आउट हो गए हैं।',
    ownerSignedOut: 'आप साइन आउट हो गए हैं।',
    roomPhotoRequired: 'कमरे की तस्वीर ज़रूरी है। हर तस्वीर 2 MB या उससे छोटी होनी चाहिए।',
    photoTooLarge: 'हर तस्वीर 2 MB या उससे छोटी होनी चाहिए।',
    photoType: 'कृपया सिर्फ JPG, PNG या WebP तस्वीरें अपलोड करें।',
    publishing: 'लिस्टिंग प्रकाशित हो रही है…',
    publishedResults: 'आपका कमरा, तस्वीरें, मैप और मासिक किराया अब सभी लोगों को दिखेगा।',
    published: 'कमरे की लिस्टिंग, तस्वीरें और मैप लिंक सेव करके प्रकाशित कर दिए गए हैं।',
    bookingSaving: 'बुकिंग अनुरोध सेव हो रहा है…',
    bookingSaved: (id, name) => `आपका बुकिंग अनुरोध सेव हो गया। अनुरोध ID: ${id}। मकान मालिक आपके दिए फोन या ईमेल पर संपर्क कर सकते हैं।`,
    ownerBooking: (id) => `अनुरोध #${id}`,
    tenant: (name) => `किरायेदार: ${name}`,
    contact: (phone, email) => `संपर्क: ${phone} · ${email}`,
    moveIn: (date, rent) => `आने की तारीख: ${date} · किराया: ₹${rent} / महीना`,
    bookingRequests: 'आपके कमरों के बुकिंग अनुरोध',
    language: 'भाषा अंग्रेज़ी में बदलें',
  },
};

const staticTranslations = [
  ['.brand-wrap small', 'A place that feels like home', 'हर सफ़र, घर जैसा'],
  ['nav[aria-label] a:nth-child(1)', 'Home', 'होम'],
  ['nav[aria-label] a:nth-child(2)', 'Rooms', 'कमरे'],
  ['nav[aria-label] a:nth-child(3)', 'Owners', 'मकान मालिक'],
  ['nav[aria-label] a:nth-child(4)', 'Sign in', 'लॉगिन'],
  ['nav[aria-label] a:nth-child(5)', 'Payments', 'भुगतान'],
  ['.nav-btn', 'Browse rooms', 'कमरे देखें'],
  ['.role-choice-heading .eyebrow', 'Welcome to Sukoon Stay', 'सुकून स्टे में आपका स्वागत है'],
  ['#roleChoiceTitle', 'What would you like to do?', 'आप क्या करना चाहेंगे?'],
  ['.role-choice-heading > p', 'Choose the right path for you — find a room or list your property.', 'अपने लिए सही रास्ता चुनें — कमरा ढूँढें या अपनी प्रॉपर्टी लिस्ट करें।'],
  ['.renter-role h3', 'I am looking to rent a room', 'मुझे किराये पर कमरा चाहिए'],
  ['.renter-role p', 'Browse monthly rooms, create a renter account, and send a booking request.', 'मासिक किराये पर कमरे देखें, किरायेदार खाता बनाएँ और बुकिंग अनुरोध भेजें।'],
  ['.renter-role .role-link', 'Renter sign in / registration', 'किरायेदार लॉगिन / रजिस्ट्रेशन'],
  ['.owner-role h3', 'I am a property owner', 'मैं मकान मालिक हूँ'],
  ['.owner-role p', 'Create a listing with your room details, monthly rent, and address.', 'कमरे की जानकारी, मासिक किराया और पता देकर लिस्टिंग बनाएँ।'],
  ['.owner-role .role-link', 'List your room', 'अपना कमरा लिस्ट करें'],
  ['.hero-copy > .eyebrow', 'Welcome', 'आपका स्वागत है'],
  ['.hero-copy h1', 'Find a place where you can feel at home.', 'ऐसी जगह चुनें, जहाँ आपको घर जैसा सुकून मिले।'],
  ['.hero-copy > p', 'Find a comfortable room or flat by monthly rent, budget, and preference.', 'अपने बजट और पसंद के अनुसार मासिक किराये पर आरामदायक कमरा या फ्लैट ढूँढें।'],
  ['label[for="destination"]', 'Where are you going?', 'कहाँ जाना है?'],
  ['label[for="checkIn"]', 'When do you need it?', 'कब से चाहिए?'],
  ['.search-btn', 'Find a room', 'कमरा खोजें'],
  ['.rating-row > div:nth-child(1) strong', 'Monthly stays', 'मासिक ठहराव'],
  ['.rating-row > div:nth-child(1) span', 'Monthly rent', 'मासिक किराया'],
  ['.rating-row > div:nth-child(2) strong', 'Location', 'लोकेशन'],
  ['.rating-row > div:nth-child(2) span', 'Address and map', 'पता और मैप'],
  ['.rating-row > div:nth-child(3) strong', 'Property owner', 'मकान मालिक'],
  ['.rating-row > div:nth-child(3) span', 'List after sign in', 'साइन इन करके लिस्ट करें'],
  ['.feature-card-content .pill', 'Sample room photo', 'कमरे की नमूना तस्वीर'],
  ['.feature-card-content h3', 'Find the right place for you', 'अपने लिए सही जगह ढूँढें'],
  ['.feature-card-content p', 'Browse live room listings, rent, and locations below.', 'नीचे कमरों की लिस्टिंग, किराया और लोकेशन देखें।'],
  ['.feature-strip .feature-box:nth-child(1) h4', 'Handpicked places to stay', 'खास चुने हुए कमरे'],
  ['.feature-strip .feature-box:nth-child(1) p', 'Selected with comfort and peace of mind in focus.', 'आराम और सुकून को ध्यान में रखकर चुने गए।'],
  ['.feature-strip .feature-box:nth-child(2) h4', 'Booking requests', 'बुकिंग अनुरोध'],
  ['.feature-strip .feature-box:nth-child(2) p', 'Choose a monthly room and send your move-in date.', 'मासिक किराये पर कमरा चुनें और आने की तारीख भेजें।'],
  ['.feature-strip .feature-box:nth-child(3) h4', 'Payments not available yet', 'भुगतान अभी उपलब्ध नहीं'],
  ['.feature-strip .feature-box:nth-child(3) p', 'Online payments are not collected yet.', 'अभी ऑनलाइन भुगतान नहीं लिया जाता।'],
  ['.rooms-section .section-head .eyebrow', 'Monthly rentals', 'मासिक किराये पर'],
  ['.rooms-section .section-head h2', 'Rooms and flats', 'कमरे और फ्लैट'],
  ['.rooms-section .section-head .booking-intro', 'The sample prices above are for demonstration. Property owners can add their real location, address, and monthly rent here.', 'ऊपर के किराये सिर्फ उदाहरण हैं। मकान मालिक यहाँ अपने कमरे की असली लोकेशन, पता और मासिक किराया जोड़ सकते हैं।'],
  ['#resultsMessage', 'Loading rooms…', 'कमरे लोड हो रहे हैं…'],
  ['.host-section .section-head .eyebrow', 'For property owners', 'मकान मालिकों के लिए'],
  ['.host-section .section-head h2', 'List your room or flat', 'अपना कमरा या फ्लैट लिस्ट करें'],
  ['.host-section > .card-panel > .booking-intro', 'Create an owner account or sign in. Your listing will be saved to the cloud database and may be visible to all visitors.', 'मकान मालिक का खाता बनाएँ या साइन इन करें। आपकी लिस्टिंग क्लाउड डेटाबेस में सेव होगी और सभी लोगों को दिख सकती है।'],
  ['.host-section .privacy-note', 'Your address, map link, and uploaded photos will be public. Tenant name, phone, and email from a booking are visible only to the signed-in property owner.', 'आपका पता, मैप लिंक और अपलोड की गई तस्वीरें सभी को दिखेंगी। बुकिंग करने वाले किरायेदार का नाम, फोन और ईमेल सिर्फ साइन इन किए हुए मकान मालिक को दिखेंगे।'],
  ['#ownerRegisterForm h3', 'Create an owner account', 'मकान मालिक का नया खाता'],
  ['label[for="ownerName"]', 'Your name', 'आपका नाम'],
  ['label[for="ownerPhone"]', 'Phone number', 'फोन नंबर'],
  ['label[for="ownerRegisterEmail"]', 'Email', 'ईमेल'],
  ['label[for="ownerRegisterPassword"]', 'Password (at least 10 characters)', 'पासवर्ड (कम से कम 10 अक्षर)'],
  ['#ownerRegisterForm button[type="submit"]', 'Create owner account', 'मकान मालिक का खाता बनाएँ'],
  ['#ownerLoginForm h3', 'Owner sign in', 'मकान मालिक लॉगिन'],
  ['label[for="ownerLoginEmail"]', 'Email', 'ईमेल'],
  ['label[for="ownerLoginPassword"]', 'Password', 'पासवर्ड'],
  ['#ownerLoginForm button[type="submit"]', 'Sign in to manage listings', 'लिस्टिंग देखने के लिए साइन इन करें'],
  ['#ownerLogoutButton', 'Sign out', 'लॉग आउट'],
  ['#ownerBookings h3', 'Booking requests for your rooms', 'आपके कमरों के बुकिंग अनुरोध'],
  ['#hostListingFields legend', 'Room details', 'कमरे की जानकारी'],
  ['label[for="listingTitle"]', 'Room / flat name', 'कमरे / फ्लैट का नाम'],
  ['label[for="listingType"]', 'Property type', 'प्रॉपर्टी का प्रकार'],
  ['label[for="listingLocation"]', 'City / area', 'शहर / इलाका'],
  ['label[for="listingAddress"]', 'Full address', 'पूरा पता'],
  ['label[for="listingMapUrl"]', 'Google Maps share link', 'Google Maps शेयर लिंक'],
  ['label[for="listingPrice"]', 'Monthly rent (₹)', 'मासिक किराया (₹)'],
  ['label[for="listingBeds"]', 'Number of beds', 'कितने बेड'],
  ['label[for="listingDescription"]', 'About the room', 'कमरे के बारे में'],
  ['label[for="listingImage"]', 'Room photo', 'कमरे की तस्वीर'],
  ['#roomPhotoHint', 'JPG, PNG, or WebP · up to 2 MB. This photo will be public.', 'JPG, PNG या WebP · अधिकतम 2 MB। यह तस्वीर सभी को दिखेगी।'],
  ['label[for="bathroomImage"]', 'Washroom photo', 'वॉशरूम की तस्वीर'],
  ['label[for="bathroomImage"] .field-hint', '(optional)', '(वैकल्पिक)'],
  ['#bathroomPhotoHint', 'JPG, PNG, or WebP · up to 2 MB. This photo will be public.', 'JPG, PNG या WebP · अधिकतम 2 MB। यह तस्वीर सभी को दिखेगी।'],
  ['#hostListingForm button[type="submit"]', 'Sign in as owner to save a listing', 'लिस्टिंग सेव करने के लिए मकान मालिक साइन इन करें'],
  ['.booking-panel .section-head .eyebrow', 'Next step', 'अगला कदम'],
  ['.booking-panel .section-head h2', 'Send a move-in request', 'कमरे में आने का अनुरोध भेजें'],
  ['.booking-panel .section-head .booking-intro', 'Create a renter account or sign in to send a booking request.', 'बुकिंग अनुरोध भेजने के लिए किरायेदार खाता बनाएँ या साइन इन करें।'],
  ['#tenantRegisterForm h3', 'Create a renter account', 'किरायेदार का नया खाता'],
  ['label[for="tenantRegisterName"]', 'Your name', 'आपका नाम'],
  ['label[for="tenantRegisterPhone"]', 'Phone number', 'फोन नंबर'],
  ['label[for="tenantRegisterEmail"]', 'Email', 'ईमेल'],
  ['label[for="tenantRegisterPassword"]', 'Password (at least 10 characters)', 'पासवर्ड (कम से कम 10 अक्षर)'],
  ['#tenantRegisterForm button[type="submit"]', 'Create renter account', 'किरायेदार का खाता बनाएँ'],
  ['#tenantLoginForm h3', 'Renter sign in', 'किरायेदार लॉगिन'],
  ['label[for="tenantLoginEmail"]', 'Email', 'ईमेल'],
  ['label[for="tenantLoginPassword"]', 'Password', 'पासवर्ड'],
  ['#tenantLoginForm button[type="submit"]', 'Sign in', 'साइन इन'],
  ['#tenantLogoutButton', 'Renter sign out', 'किरायेदार लॉग आउट'],
  ['label[for="listingId"]', 'Room / flat', 'कमरा / फ्लैट'],
  ['label[for="bookingDate"]', 'Move-in date', 'आने की तारीख'],
  ['label[for="tenantName"]', 'Your name', 'आपका नाम'],
  ['label[for="tenantEmail"]', 'Email', 'ईमेल'],
  ['label[for="tenantPhone"]', 'Phone number', 'फोन नंबर'],
  ['#bookingForm .privacy-note', 'Your renter account name, email, and phone will be shared with the owner of the selected room for this booking request. Payments are not set up yet.', 'इस बुकिंग अनुरोध के लिए आपके किरायेदार खाते का नाम, ईमेल और फोन चुने हुए कमरे के मालिक के साथ साझा होगा। भुगतान अभी उपलब्ध नहीं है।'],
  ['#bookingForm button[type="submit"]', 'Sign in as renter to book', 'बुकिंग के लिए किरायेदार साइन इन करें'],
  ['#listingId option', 'Load rooms first', 'पहले कमरे लोड होने दें'],
  ['.payment-panel .section-head .eyebrow', 'Payments coming later', 'भुगतान बाद में'],
  ['.payment-panel .section-head h2', 'Payments are not available yet', 'भुगतान अभी उपलब्ध नहीं'],
  ['.payment-panel .section-head .booking-intro', 'Only booking requests are saved in the database for now. Payments will be available after an online payment gateway is set up.', 'अभी सिर्फ बुकिंग अनुरोध डेटाबेस में सेव होंगे। ऑनलाइन पेमेंट गेटवे सेटअप होने के बाद भुगतान का विकल्प आएगा।'],
  ['#paymentSection .meta-label:nth-of-type(1)', 'Booking request ID', 'बुकिंग अनुरोध ID'],
  ['#paymentSection .meta-label:nth-of-type(2)', 'Monthly rent', 'मासिक किराया'],
  ['#paymentMessage', 'No online payments are collected in this demo.', 'इस डेमो में ऑनलाइन भुगतान नहीं लिया जाता।'],
  ['.footer p', 'Sukoon Stay · Your journey, your choice.', 'सुकून स्टे · आपका सफ़र, आपकी पसंद।'],
];

function t(key, ...args) {
  const value = messages[currentLanguage][key];
  return typeof value === 'function' ? value(...args) : value;
}

function setDirectText(element, text) {
  const textNode = [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
  if (!textNode) {
    element.textContent = text;
    return;
  }

  const leadingSpace = /^\s/.test(textNode.nodeValue) ? ' ' : '';
  const trailingSpace = /\s$/.test(textNode.nodeValue) ? ' ' : '';
  textNode.nodeValue = `${leadingSpace}${text}${trailingSpace}`;
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.title = currentLanguage === 'en' ? 'Sukoon Stay | Find your next stay' : 'Sukoon Stay | आपका अगला ठहराव';
  document.querySelector('meta[name="description"]').content = currentLanguage === 'en'
    ? 'Find and book a comfortable monthly room or flat for your next stay.'
    : 'अपने अगले सफ़र के लिए आरामदायक कमरा या फ्लैट आसानी से खोजें और बुकिंग अनुरोध भेजें।';

  staticTranslations.forEach(([selector, english, hindi]) => {
    document.querySelectorAll(selector).forEach((element) => {
      setDirectText(element, currentLanguage === 'en' ? english : hindi);
    });
  });

  const attributes = {
    '#destination': ['e.g. Jaipur, Malviya Nagar', 'जैसे: जयपुर, मालवीय नगर'],
    '#listingTitle': ['e.g. Comfortable 1BHK flat', 'जैसे: आरामदायक 1BHK फ्लैट'],
    '#listingLocation': ['e.g. Malviya Nagar, Jaipur', 'जैसे: मालवीय नगर, जयपुर'],
    '#listingAddress': ['Street, building / landmark, PIN code', 'गली, बिल्डिंग / पहचान की जगह, पिन कोड'],
    '#listingPrice': ['e.g. 12000', 'जैसे: 12000'],
    '#listingDescription': ['Describe amenities, nearby places, and special features.', 'सुविधाएँ, आसपास की जगहें और खास बातें लिखें।'],
    '.hero-image': ['alt', 'A bright, comfortable modern flat living room', 'धूप से रोशन, आरामदायक आधुनिक फ्लैट का लिविंग रूम'],
    '#roomPhotoPreview': ['alt', 'Room photo preview', 'कमरे की तस्वीर का प्रीव्यू'],
    '#bathroomPhotoPreview': ['alt', 'Washroom photo preview', 'वॉशरूम की तस्वीर का प्रीव्यू'],
  };

  Object.entries(attributes).forEach(([selector, values]) => {
    const element = document.querySelector(selector);
    if (!element) return;
    if (values.length === 3) element.setAttribute(values[0], currentLanguage === 'en' ? values[1] : values[2]);
    else element.placeholder = currentLanguage === 'en' ? values[0] : values[1];
  });

  const propertyTypes = {
    'Private room': ['Private room', 'निजी कमरा'],
    'Shared room': ['Shared room', 'साझा कमरा'],
    '1 BHK flat': ['1 BHK flat', '1 BHK फ्लैट'],
    '2 BHK flat': ['2 BHK flat', '2 BHK फ्लैट'],
    'Studio apartment': ['Studio apartment', 'स्टूडियो अपार्टमेंट'],
  };
  document.querySelectorAll('#listingType option').forEach((option) => {
    option.textContent = propertyTypes[option.value][currentLanguage === 'en' ? 0 : 1];
  });

  const toggle = document.getElementById('languageToggle');
  document.getElementById('languageToggleLabel').textContent = currentLanguage === 'en' ? 'हिन्दी' : 'English';
  toggle.setAttribute('aria-label', t('language'));
  toggle.title = t('language');
  document.querySelector('nav[aria-label]').setAttribute(
    'aria-label',
    currentLanguage === 'en' ? 'Main navigation' : 'मुख्य नेविगेशन',
  );
  document.querySelector('.feature-strip').setAttribute(
    'aria-label',
    currentLanguage === 'en' ? 'Why choose Sukoon Stay' : 'सुकून स्टे क्यों चुनें',
  );
  document.querySelector('#stays').setAttribute(
    'aria-label',
    currentLanguage === 'en' ? 'Popular rooms' : 'लोकप्रिय कमरे',
  );

  if (visibleListings.length || publicListings.length) renderListings(visibleListings, false);
  if (!ownerBookings.classList.contains('hidden')) renderOwnerBookings(ownerBookingData);
  document.querySelectorAll('.alert-message[data-language-key]').forEach((element) => {
    const args = JSON.parse(element.dataset.languageArgs || '[]');
    showLanguageMessage(element, element.dataset.languageKey, ...args);
  });
  updateOwnerSession(false);
  updateTenantSession();
}

document.getElementById('languageToggle').addEventListener('click', () => {
  currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
  localStorage.setItem(languageStorageKey, currentLanguage);
  applyLanguage();
});

function showMessage(element, message, isError = false) {
  delete element.dataset.languageKey;
  delete element.dataset.languageArgs;
  element.textContent = message;
  element.classList.remove('hidden', 'error');
  if (isError) element.classList.add('error');
}

function showLanguageMessage(element, key, ...args) {
  showMessage(element, t(key, ...args));
  element.dataset.languageKey = key;
  element.dataset.languageArgs = JSON.stringify(args);
}

function setLoading(button, isLoading, loadingText, defaultText) {
  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : defaultText;
}

function renderOwnerBookings(bookings) {
  ownerBookingData = bookings;
  ownerBookingsList.replaceChildren();
  if (!bookings.length) {
    ownerBookingsList.textContent = t('noBookings');
    return;
  }

  bookings.forEach((booking) => {
    const item = document.createElement('article');
    item.className = 'owner-booking-card';
    const title = document.createElement('h4');
    title.textContent = `${booking.title} · ${t('ownerBooking', booking.bookingId)}`;
    const tenant = document.createElement('p');
    tenant.textContent = t('tenant', booking.tenantName);
    const contact = document.createElement('p');
    contact.textContent = t('contact', booking.tenantPhone, booking.tenantEmail);
    const date = document.createElement('p');
    date.textContent = t('moveIn', booking.moveInDate, Number(booking.monthlyRent).toLocaleString('en-IN'));
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
    showMessage(ownerAuthMessage, t('bookingLoadFailed', error.message), true);
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
    throw new Error(t('backendPending'));
  }

  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, options);
  } catch {
    throw new Error(t('cloudConnection'));
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(t('invalidResponse'));
  }

  if (!response.ok) {
    if (response.status === 401) {
      const token = options.headers?.Authorization?.replace(/^Bearer\s+/i, '');
      if (token && token === sessionStorage.getItem(ownerTokenKey)) clearOwnerSession();
      if (token && token === sessionStorage.getItem(tenantTokenKey)) clearTenantSession();
    }
    throw new Error(result?.message || t('requestFailed'));
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
  link.textContent = listing.mapUrl ? t('mapOwner') : t('mapAddress');
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
  image.alt = t('roomPhotoAlt', listing.title);
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
  rentPeriod.textContent = t('rentPeriod');
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
  const propertyTypes = {
    'Private room': ['Private room', 'निजी कमरा'],
    'Shared room': ['Shared room', 'साझा कमरा'],
    '1 BHK flat': ['1 BHK flat', '1 BHK फ्लैट'],
    '2 BHK flat': ['2 BHK flat', '2 BHK फ्लैट'],
    'Studio apartment': ['Studio apartment', 'स्टूडियो अपार्टमेंट'],
  };
  propertyType.textContent = propertyTypes[listing.type]?.[currentLanguage === 'en' ? 0 : 1] || listing.type;
  const beds = document.createElement('li');
  beds.textContent = t('bed', listing.beds);
  features.append(propertyType, beds);

  if (listing.bathroomImage) {
    const bathroomPhoto = document.createElement('div');
    bathroomPhoto.className = 'bathroom-photo';
    const bathroomImage = document.createElement('img');
    bathroomImage.src = `${apiBaseUrl}${listing.bathroomImage}`;
    bathroomImage.alt = t('bathroomPhotoAlt', listing.title);
    bathroomImage.loading = 'lazy';
    const bathroomLabel = document.createElement('span');
    bathroomLabel.textContent = t('bathroomPhoto');
    bathroomPhoto.append(bathroomImage, bathroomLabel);
    body.append(bathroomPhoto);
  }

  const bookButton = document.createElement('button');
  bookButton.className = 'room-book-btn';
  bookButton.type = 'button';
  bookButton.dataset.listingId = String(listing.id);
  bookButton.textContent = t('chooseRoom');

  body.append(heading, description, locationDetails, features, bookButton);
  card.append(visual, body);
  return card;
}

function updateOwnerSession(loadBookings = true) {
  const isSignedIn = Boolean(apiBaseUrl && sessionStorage.getItem(ownerTokenKey));
  hostListingFields.disabled = !isSignedIn;
  hostListingSubmit.disabled = !isSignedIn;
  hostListingSubmit.textContent = isSignedIn ? t('publishRoom') : t('ownerSignIn');
  ownerLogoutButton.classList.toggle('hidden', !isSignedIn);
  ownerBookings.classList.toggle('hidden', !isSignedIn);
  if (!isSignedIn) ownerBookingsList.replaceChildren();
  if (isSignedIn) {
    showMessage(ownerAuthMessage, t('ownerSignedIn', sessionStorage.getItem(ownerNameKey)));
    if (loadBookings) loadOwnerBookings();
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
    ? t('sendBooking')
    : t('renterSignIn');
}

function updateTenantSession() {
  const isSignedIn = Boolean(apiBaseUrl && sessionStorage.getItem(tenantTokenKey));
  tenantAuthForms.classList.toggle('hidden', isSignedIn);
  tenantLogoutButton.classList.toggle('hidden', !isSignedIn);
  document.getElementById('tenantName').value = isSignedIn ? sessionStorage.getItem(tenantNameKey) || '' : '';
  document.getElementById('tenantEmail').value = isSignedIn ? sessionStorage.getItem(tenantEmailKey) || '' : '';
  document.getElementById('tenantPhone').value = isSignedIn ? sessionStorage.getItem(tenantPhoneKey) || '' : '';
  if (isSignedIn) {
    showMessage(tenantAuthMessage, t('renterSignedIn', sessionStorage.getItem(tenantNameKey) || ''));
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
  const selectedListingId = listingSelect.value;
  if (updateSource) publicListings = listings;
  visibleListings = listings;
  roomGrid.replaceChildren(...listings.map(createListingCard));

  listingSelect.replaceChildren();
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = listings.length ? t('selectRoom') : t('noRoomAvailable');
  listingSelect.append(placeholder);

  listings.forEach((listing) => {
    const option = document.createElement('option');
    option.value = String(listing.id);
    option.textContent = `${listing.title} · ${listing.location} · ₹${Number(listing.price).toLocaleString('en-IN')} ${t('rentPeriod')}`;
    listingSelect.append(option);
  });
  if (listings.some((listing) => String(listing.id) === selectedListingId)) {
    listingSelect.value = selectedListingId;
  }

  updateBookingAccess();
  resultsMessage.textContent = listings.length
    ? t('roomsFound', listings.length)
    : t('noRooms');
}

async function loadListings() {
  if (!apiBaseUrl) {
    resultsMessage.textContent = t('backendSetup');
    listingSelect.innerHTML = `<option value="">${t('backendPending')}</option>`;
    updateBookingAccess();
    return;
  }

  try {
    const result = await apiRequest('/api/listings');
    renderListings(result.data || []);
  } catch (error) {
    resultsMessage.textContent = error.message;
    listingSelect.innerHTML = `<option value="">${t('roomsFailed')}</option>`;
    updateBookingAccess();
  }
}

const today = localDateString();
bookingDateInput.min = today;
checkInInput.min = today;
bookingDateInput.value = today;
checkInInput.value = today;
applyLanguage();
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
    resultsMessage.textContent = t('noSearchMatch');
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
  setLoading(button, true, t('pleaseWait'), defaultText);
  ownerAuthMessage.classList.add('hidden');

  try {
    const values = Object.fromEntries(new FormData(form));
    const result = await apiRequest(endpoint, requestOptions(values));
    sessionStorage.setItem(ownerTokenKey, result.data.token);
    sessionStorage.setItem(ownerNameKey, result.data.name);
    form.reset();
    updateOwnerSession();
    showMessage(ownerAuthMessage, t('ownerReady', result.data.name));
  } catch (error) {
    showMessage(ownerAuthMessage, error.message, true);
  } finally {
    setLoading(button, false, '', defaultText || submitLabel);
  }
}

document.getElementById('ownerRegisterForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  await submitOwnerAuth(event.currentTarget, '/api/auth/register-owner', t('ownerSignIn'));
});

document.getElementById('ownerLoginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  await submitOwnerAuth(event.currentTarget, '/api/auth/login-owner', 'Sign in');
});

async function submitTenantAuth(form, endpoint) {
  const button = form.querySelector('button[type="submit"]');
  const defaultText = button.textContent;
  setLoading(button, true, t('pleaseWait'), defaultText);
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
  showLanguageMessage(tenantAuthMessage, 'tenantSignedOut');
});

ownerLogoutButton.addEventListener('click', () => {
  clearOwnerSession();
  showLanguageMessage(ownerAuthMessage, 'ownerSignedOut');
});

hostListingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  hostListingMessage.classList.add('hidden');

  const button = hostListingForm.querySelector('button[type="submit"]');
  const defaultText = button.textContent;
  const roomPhoto = document.getElementById('listingImage').files[0];
  const bathroomPhoto = document.getElementById('bathroomImage').files[0];
  if (!roomPhoto || roomPhoto.size > 2 * 1024 * 1024 || (bathroomPhoto && bathroomPhoto.size > 2 * 1024 * 1024)) {
    showLanguageMessage(hostListingMessage, 'roomPhotoRequired');
    hostListingMessage.classList.add('error');
    return;
  }
  setLoading(button, true, t('publishing'), defaultText);

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
    document.getElementById('resultsMessage').textContent = t('publishedResults');
    showLanguageMessage(hostListingMessage, 'published');
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
      showLanguageMessage(hostListingMessage, 'photoTooLarge');
      hostListingMessage.classList.add('error');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      input.value = '';
      showLanguageMessage(hostListingMessage, 'photoType');
      hostListingMessage.classList.add('error');
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
  setLoading(button, true, t('bookingSaving'), defaultText);

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
    document.getElementById('bookingPriceText').textContent = `₹${Number(booking.monthlyRent).toLocaleString('en-IN')} ${t('rentPeriod')}`;
    showLanguageMessage(bookingMessage, 'bookingSaved', booking.bookingId, sessionStorage.getItem(tenantNameKey));
    document.getElementById('paymentSection').classList.remove('hidden');
    document.getElementById('payments').scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (error) {
    showMessage(bookingMessage, error.message, true);
  } finally {
    setLoading(button, false, '', defaultText);
  }
});

loadListings();
