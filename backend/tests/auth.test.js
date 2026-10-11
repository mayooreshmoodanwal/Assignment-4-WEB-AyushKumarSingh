require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

const testUser = {
  name: 'Auth Test User',
  email: 'authtest@example.com',
  password: 'Password123!',
};

beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/empdb_test';
  await mongoose.connect(uri);
  await User.deleteMany({ email: testUser.email });
});

afterAll(async () => {
  await User.deleteMany({ email: testUser.email });
  await mongoose.disconnect();
});

describe('Authentication API', () => {
  let token;

  it('registers a new user successfully with user role', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('user');
    expect(res.body.user.password).toBeUndefined();
  });

  it('rejects duplicate email registration', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(409);
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('rejects login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'WrongPassword!',
    });
    expect(res.statusCode).toBe(401);
  });

  it('returns current user with valid token on GET /api/auth/me', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('rejects request to /api/auth/me without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});
