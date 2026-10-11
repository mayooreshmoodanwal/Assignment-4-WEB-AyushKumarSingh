const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');
const { registerRules, loginRules } = require('../validators');
const { handleValidation } = require('../middleware/validate');

router.post('/register', registerRules, handleValidation, register);
router.post('/login', loginRules, handleValidation, login);
router.get('/me', authenticateUser, getMe);

module.exports = router;
