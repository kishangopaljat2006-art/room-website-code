const assert = require('node:assert/strict');
const { test } = require('node:test');

process.env.JWT_SECRET = 'test-only-secret-with-at-least-32-characters';

const db = require('../db');
const auth = require('../auth');
const authController = require('../authController');
const bookingController = require('../bookingController');
const listingController = require('../listingController');

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    set() {
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test('owner registration hashes passwords and returns a signed owner token', async (t) => {
  const originalExecute = db.execute;
  let insertParameters;
  db.execute = async (sql, parameters) => {
    assert.match(sql, /INSERT INTO OwnerAccounts/);
    insertParameters = parameters;
    return [{ insertId: 8 }, []];
  };
  t.after(() => {
    db.execute = originalExecute;
  });

  const res = createResponse();
  await authController.registerOwner({
    body: {
      name: 'Property Owner',
      phone: '+919876543210',
      email: 'OWNER@example.com',
      password: 'test-owner-password',
    },
  }, res, (error) => {
    throw error;
  });

  assert.equal(res.statusCode, 201);
  assert.equal(insertParameters[1], 'owner@example.com');
  assert.match(insertParameters[3], /^scrypt\$/);
  assert.notEqual(insertParameters[3], 'test-owner-password');
  assert.deepEqual(auth.verifyAccessToken(res.body.data.token), { userId: 8, role: 'owner' });
  assert.equal(auth.verifyAccessToken(`${res.body.data.token}invalid`), null);
});

test('tenant registration hashes passwords and returns a signed tenant token', async (t) => {
  const originalExecute = db.execute;
  let insertParameters;
  db.execute = async (sql, parameters) => {
    assert.match(sql, /INSERT INTO TenantAccounts/);
    insertParameters = parameters;
    return [{ insertId: 19 }, []];
  };
  t.after(() => {
    db.execute = originalExecute;
  });

  const res = createResponse();
  await authController.registerTenant({
    body: {
      name: 'New Tenant',
      phone: '+919876543210',
      email: 'TENANT@example.com',
      password: 'test-tenant-password',
    },
  }, res, (error) => {
    throw error;
  });

  assert.equal(res.statusCode, 201);
  assert.equal(insertParameters[1], 'tenant@example.com');
  assert.match(insertParameters[3], /^scrypt\$/);
  assert.notEqual(insertParameters[3], 'test-tenant-password');
  assert.deepEqual(auth.verifyAccessToken(res.body.data.token), { userId: 19, role: 'tenant' });
});

test('tenant sign-in returns account details and a tenant token', async (t) => {
  const originalExecute = db.execute;
  const passwordHash = await auth.hashPassword('test-tenant-password');
  db.execute = async (sql, parameters) => {
    assert.match(sql, /FROM TenantAccounts WHERE Email = \? LIMIT 1/);
    assert.deepEqual(parameters, ['tenant@example.com']);
    return [[{
      UserID: 19,
      Name: 'Tenant Name',
      Email: 'tenant@example.com',
      Phone: '+919876543210',
      PasswordHash: passwordHash,
      Role: 'tenant',
    }], []];
  };
  t.after(() => {
    db.execute = originalExecute;
  });

  const res = createResponse();
  await authController.loginTenant({
    body: { email: 'TENANT@example.com', password: 'test-tenant-password' },
  }, res, (error) => {
    throw error;
  });

  assert.equal(res.statusCode, 200);
  assert.deepEqual(auth.verifyAccessToken(res.body.data.token), { userId: 19, role: 'tenant' });
  assert.equal(res.body.data.phone, '+919876543210');
});

test('listing creation saves public address and monthly rent to the shared database', async (t) => {
  const originalExecute = db.execute;
  const calls = [];
  db.execute = async (sql, parameters) => {
    calls.push({ sql, parameters });
    if (sql.includes('INSERT INTO RentalListings')) return [{ insertId: 33 }, []];
    return [[{
      ListingID: 33,
      Title: 'Sunny 1BHK',
      PropertyType: '1 BHK flat',
      City: 'Jaipur',
      Address: '12 Public Road',
      MonthlyRent: '15000.00',
      Bedrooms: 2,
      Description: 'Bright room',
      PhotoURL: null,
    }], []];
  };
  t.after(() => {
    db.execute = originalExecute;
  });

  const res = createResponse();
  await listingController.createListing({
    auth: { userId: 8 },
    body: {
      title: 'Sunny 1BHK',
      type: '1 BHK flat',
      location: 'Jaipur',
      address: '12 Public Road',
      price: '15000',
      beds: '2',
      description: 'Bright room',
      image: '',
    },
  }, res, (error) => {
    throw error;
  });

  assert.equal(res.statusCode, 201);
  assert.equal(calls[0].parameters[0], 8);
  assert.equal(calls[0].parameters[4], '12 Public Road');
  assert.equal(res.body.data.price, 15000);
});

test('booking saves the database rent snapshot instead of trusting browser price', async (t) => {
  const originalGetConnection = db.getConnection;
  const calls = [];
  let committed = false;
  let released = false;
  db.getConnection = async () => ({
    async beginTransaction() {},
    async execute(sql, parameters) {
      calls.push({ sql, parameters });
      if (sql.includes('SELECT TenantID')) {
        return [[{
          TenantID: 19,
          Name: 'Tenant',
          Email: 'tenant@example.com',
          Phone: '+919876543210',
        }], []];
      }
      if (sql.includes('SELECT ListingID')) {
        return [[{ ListingID: 33, MonthlyRent: '15000.00' }], []];
      }
      return [{ insertId: 71 }, []];
    },
    async commit() {
      committed = true;
    },
    async rollback() {
      assert.fail('A valid booking should not roll back.');
    },
    release() {
      released = true;
    },
  });
  t.after(() => {
    db.getConnection = originalGetConnection;
  });

  const res = createResponse();
  await bookingController.createBooking({
    auth: { userId: 19, role: 'tenant' },
    body: {
      listingId: '33',
      moveInDate: '2099-01-02',
    },
  }, res, (error) => {
    throw error;
  });

  assert.equal(res.statusCode, 201);
  assert.equal(calls[2].parameters[1], 19);
  assert.equal(calls[2].parameters[2], 'Tenant');
  assert.equal(calls[2].parameters[6], '15000.00');
  assert.equal(res.body.data.monthlyRent, 15000);
  assert.equal(res.body.data.bookingId, 71);
  assert.equal(committed, true);
  assert.equal(released, true);
});
