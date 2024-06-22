const express = require("express");
const router = express.Router();
// const verifyToken = require("../Middleware/verifyToken");
const authMiddleware = require("../Middleware/authMiddleware");
const {
  getAllRecettes,
  getRecetteById,
  createRecette,
  updateRecette,
  deleteRecette,
  likeRecette,
  unlikeRecette,
  getComments,
  addOrUpdateComment,
  getRecettesByCategory,
  getLastRecette,
  deleteComment,
} = require("../controllers/recettesControllers");
const upload = require('../Middleware/upload');
const Recette = require("../models/Recette");



// Route pour obtenir toutes les recettes
router.get("/", getAllRecettes);
router.get('/last', getLastRecette);

// Routes pour les commentaires
router.post('/:recetteId/comments', authMiddleware, addOrUpdateComment);
router.get('/:recetteId/comments', getComments);
router.delete('/:recetteId/comments/:commentId', authMiddleware, deleteComment);

// Route pour obtenir les recettes par catégorie
router.get("/category", getRecettesByCategory);

// Route pour obtenir une recette par ID
router.get("/:id", getRecetteById);

// Route pour créer une recette avec upload d'image
router.post('/', upload.single('image'), createRecette);


// Route pour supprimer et modifier une recette
router.delete("/:id/delete", deleteRecette);
router.patch('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (req.file) {
      updateData.image = req.file.path;
    }
    const updatedRecette = await Recette.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedRecette) {
      return res.status(404).send('Recette not found');
    }
    
    res.json(updatedRecette);
  } catch (error) {
    console.error('Error updating recette:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route pour approuver une recette
router.patch('/:recetteId/approve', async (req, res) => {
  try {
    const recette = await Recette.findById(req.params.recetteId);
    if (!recette) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    recette.status = 'approved';
    await recette.save();
    res.status(200).json(recette);
  } catch (error) {
    res.status(500).json({ message: 'Error approving recipe', error });
  }
});

// Route pour liker une recette
router.patch("/:id/likes", likeRecette);

// Route pour modifier une recette
router.patch("/update-recette/:id", updateRecette)

// Route pour unliker une recette
router.patch("/:id/unlikes", unlikeRecette);

module.exports = router;