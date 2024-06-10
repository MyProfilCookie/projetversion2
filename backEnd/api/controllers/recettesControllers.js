const Recette = require("../models/Recette");
const Commentaire = require("../models/Commentaire");
const LikeSchema = require("../models/Like");

const getLastRecette = async (req, res) => {
  try {
    const lastRecette = await Recette.findOne().sort({ createdAt: -1 });
    if (!lastRecette) {
      return res.status(404).json({ message: 'No recettes found' });
    }
    res.status(200).json({ id: lastRecette._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
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

const updateRecette = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('Update data before checking file:', updateData);

    if (req.file) {
      console.log('File received:', req.file);
      updateData.image = req.file.filename;
    } else {
      console.log('No file received');
    }

    const updatedRecette = await Recette.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedRecette) {
      return res.status(404).send({ message: 'Recette non trouvée' });
    }

    console.log('Updated recette:', updatedRecette);
    res.status(200).json(updatedRecette);
  } catch (error) {
    console.error('Error updating recette:', error);
    res.status(500).send({ message: error.message });
  }
}



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

const getCommentaire = async (req, res) => {
    if (!req.body.recetteId) {
        return res.status(400).json({ message: "recetteId requis" });
    }
    try {
        const commentaires = await Commentaire.find({
            recetteId: req.body.recetteId
        });
        res.json(commentaires);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const postCommentaire = async (req, res) => {
    if (!req.body.userId || !req.body.recetteId || !req.body.contenu) {
        return res.status(400).json({ message: "userId, recetteId et contenu requis" });
    }
    try {
        const newCommentaire = new Commentaire({
            userId: req.body.userId,
            recetteId: req.body.recetteId,
            contenu: req.body.contenu,
        });
        const result = await newCommentaire.save();
        res.status(200).json({
            status: true,
            result,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

const getRecettesByCategory = async (req, res) => {
    try {
        const category = req.query.category;
        if (!category) {
            return res.status(400).json({ message: 'Category is required' });
        }

        const recettes = await Recette.find({ category });
        res.status(200).json(recettes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipes', error });
    }
};

const getAllRecettes = async (req, res) => {
    try {
      const recettes = await Recette.find({});
      res.json(recettes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
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
    getCommentaire,
    postCommentaire,
    getRecettesByCategory,
    getLastRecette,
    
};