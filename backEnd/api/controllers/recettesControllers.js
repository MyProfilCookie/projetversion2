const Recette = require("../models/Recette");
const Commentaire = require("../models/Commentaire");
const LikeSchema = require("../models/Like");

// const getAllRecettes = async (req, res) => {
//     try {
//         const recettes = await Recette.find({});
//         res.json(recettes);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// const createRecette = async (req, res) => {
//     try {
//         const { titre, description, ingredients, instructions, temps_preparation, temps_cuisson, difficulte, category } = req.body;
//         const image = req.file ? req.file.filename : 'default.jpg'; 

//         const newRecette = new Recette({
//             titre,
//             description,
//             ingredients: ingredients.split(',').map(ingredient => ingredient.trim()),
//             instructions: instructions.split(',').map(instruction => instruction.trim()),
//             temps_preparation,
//             temps_cuisson,
//             difficulte,
//             category,
//             image
//         });

//         const savedRecette = await newRecette.save();
//         res.status(201).json(savedRecette);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const updateRecette = async (req, res, next) => {
//     try {
//       const recetteId = req.params.id;
//       const updateData = req.body;
//       if (req.file) {
//         updateData.image = req.file.filename; // Mettre à jour le champ image si un fichier est envoyé
//       }
  
//       const updatedRecette = await Recette.findByIdAndUpdate(recetteId, updateData, { new: true });
  
//       if (!updatedRecette) {
//         return res.status(404).json({ message: "Recette non trouvée" });
//       }
  
//       res.status(200).json(updatedRecette);
//     } catch (error) {
//       next(error);
//     }
//   };

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

// const getRecetteById = async (req, res) => {
//     try {
//         const recette = await Recette.findById(req.params.id);
//         if (!recette) {
//             return res.status(404).json({ message: 'Recette non trouvée' });
//         }
//         recette.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${recette.image}`;

//         res.status(200).json(recette);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
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
  
  const updateRecette = async (req, res) => {
    try {
      const { id } = req.params;
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
  
      const updatedData = {
        titre,
        description,
        ingredients: ingredients.split(",").map((ingredient) => ingredient.trim()),
        instructions: instructions.split(",").map((instruction) => instruction.trim()),
        temps_preparation,
        temps_cuisson,
        difficulte,
        category,
      };
  
      if (image) {
        updatedData.image = image;
      }
  
      const updatedRecette = await Recette.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedRecette) {
        return res.status(404).json({ message: "Recette non trouvée" });
      }
  
      res.status(200).json(updatedRecette);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
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
};