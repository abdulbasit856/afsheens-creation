const express = require('express');
const { body } = require('express-validator');
const { login, setupAdmin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const setupValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

router.post('/login', loginValidation, login);
router.post('/setup', setupValidation, setupAdmin);
router.get('/me', protect, getMe);

module.exports = router;