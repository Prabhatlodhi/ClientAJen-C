const express = require('express');
const auth = require('../middleware/auth');
const { validateRequest, createAgencyWithClientsValidation } = require('../middleware/validation');
const { createAgencyWithClient, getTopClientAgencies } = require('../controllers/agencyController');

const router = express.Router();

// API 1: Create agency with multiple clients
router.post('/create-with-client', auth, createAgencyWithClientsValidation, validateRequest, createAgencyWithClient);

// API 3: Get top clients
router.get('/top-clients', auth, getTopClientAgencies);

module.exports = router;