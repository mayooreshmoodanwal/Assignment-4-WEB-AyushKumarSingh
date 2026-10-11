require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Employee = require('../src/models/Employee');

let adminToken;
let userToken;
let testEmployeeId;

const adminCreds = {
  name: 'Admin CRUD Test',
  email: 'admin.crud@company.com',
  password: 'AdminPassword123!',
};

const userCreds = {
  name: 'User CRUD Test',
  email: 'user.crud@company.com',
  password: 'UserPassword123!',
};

beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/empdb_test';
  await mongoose.connect(uri);
  await User.deleteMany({ email: { $in: [adminCreds.email, userCreds.email] } });
  await Employee.deleteMany({ email: 'emp.crud.test@company.com' });

  await User.create({ ...adminCreds, role: 'admin' });
  await User.create({ ...userCreds, role: 'user' });

  const adminRes = await request(app).post('/api/auth/login').send({
    email: adminCreds.email,
    password: adminCreds.password,
  });
  adminToken = adminRes.body.token;

  const userRes = await request(app).post('/api/auth/login').send({
    email: userCreds.email,
    password: userCreds.password,
  });
  userToken = userRes.body.token;
});

afterAll(async () => {
  await User.deleteMany({ email: { $in: [adminCreds.email, userCreds.email] } });
  if (testEmployeeId) await Employee.findByIdAndDelete(testEmployeeId);
  await mongoose.disconnect();
});

describe('Employee CRUD Endpoints', () => {
  it('admin can create employee with salary', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'CRUD Employee',
        email: 'emp.crud.test@company.com',
        department: 'Operations',
        designation: 'Operations Lead',
        salary: 75000,
        joiningDate: '2023-05-10',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.employee._id).toBeDefined();
    testEmployeeId = res.body.employee._id;
  });

  it('user cannot create employee', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Forbidden Employee',
        email: 'forbidden@company.com',
        department: 'Sales',
        designation: 'Sales Rep',
        salary: 40000,
        joiningDate: '2023-01-01',
      });
    expect(res.statusCode).toBe(403);
  });

  it('admin can list employees with salary visible', async () => {
    const res = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    const found = res.body.employees.find((e) => e._id === testEmployeeId);
    expect(found).toBeDefined();
    expect(found.salary).toBe(75000);
  });

  it('user can list employees but salary is excluded', async () => {
    const res = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    const found = res.body.employees.find((e) => e._id === testEmployeeId);
    expect(found).toBeDefined();
    expect(found.salary).toBeUndefined();
  });

  it('admin can update employee', async () => {
    const res = await request(app)
      .put(`/api/employees/${testEmployeeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ designation: 'Senior Operations Lead' });
    expect(res.statusCode).toBe(200);
    expect(res.body.employee.designation).toBe('Senior Operations Lead');
  });

  it('user cannot update employee', async () => {
    const res = await request(app)
      .put(`/api/employees/${testEmployeeId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ designation: 'Hacker' });
    expect(res.statusCode).toBe(403);
  });

  it('returns 400 for invalid employee ID', async () => {
    const res = await request(app)
      .get('/api/employees/invalid-object-id')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(400);
  });

  it('returns 404 for non-existent employee ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/employees/${fakeId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(404);
  });

  it('user cannot delete employee', async () => {
    const res = await request(app)
      .delete(`/api/employees/${testEmployeeId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('admin can delete employee', async () => {
    const res = await request(app)
      .delete(`/api/employees/${testEmployeeId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    testEmployeeId = null;
  });
});
