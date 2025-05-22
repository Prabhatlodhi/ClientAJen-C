const express = require('express');
const auth = require('../middleware/auth');
const { validateRequest, updateClientValidation } = require('../middleware/validation');
const { updateClient, getClient, getAllClients } = require('../controllers/clientController');

const router = express.Router();

// API 2: Update client details
router.put('/:clientId', auth, updateClientValidation, validateRequest, updateClient);

// Additional CRUD operations
router.get('/:clientId', auth, getClient);
router.get('/', auth, getAllClients);

module.exports = router;