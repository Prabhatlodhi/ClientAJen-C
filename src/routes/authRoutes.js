const express = require('express');
const { validateRequest, registerValidation, loginValidation } = require('../middleware/validation');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);

module.exports = router;