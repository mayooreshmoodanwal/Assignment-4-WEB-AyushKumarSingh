const mongoose = require('mongoose');
const Employee = require('../src/models/Employee');

describe('Employee Model Validation', () => {
  it('validates a valid employee object', () => {
    const employee = new Employee({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      department: 'Engineering',
      designation: 'Software Engineer',
      salary: 85000,
      joiningDate: new Date('2024-01-15'),
    });
    const err = employee.validateSync();
    expect(err).toBeUndefined();
  });

  it('rejects negative salary', () => {
    const employee = new Employee({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      department: 'Engineering',
      designation: 'Software Engineer',
      salary: -100,
      joiningDate: new Date('2024-01-15'),
    });
    const err = employee.validateSync();
    expect(err).toBeDefined();
    expect(err.errors.salary).toBeDefined();
  });

  it('rejects missing required fields', () => {
    const employee = new Employee({});
    const err = employee.validateSync();
    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.department).toBeDefined();
    expect(err.errors.designation).toBeDefined();
    expect(err.errors.salary).toBeDefined();
    expect(err.errors.joiningDate).toBeDefined();
  });
});
