const Agency = require('../models/Agency');
const Client = require('../models/Client');

// API 1: Create agency and client in single request
const createAgencyWithClient = async (req, res) => {
  try {
    const { agency, client } = req.body;

    // Check if agency already exists
    const existingAgency = await Agency.findOne({ agencyId: agency.agencyId });
    if (existingAgency) {
      return res.status(400).json({
        success: false,
        message: 'Agency with this ID already exists'
      });
    }

    // Check if client already exists
    const existingClient = await Client.findOne({ clientId: client.clientId });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Client with this ID already exists'
      });
    }

    // Create agency
    const newAgency = new Agency(agency);
    await newAgency.save();

    // Create client with agency reference
    const newClient = new Client({
      ...client,
      agencyId: agency.agencyId
    });
    await newClient.save();

    res.status(201).json({
      success: true,
      message: 'Agency and client created successfully',
      data: {
        agency: newAgency,
        client: newClient
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create agency and client',
      error: error.message
    });
  }
};

// API 3: Get agency with top client(s) having maximum total bill
const getTopClientAgencies = async (req, res) => {
  try {
    const topClients = await Client.aggregate([
      {
        $group: {
          _id: '$agencyId',
          maxBill: { $max: '$totalBill' }
        }
      },
      {
        $lookup: {
          from: 'clients',
          let: { agencyId: '$_id', maxBill: '$maxBill' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$agencyId', '$$agencyId'] },
                    { $eq: ['$totalBill', '$$maxBill'] }
                  ]
                }
              }
            }
          ],
          as: 'topClients'
        }
      },
      {
        $lookup: {
          from: 'agencies',
          localField: '_id',
          foreignField: 'agencyId',
          as: 'agency'
        }
      },
      {
        $unwind: '$agency'
      },
      {
        $unwind: '$topClients'
      },
      {
        $project: {
          _id: 0,
          AgencyName: '$agency.name',
          ClientName: '$topClients.name',
          TotalBill: '$topClients.totalBill'
        }
      },
      {
        $sort: { TotalBill: -1 }
      }
    ]);

    res.json({
      success: true,
      message: 'Top clients retrieved successfully',
      data: topClients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve top clients',
      error: error.message
    });
  }
};

module.exports = {
  createAgencyWithClient,
  getTopClientAgencies,
};