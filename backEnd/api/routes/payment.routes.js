const express = require('express');
const Payment = require('../models/Payments');
const Cart = require('../models/Carts');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const verifyToken = require('../Middleware/verifyToken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Assurez-vous que votre clé Stripe est définie dans vos variables d'environnement

const router = express.Router();

// Créer une intention de paiement avec Stripe
router.post('/create-payment-intent', async (req, res) => {
    const { price } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price * 100, // Stripe utilise des centimes
            currency: 'eur',
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Erreur lors de la création de l\'intention de paiement:', error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'intention de paiement', error });
    }
});

// Créer une transaction PayPal (exemple)
router.post('/create-paypal-transaction', async (req, res) => {
    const { price } = req.body;

    try {
        // Logique pour créer la transaction PayPal
        res.status(200).json({ message: 'Transaction PayPal créée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la création de la transaction PayPal:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la transaction PayPal', error });
    }
});

// Enregistrer un paiement et supprimer les articles du panier
router.post('/', async (req, res) => {
    const payment = req.body;

    try {
        const paymentResult = await Payment.create(payment);
        const cartIds = payment.cartItems.map(id => new ObjectId(id));
        const deleteResult = await Cart.deleteMany({ _id: { $in: cartIds } });
        res.status(200).json({ paymentResult, deleteResult });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du paiement:', error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement du paiement', error });
    }
});

// Récupérer les paiements pour un utilisateur
router.get('/', verifyToken, async (req, res) => {
    const email = req.query.email;

    try {
        const decodedEmail = req.decoded.email;
        if (email !== decodedEmail) {
            return res.status(403).json({ message: "Accès interdit!" });
        }

        const result = await Payment.find({ email }).sort({ createdAt: -1 }).exec();
        res.status(200).json(result);
    } catch (error) {
        console.error('Erreur lors de la récupération des paiements:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des paiements', error });
    }
});

// Récupérer tous les paiements
router.get('/all', async (req, res) => {
    try {
        const payments = await Payment.find({}).sort({ createdAt: -1 });
        res.status(200).json(payments);
    } catch (error) {
        console.error('Erreur lors de la récupération des paiements:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des paiements', error });
    }
});

// Confirmer le statut de paiement
router.patch('/:id', verifyToken, async (req, res) => {
    const payId = req.params.id;
    const { status } = req.body;

    try {
        const updatedStatus = await Payment.findByIdAndUpdate(
            payId,
            { status: 'confirmed' },
            { new: true, runValidators: true }
        );

        if (!updatedStatus) {
            return res.status(404).json({ message: 'ID de paiement non trouvé' });
        }

        res.status(200).json(updatedStatus);
    } catch (error) {
        console.error('Erreur lors de la confirmation du statut de paiement:', error);
        res.status(500).json({ message: 'Erreur lors de la confirmation du statut de paiement', error });
    }
});

module.exports = router;
