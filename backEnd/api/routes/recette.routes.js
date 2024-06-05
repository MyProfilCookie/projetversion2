const express = require("express");
const router = express.Router();
const multer = require("multer");
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
  getRecettesByCategory
} = require("../controllers/recettesControllers");

// Configuration de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const recetteId = req.params.id || 'new';
    const ext = file.originalname.split('.').pop(); 
    cb(null, `${recetteId}-${Date.now()}.${ext}`);
  }
});

const upload = multer({ storage: storage });

// Route pour obtenir toutes les recettes
router.get("/", getAllRecettes);

// Route pour obtenir les recettes par catégorie
router.get("/category", getRecettesByCategory);

// Route pour obtenir une recette par ID
router.get("/:id", getRecetteById);

// Route pour créer une recette avec upload d'image
router.post('/', upload.single('image'), createRecette);

// Route pour mettre à jour une recette avec upload d'image
router.patch("/:id", upload.single('image'), updateRecette);

// Route pour supprimer une recette
router.delete("/:id/delete", deleteRecette);

// Route pour liker une recette
router.patch("/:id/likes", likeRecette);

// Route pour unliker une recette
router.patch("/:id/unlikes", unlikeRecette);

// Route pour obtenir les commentaires d'une recette
router.get("/:id/commentaires", getCommentaire);

// Route pour ajouter un commentaire à une recette
router.post("/commentaires/add", postCommentaire);

module.exports = router;