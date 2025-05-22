const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { createAgencyWithClient, getTopClientAgencies } = require('../controllers/agencyController');

const router = express.Router();

const createAgencyClientValidation = [
  // Agency validation
  body('agency.agencyId').notEmpty().trim().withMessage('Agency ID is required'),
  body('agency.name').notEmpty().trim().withMessage('Agency name is required'),
  body('agency.address1').notEmpty().trim().withMessage('Agency address1 is required'),
  body('agency.state').notEmpty().trim().withMessage('Agency state is required'),
  body('agency.city').notEmpty().trim().withMessage('Agency city is required'),
  body('agency.phoneNumber').notEmpty().trim().withMessage('Agency phone number is required'),
  
  // Client validation
  body('client.clientId').notEmpty().trim().withMessage('Client ID is required'),
  body('client.name').notEmpty().trim().withMessage('Client name is required'),
  body('client.email').isEmail().normalizeEmail().withMessage('Valid client email is required'),
  body('client.phoneNumber').notEmpty().trim().withMessage('Client phone number is required'),
  body('client.totalBill').isNumeric().withMessage('Client total bill must be a number'),
];

// API 1: Create agency and client in single request
router.post('/create-with-client', auth, createAgencyClientValidation, validateRequest, createAgencyWithClient);

// API 3: Get top clients
router.get('/top-clients', auth, getTopClientAgencies);

module.exports = router;