const express = require('express');
const Carts = require('../models/Carts');
const router = express.Router();

const cartController = require('../controllers/cartControllers');

const verifyToken = require('../Middleware/verifyToken');
const verifyAdmin = require('../Middleware/verifyAdmin');

router.get('/',verifyToken, (req, res) => {
    cartController.getCartByEmail(req, res)
});
// Ajouter un panier
router.post('/', cartController.addToCarts);

// Supprimer un panier
router.delete('/:id', cartController.deleteCart)

// Met à jour la quantité du panier
router.put('/:id', cartController.updateCart);

// Récupère un seul article de panier
router.get('/:id', cartController.getSingleCart);

module.exports = router;