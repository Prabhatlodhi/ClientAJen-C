// src/middleware/validation.js
const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// ===== AUTH VALIDATIONS =====
const registerValidation = [
  body('username')
    .notEmpty()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username is required and must be 3-30 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// ===== AGENCY WITH MULTIPLE CLIENTS VALIDATION =====
const createAgencyWithClientsValidation = [
  // Agency nested object validation
  body('agency.agencyId')
    .notEmpty()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Agency ID is required (2-20 characters)'),
  body('agency.name')
    .notEmpty()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Agency name is required (2-100 characters)'),
  body('agency.address1')
    .notEmpty()
    .trim()
    .withMessage('Agency address1 is required'),
  body('agency.address2')
    .optional()
    .trim(),
  body('agency.state')
    .notEmpty()
    .trim()
    .withMessage('Agency state is required'),
  body('agency.city')
    .notEmpty()
    .trim()
    .withMessage('Agency city is required'),
  body('agency.phoneNumber')
    .notEmpty()
    .trim()
    .isMobilePhone('any')
    .withMessage('Valid agency phone number is required'),
  
  // Clients array validation
  body('clients')
    .isArray({ min: 1 })
    .withMessage('Clients must be an array with at least one client'),
  
  // Individual client validation in array
  body('clients.*.clientId')
    .notEmpty()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Client ID is required (2-20 characters)'),
  body('clients.*.name')
    .notEmpty()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Client name is required (2-100 characters)'),
  body('clients.*.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid client email is required'),
  body('clients.*.phoneNumber')
    .notEmpty()
    .trim()
    .isMobilePhone('any')
    .withMessage('Valid client phone number is required'),
  body('clients.*.totalBill')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Client total bill must be a positive number'),
];

// ===== CLIENT UPDATE VALIDATION =====
const updateClientValidation = [
  body('name')
    .optional()
    .notEmpty()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters if provided'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required if provided'),
  body('phoneNumber')
    .optional()
    .notEmpty()
    .trim()
    .isMobilePhone('any')
    .withMessage('Valid phone number is required if provided'),
  body('totalBill')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Total bill must be a positive number if provided'),
  body('agencyId')
    .optional()
    .notEmpty()
    .trim()
    .withMessage('Agency ID cannot be empty if provided'),
];

// ===== BASIC VALIDATIONS (For other use cases) =====
const agencyValidation = [
  body('agencyId').notEmpty().trim().withMessage('Agency ID is required'),
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('address1').notEmpty().trim().withMessage('Address1 is required'),
  body('state').notEmpty().trim().withMessage('State is required'),
  body('city').notEmpty().trim().withMessage('City is required'),
  body('phoneNumber').notEmpty().trim().withMessage('Phone number is required'),
];

const clientValidation = [
  body('clientId').notEmpty().trim().withMessage('Client ID is required'),
  body('agencyId').notEmpty().trim().withMessage('Agency ID is required'),
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phoneNumber').notEmpty().trim().withMessage('Phone number is required'),
  body('totalBill').isNumeric().withMessage('Total bill must be a number'),
];

module.exports = {
  validateRequest,
  
  // Auth validations
  registerValidation,
  loginValidation,
  
  // Agency validations
  createAgencyWithClientsValidation,
  agencyValidation,
  
  // Client validations
  updateClientValidation,
  clientValidation,
};