require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Employee = require('../src/models/Employee');

let adminToken;
let userToken;
let employeeId;

const adminCredentials = {
  name: 'Test Admin',
  email: 'testadmin@test.com',
  password: 'AdminPass123!',
};

const userCredentials = {
  name: 'Test User',
  email: 'testuser@test.com',
  password: 'UserPass123!',
};

beforeAll(async () => {
  const testUri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/empdb_test';
  await mongoose.connect(testUri);
  await User.deleteMany({ email: { $in: [adminCredentials.email, userCredentials.email] } });
  await Employee.deleteMany({ email: 'emp.test@company.com' });

  const admin = await User.create({ ...adminCredentials, role: 'admin' });
  await User.create({ ...userCredentials, role: 'user' });

  const adminRes = await request(app).post('/api/auth/login').send({
    email: adminCredentials.email,
    password: adminCredentials.password,
  });
  adminToken = adminRes.body.token;

  const userRes = await request(app).post('/api/auth/login').send({
    email: userCredentials.email,
    password: userCredentials.password,
  });
  userToken = userRes.body.token;
});

afterAll(async () => {
  await User.deleteMany({ email: { $in: [adminCredentials.email, userCredentials.email] } });
  if (employeeId) await Employee.findByIdAndDelete(employeeId);
  await mongoose.disconnect();
});

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /api/auth/register', () => {
  it('registers a new user', async () => {
    await User.deleteMany({ email: 'newregister@test.com' });
    const res = await request(app).post('/api/auth/register').send({
      name: 'New User',
      email: 'newregister@test.com',
      password: 'NewPass123!',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('user');
    await User.deleteOne({ email: 'newregister@test.com' });
  });

  it('rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: userCredentials.email,
      password: 'AnyPass123!',
    });
    expect(res.statusCode).toBe(409);
  });

  it('rejects invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Bad',
      email: 'notanemail',
      password: 'Pass1234!',
    });
    expect(res.statusCode).toBe(400);
  });

  it('rejects short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Short',
      email: 'short@test.com',
      password: '123',
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: userCredentials.email,
      password: userCredentials.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: userCredentials.email,
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(401);
  });

  it('rejects non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@nowhere.com',
      password: 'SomePass123!',
    });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns current user when authenticated', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(userCredentials.email);
    expect(res.body.user.password).toBeUndefined();
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});

describe('POST /api/employees (Admin only)', () => {
  it('admin can create employee', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'John Doe',
        email: 'emp.test@company.com',
        department: 'Engineering',
        designation: 'Developer',
        salary: 75000,
        joiningDate: '2024-01-15',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.employee._id).toBeDefined();
    employeeId = res.body.employee._id;
  });

  it('user cannot create employee', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Jane Doe',
        email: 'jane@company.com',
        department: 'HR',
        designation: 'Manager',
        salary: 60000,
        joiningDate: '2024-02-01',
      });
    expect(res.statusCode).toBe(403);
  });

  it('rejects invalid salary', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Bad Salary',
        email: 'bad@company.com',
        department: 'Eng',
        designation: 'Dev',
        salary: -100,
        joiningDate: '2024-01-01',
      });
    expect(res.statusCode).toBe(400);
  });

  it('rejects missing required fields', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Incomplete' });
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/employees', () => {
  it('admin can list employees with salary', async () => {
    const res = await request(app).get('/api/employees').set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.employees).toBeDefined();
    expect(res.body.pagination).toBeDefined();
    const emp = res.body.employees.find((e) => e.email === 'emp.test@company.com');
    expect(emp.salary).toBeDefined();
  });

  it('user can list employees without salary', async () => {
    const res = await request(app).get('/api/employees').set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    const emp = res.body.employees.find((e) => e.email === 'emp.test@company.com');
    if (emp) expect(emp.salary).toBeUndefined();
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.statusCode).toBe(401);
  });
});

describe('PUT /api/employees/:id (Admin only)', () => {
  it('admin can update employee', async () => {
    const res = await request(app)
      .put(`/api/employees/${employeeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ designation: 'Senior Developer' });
    expect(res.statusCode).toBe(200);
    expect(res.body.employee.designation).toBe('Senior Developer');
  });

  it('user cannot update employee', async () => {
    const res = await request(app)
      .put(`/api/employees/${employeeId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ designation: 'Hacker' });
    expect(res.statusCode).toBe(403);
  });

  it('returns 404 for non-existent employee', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/employees/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ designation: 'Ghost' });
    expect(res.statusCode).toBe(404);
  });

  it('returns 400 for invalid ObjectId', async () => {
    const res = await request(app)
      .put('/api/employees/invalid-id')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ designation: 'Test' });
    expect(res.statusCode).toBe(400);
  });
});

describe('DELETE /api/employees/:id (Admin only)', () => {
  it('user cannot delete employee', async () => {
    const res = await request(app)
      .delete(`/api/employees/${employeeId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('admin can delete employee', async () => {
    const res = await request(app)
      .delete(`/api/employees/${employeeId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    employeeId = null;
  });
});
