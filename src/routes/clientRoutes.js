const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { updateClient, getClient, getAllClients } = require('../controllers/clientController');

const router = express.Router();

const updateClientValidation = [
  body('name').optional().notEmpty().trim().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phoneNumber').optional().notEmpty().trim().withMessage('Phone number cannot be empty'),
  body('totalBill').optional().isNumeric().withMessage('Total bill must be a number'),
  body('agencyId').optional().notEmpty().trim().withMessage('Agency ID cannot be empty'),
];

// API 2: Update client details
router.put('/:clientId', auth, updateClientValidation, validateRequest, updateClient);

// Additional routes for CRUD operations
router.get('/:clientId', auth, getClient);
router.get('/', auth, getAllClients);

module.exports = router;