const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// Route POST pour les messages de contact
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
  }

  try {
    const newMessage = new ContactMessage({ name, email, subject, message });
    await newMessage.save();
    res.status(200).json({ success: true, message: 'Message envoyé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du message:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du message.' });
  }
});


// Route GET pour récupérer les sujets des messages mis dans la base de données
router.get('/subjects', (req, res) => {
  const subjects = ContactMessage.schema.path('subject').enumValues;
  res.status(200).json({ success: true, subjects });
});

// Route GET pour obtenir tous les messages de contact
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find();
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des messages.' });
  }
});

// Route DELETE pour supprimer un message de contact
router.delete('/:id', async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Message supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression du message.' });
  }
});

// Route POST pour répondre à un message de contact
router.post('/reply/:id', async (req, res) => {
  const { reply } = req.body;

  if (!reply) {
    return res.status(400).json({ success: false, message: 'La réponse ne peut pas être vide.' });
  }

  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message non trouvé.' });
    }

    res.status(200).json({ success: true, message: 'Réponse envoyée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la réponse au message:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la réponse au message.' });
  }
});

module.exports = router;







