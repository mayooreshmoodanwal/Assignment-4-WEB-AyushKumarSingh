const { body, param, query } = require('express-validator');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail({ gmail_remove_dots: false }),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail({ gmail_remove_dots: false }),
  body('password').notEmpty().withMessage('Password is required'),
];

const employeeRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail({ gmail_remove_dots: false }),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  body('salary').isFloat({ min: 0 }).withMessage('Salary must be a non-negative number'),
  body('joiningDate').isISO8601().withMessage('Joining date must be a valid date'),
];

const employeeUpdateRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().trim().isEmail().withMessage('Valid email is required').normalizeEmail({ gmail_remove_dots: false }),
  body('department').optional().trim().notEmpty().withMessage('Department cannot be empty'),
  body('designation').optional().trim().notEmpty().withMessage('Designation cannot be empty'),
  body('salary').optional().isFloat({ min: 0 }).withMessage('Salary must be a non-negative number'),
  body('joiningDate').optional().isISO8601().withMessage('Joining date must be a valid date'),
];

const idParamRule = [
  param('id').isMongoId().withMessage('Invalid employee ID'),
];

module.exports = { registerRules, loginRules, employeeRules, employeeUpdateRules, idParamRule };
