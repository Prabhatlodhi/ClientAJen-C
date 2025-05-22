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
  agencyValidation,
  clientValidation
};