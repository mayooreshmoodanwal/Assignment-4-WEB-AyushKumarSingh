const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getStats,
} = require('../controllers/employeeController');
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const { employeeRules, employeeUpdateRules } = require('../validators');
const { handleValidation } = require('../middleware/validate');

router.get('/stats', authenticateUser, requireAdmin, getStats);

router.get('/', authenticateUser, getEmployees);
router.get('/:id', authenticateUser, getEmployee);
router.post('/', authenticateUser, requireAdmin, employeeRules, handleValidation, createEmployee);
router.put('/:id', authenticateUser, requireAdmin, employeeUpdateRules, handleValidation, updateEmployee);
router.delete('/:id', authenticateUser, requireAdmin, deleteEmployee);

module.exports = router;
