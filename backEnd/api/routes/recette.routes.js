const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getAllRecettes,
  getRecetteById,
  createRecette,
  updateRecette,
  deleteRecette,
  likeRecette,
  unlikeRecette,
  getCommentaire,
  postCommentaire,
  getRecettesByCategory,
  getLastRecette,
} = require("../controllers/recettesControllers");
const upload = require('../Middleware/upload');

const Recette = require("../models/Recette");
// Route pour obtenir toutes les recettes
router.get("/", getAllRecettes);
router.get('/last', getLastRecette);

// Route pour obtenir les recettes par catégorie
router.get("/category", getRecettesByCategory);

// Route pour obtenir une recette par ID
router.get("/:id", getRecetteById);

// Route pour créer une recette avec upload d'image
router.post('/', upload.single('image'), createRecette);

// Route pour mettre à jour une recette avec upload d'image
// router.patch("/:id", upload.single('image'), updateRecette);
router.patch('/:id', upload.single('image'), async (req, res) => {
  const recetteId = req.params.id;
  const { titre, description, ingredients, instructions, temps_preparation, temps_cuisson, difficulte, category } = req.body;

  try {
    // Find the existing recette
    let recette = await Recette.findById(recetteId);

    if (!recette) {
      return res.status(404).json({ message: 'Recette not found' });
    }

    // Update recette fields
    recette.titre = titre || recette.titre;
    recette.description = description || recette.description;
    recette.ingredients = ingredients ? ingredients.split(',') : recette.ingredients;
    recette.instructions = instructions ? instructions.split(',') : recette.instructions;
    recette.temps_preparation = temps_preparation || recette.temps_preparation;
    recette.temps_cuisson = temps_cuisson || recette.temps_cuisson;
    recette.difficulte = difficulte || recette.difficulte;
    recette.category = category || recette.category;

    // Check if a new image is provided
    if (req.file) {
      const imageBuffer = req.file.buffer;
      const imageHash = someHashFunction(imageBuffer); // Replace with actual hash function
      recette.image = imageHash;
      // Save the image buffer to your storage solution (file system, cloud storage, etc.)
      await saveImage(imageBuffer, imageHash); // Replace with actual save function
    }

    // Update the updatedAt field
    recette.updatedAt = new Date();

    // Save the updated recette
    await recette.save();

    res.json({ message: 'Recette updated successfully', updatedRecette: recette });
  } catch (error) {
    console.error('Error updating recette:', error);
    res.status(500).json({ message: 'Error updating recette', error: error.message });
  }
});


// Route pour supprimer une recette
router.delete("/:id/delete", deleteRecette);

// Route pour liker une recette
router.patch("/:id/likes", likeRecette);

/*route de mise à jour*/
router.patch("/update-recette/:id", updateRecette)

// Route pour unliker une recette
router.patch("/:id/unlikes", unlikeRecette);

// Route pour obtenir les commentaires d'une recette
router.get("/:id/commentaires", getCommentaire);

// Route pour ajouter un commentaire à une recette
router.post("/commentaires/add", postCommentaire);

module.exports = router;