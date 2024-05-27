const express = require('express');
const router = express.Router();
// Import your middleware
const User = require('../models/User');
const Recette = require('../models/Recette');
const Payment = require('../models/Payments');
// middleware
const verifyToken = require('../Middleware/verifyToken');
const verifyAdmin = require('../Middleware/verifyAdmin');

router.get('/', async (req, res) => {
  try {
    const result = await Payment.aggregate([
        {
          $unwind: '$menuItems'
        },
        {
          $lookup: {
            from: 'menus',
            localField: 'menuItems',
            foreignField: '_id',
            as: 'menuItemDetails'
          }
        },
        {
          $unwind: '$menuItemDetails'
        },
        {
          $group: {
            _id: '$menuItemDetails.category',
            quantity: { $sum: '$quantity' },
            revenue: { $sum: '$price' }
          }
        },
        {
          $project: {
            _id: 0,
            category: '$_id',
            quantity: '$quantity',
            revenue: '$revenue'
          }
        }
      ]);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;