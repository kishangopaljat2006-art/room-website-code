# Sukoon Stay API

The API stores owner accounts, monthly room listings and photos, and tenant booking requests in MySQL. Listing room photos and Google Maps links are public. Online payments are deliberately not enabled: booking requests do not charge a tenant or collect card details.

## Run locally

1. Create a MySQL database, for example `booking_system`.
2. Run `schema.sql` against that database (for example, `mysql -u root -p booking_system < schema.sql` from `backend`).
3. Copy `.env.example` to `.env`, set the database connection, and generate a private JWT secret:

   ```powershell
   Copy-Item .env.example .env
   node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
   ```

   Put the generated value in `JWT_SECRET`. Never commit `.env` or share its contents in chat.
4. Install dependencies and start the API:

   ```powershell
   npm install
   npm start
   ```

The API listens on port `5000` by default. `/health` checks the database connection as well as the API.

## API

- `POST /api/auth/register-owner` — create an owner account. Passwords are stored as scrypt hashes; the API returns a 12-hour signed token.
- `POST /api/auth/login-owner` — sign in to an owner account.
- `POST /api/auth/register-tenant` — create a renter account with name, phone, email, and password; passwords are stored as scrypt hashes.
- `POST /api/auth/login-tenant` — sign in to a renter account.
- `GET /api/listings` — list public rooms and flats, including their advertised address.
- `POST /api/listings` — publish a room listing with its Google Maps link, required room photo, and optional washroom photo; requires an owner token in the `Authorization: Bearer` header. Photos can be JPEG, PNG, or WebP up to 2 MB each.
- `GET /api/listings/:id/photos/room` and `/api/listings/:id/photos/bathroom` — serve public listing photos.
- `POST /api/bookings` — save a signed-in tenant's move-in request and account contact details. The monthly rent is read from the listing in the database, not from the browser.
- `GET /api/bookings/owner` — read tenant contact details for the signed-in owner's own listings.

Owner and renter registration and listing publication are open to the public. Renter sign-in is required to submit a booking request. Basic per-instance request limits protect signup, login, listings, and bookings; add email/phone verification, listing moderation, shared rate limiting, and database backups before promoting the service widely.

## Deploy with Railway + MySQL

1. Create a Railway account and a project, then add a MySQL database.
2. Add this repository as a service and set the service's **root directory** to `/backend`. Railway can run `npm start` for the Node service.
3. In the API service variables, set `DATABASE_URL` to the MySQL service's connection URL, `JWT_SECRET` to a newly generated random secret, `CORS_ORIGINS` to `https://kishangopaljat2006-art.github.io`, and `TRUST_PROXY=1` so request limits use the visitor IP behind Railway's proxy. Use Railway's private/internal MySQL URL where available. Set `DB_SSL=true` only if the selected database connection requires TLS and provides a trusted certificate.
4. Create the tables in the selected MySQL database by importing `schema.sql`. Use a MySQL client connected to the database in `DATABASE_URL`; do not share the connection URL.
5. Deploy the API service and check `https://<your-api-domain>/health`. It must return HTTP 200 before connecting the public site.
6. In the repository-root `index.html`, set the `api-base-url` meta tag to the API's HTTPS origin (for example `https://your-api-domain.up.railway.app`) and publish the site again. Do not put database passwords or JWT secrets in the website.

The GitHub Pages site only supports HTTPS APIs. Configure `CORS_ORIGINS` with the exact site origin, not a wildcard.

## Data and payment notes

- MySQL stores owner accounts and password hashes, public property details, and booking contact details. The tenant's name, email, and phone are visible only to the owner of the selected listing through the authenticated owner-bookings endpoint.
- When upgrading an existing database created before renter accounts were added, run `migrations/001_tenant_accounts.sql` once before deploying the updated API.
- When upgrading an existing database created before owner map links and photo uploads were added, run `migrations/002_listing_photos_and_maps.sql` once before deploying the updated API.
- A listing's full address, owner-provided Google Maps link, room photo, and optional washroom photo are public by design. Owners should only publish information and photos they are comfortable showing publicly. Uploaded images are stored in MySQL.
- The current static site does not share browser-local listings. Listings and booking requests become shared only after the API URL is configured and the API/database are deployed.
- No online payment provider is connected. Do not ask tenants to enter card details on this site; integrate a hosted payment gateway and verify payments on the server before accepting money.
