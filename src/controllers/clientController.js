const Client = require('../models/Client');
const Agency = require('../models/Agency');

 
const updateClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const updateData = req.body;

     
    if (updateData.agencyId) {
      const agency = await Agency.findOne({ agencyId: updateData.agencyId });
      if (!agency) {
        return res.status(404).json({
          success: false,
          message: 'Agency not found'
        });
      }
    }

    const updatedClient = await Client.findOneAndUpdate(
      { clientId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      message: 'Client updated successfully',
      data: updatedClient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update client',
      error: error.message
    });
  }
};

const getClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findOne({ clientId });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve client',
      error: error.message
    });
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve clients',
      error: error.message
    });
  }
};

module.exports = {
  updateClient,
  getClient,
  getAllClients
};