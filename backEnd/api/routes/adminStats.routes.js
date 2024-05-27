const express = require('express');
const router = express.Router();
// Import your middleware
const User = require('../models/User');
const Recette = require('../models/Recette');
const Payment = require('../models/Payments'); 

// middleware
const verifyToken = require('../Middleware/verifyToken')
const verifyAdmin = require('../Middleware/verifyAdmin')

router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const recetteItems = await Recette.countDocuments();
    const orders = await Payment.countDocuments();

    const result = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: '$price'
          }
        }
      }
    ]);

    const revenue = result.length > 0 ? result[0].totalRevenue : 0;

    res.json({
      users,
      recetteItems,
      orders,
      revenue
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;