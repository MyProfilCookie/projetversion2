const Recette = require("../models/Recette");
const Commentaire = require("../models/Commentaire");
const LikeSchema = require("../models/Like");


// Recherche la derniere recette de la base de données
const getLastRecette = async (req, res) => {
  try {
    const lastRecette = await Recette.findOne().sort({ createdAt: -1 });
    if (!lastRecette) {
      return res.status(404).json({ message: 'Aucune recette trouvée' });
    }
    res.status(200).json({ id: lastRecette._id });
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error });
  }
};

// Supprime une recette par ID
const deleteRecette = async (req, res) => {
  try {
    const deletedRecette = await Recette.findByIdAndDelete(req.params.id);
    if (!deletedRecette) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }
    res.json(deletedRecette);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupère tous les commentaires d'une recette
const getComments = async (req, res) => {
  const { recetteId } = req.params;

  try {
    const comments = await Commentaire.find({ recette: recetteId }).populate('user', 'username');
    res.json(comments);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des commentaires" });
  }
};

// Ajoute ou met à jour un commentaire
const addOrUpdateComment = async (req, res) => {
  const { recetteId } = req.params;
  const { contenu } = req.body;
  const userId = req.user._id; // L'utilisateur est authentifié

  if (!contenu || !userId || !recetteId) {
    return res.status(400).json({ message: "Données manquantes" });
  }

  try {
    // Vérifie si l'utilisateur a déjà commenté cette recette
    let comment = await Commentaire.findOne({ user: userId, recette: recetteId });

    if (comment) {
      // Met à jour le commentaire existant
      comment.contenu = contenu;
      comment.modified = Date.now();
    } else {
      // Crée un nouveau commentaire
      comment = new Commentaire({
        contenu,
        user: userId,
        recette: recetteId
      });
    }

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error("Erreur lors de l'ajout ou de la mise à jour du commentaire:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout ou de la mise à jour du commentaire" });
  }
};

// Met à jour une recette par ID
const updateRecette = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('Données de mise à jour avant vérification du fichier:', updateData);

    if (req.file) {
      console.log('Fichier reçu:', req.file);
      updateData.image = req.file.filename;
    } else {
      console.log('Aucun fichier reçu');
    }

    const updatedRecette = await Recette.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedRecette) {
      return res.status(404).send({ message: 'Recette non trouvée' });
    }

    console.log('Recette mise à jour:', updatedRecette);
    res.status(200).json(updatedRecette);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la recette:', error);
    res.status(500).send({ message: error.message });
  }
};

// Supprime un like d'une recette
const unlikeRecette = async (req, res) => {
  if (!req.body.userId || !req.body.recetteId) {
    return res.status(400).json({ message: "userId et recetteId requis" });
  }
  try {
    const deletedLike = await LikeSchema.deleteOne({
      user: req.body.userId,
      recette: req.body.recetteId
    });
    res.json(deletedLike);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajoute un commentaire
const addComment = async (req, res) => {
  const { recetteId } = req.params;
  const { contenu } = req.body;
  const userId = req.user._id; // L'utilisateur est authentifié

  if (!contenu || !userId || !recetteId) {
    return res.status(400).json({ message: "Données manquantes" });
  }

  try {
    const newComment = new Commentaire({
      contenu,
      user: userId,
      recette: recetteId
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du commentaire" });
  }
};

// Supprime un commentaire
const deleteComment = async (req, res) => {
  const { recetteId, commentId } = req.params;
  const userId = req.user._id;

  try {
    const comment = await Commentaire.findOneAndDelete({ _id: commentId, user: userId, recette: recetteId });

    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé ou utilisateur non autorisé" });
    }

    res.status(200).json({ message: "Commentaire supprimé" });
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire:", error);
    res.status(500).json({ message: "Erreur lors de la suppression du commentaire" });
  }
};

// Ajoute un like à une recette
const likeRecette = async (req, res) => {      
  const { recetteId } = req.body;

  try {
    // Recherche un document de 'like' pour la recette spécifiée ou en crée un nouveau
    const recetteLike = await LikeSchema.findOneAndUpdate(
      { recette: recetteId },
      { $push: { likes: req.body.userId } },
      { new: true }
    );

    if (!recetteLike) {
      const newLike = new LikeSchema({
        recette: recetteId,
        likes: [req.body.userId],
      });
      await newLike.save();
    }
    res.json(recetteLike);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupère les recettes par catégorie
const getRecettesByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    if (!category) {
      return res.status(400).json({ message: 'La catégorie est requise' });
    }

    const recettes = await Recette.find({ category });
    res.status(200).json(recettes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des recettes', error });
  }
};

// Récupère toutes les recettes
const getAllRecettes = async (req, res) => {
  try {
    const recettes = await Recette.find({});
    res.json(recettes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupère une recette par ID
const getRecetteById = async (req, res) => {
  try {
    const recette = await Recette.findById(req.params.id);
    if (!recette) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }
    recette.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${recette.image}`;
    res.status(200).json(recette);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crée une nouvelle recette
const createRecette = async (req, res) => {
  try {
    const {
      titre,
      description,
      ingredients,
      instructions,
      temps_preparation,
      temps_cuisson,
      difficulte,
      category,
    } = req.body;
    const image = req.file ? req.file.filename : null;

    const newRecette = new Recette({
      titre,
      description,
      ingredients: ingredients.split(",").map((ingredient) => ingredient.trim()),
      instructions: instructions.split(",").map((instruction) => instruction.trim()),
      temps_preparation,
      temps_cuisson,
      difficulte,
      category,
      image,
    });

    const savedRecette = await newRecette.save();
    res.status(201).json(savedRecette);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRecettes,
  getRecetteById,
  updateRecette,
  createRecette,
  deleteRecette,
  likeRecette,
  unlikeRecette,
  getComments,
  addComment,
  getRecettesByCategory,
  getLastRecette,
  addOrUpdateComment,
  deleteComment,
};
