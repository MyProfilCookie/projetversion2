const express = require('express');
const router = express.Router();
const Payment = require('../models/Payments');
const verifyToken = require('../Middleware/verifyToken');


// Route pour l'affichage des statistiques des commandes par catégorie
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await Payment.aggregate([
      {
        $unwind: '$recetteItems' // on groupe par recette
      },
      {
        $lookup: { // on joint les recettes
          from: 'recettes', // l'attribut qui contient les recettes
          localField: 'recetteItems', // le champ qui contient l'ID de la recette
          foreignField: '_id', // le champ qui contient l'ID de la recette dans la collection recettes
          as: 'recetteItemDetails' // le nom de la variable qui contient les informations de la recette
        }
      },
      {
        $unwind: '$recetteItemDetails'
      },
      {
        $group: {
          _id: '$recetteItemDetails.category', // groupe par catégorie
          quantity: { $sum: 1 },  // compte la quantité de chaque produit par catégorie
          revenue: { $sum: '$price' } // compte le montant de chaque produit par catégorie
        }
      },
      {
        $project: { // on renomme les champs
          _id: 0,
          category: '$_id',
          quantity: 1,
          revenue: 1
        }
      }
    ]);

    res.json(result);
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
