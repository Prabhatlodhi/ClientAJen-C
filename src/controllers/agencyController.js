const Agency = require('../models/Agency');
const Client = require('../models/Client');

 
// API 1: Create agency with multiple clients in single request
const createAgencyWithClient = async (req, res) => {
  try {
    const { agency, clients } = req.body;

    // Validate clients array
    if (!clients || !Array.isArray(clients) || clients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Clients array is required and must contain at least one client'
      });
    }

    // Check if agency already exists
    const existingAgency = await Agency.findOne({ agencyId: agency.agencyId });
    if (existingAgency) {
      return res.status(400).json({
        success: false,
        message: 'Agency with this ID already exists'
      });
    }

    // Check if any client IDs already exist
    const clientIds = clients.map(client => client.clientId);
    const existingClients = await Client.find({ clientId: { $in: clientIds } });
    if (existingClients.length > 0) {
      const duplicateIds = existingClients.map(client => client.clientId);
      return res.status(400).json({
        success: false,
        message: `Client IDs already exist: ${duplicateIds.join(', ')}`
      });
    }

    // Check for duplicate client IDs within the request
    const uniqueClientIds = new Set(clientIds);
    if (uniqueClientIds.size !== clientIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate client IDs found in request'
      });
    }

    // Create agency first
    const newAgency = new Agency(agency);
    await newAgency.save();

    // Create all clients with agency reference
    const clientsData = clients.map(client => ({
      ...client,
      agencyId: agency.agencyId
    }));

    const newClients = await Client.insertMany(clientsData);

    // Calculate summary
    const totalBusiness = newClients.reduce((sum, client) => sum + client.totalBill, 0);

    res.status(201).json({
      success: true,
      message: `Agency and ${newClients.length} clients created successfully`,
      data: {
        agency: newAgency,
        clients: newClients,
        summary: {
          totalClients: newClients.length,
          totalBusinessValue: totalBusiness,
          averageClientValue: Math.round(totalBusiness / newClients.length)
        }
      }
    });
  } catch (error) {
    // Rollback agency if clients failed
    if (req.body.agency?.agencyId) {
      try {
        await Agency.deleteOne({ agencyId: req.body.agency.agencyId });
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create agency and clients',
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