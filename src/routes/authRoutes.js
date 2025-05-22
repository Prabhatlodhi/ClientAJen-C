const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validation');
const { register, login } = require('../controllers/authController');

const router = express.Router();

const registerValidation = [
  body('username').notEmpty().trim().withMessage('Username is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);

module.exports = router;