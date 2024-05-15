const Recette = require("../models/Recette");
const Commentaire = require("../models/Commentaire");
const LikeSchema = require("../models/Like");

const getAllRecettes = async(req, res) => {
    try {
        const recettes = await Recette.find({});
        res.json(recettes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getRecetteById = async(req, res) => {
    try {
        const recette = await Recette.findById(req.params.id);
        res.json(recette);
        console.log(recette);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

const createRecette = async(req, res) => {

    const recette = new Recette({
        titre: req.body.titre,
        description: req.body.description,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        temps_preparation: req.body.temps_preparation,
        temps_cuisson: req.body.temps_cuisson,
        difficulte: req.body.difficulte,
        category: req.body.category,
        likes: [],
        commentaires: [],
    });
    try {
        const newRecette = await recette.save();
        res.status(201).json(newRecette);
        console.log(newRecette);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

}

const updateRecette = async(req, res) => {

    const recette = {
        titre: req.body.titre,
        description: req.body.description,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        temps_preparation: req.body.temps_preparation,
        temps_cuisson: req.body.temps_cuisson,
        difficulte: req.body.difficulte,
        category: req.body.category,
        likes: [],
        commentaires: [],
    };
    try {
        const updatedRecette = await Recette.findByIdAndUpdate(req.params.id, recette, { new: true });
        res.json(updatedRecette);
        console.log(updatedRecette);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

}

const deleteRecette = async(req, res) => {

    try {
        const deletedRecette = await Recette.findByIdAndDelete(req.params.id);
        res.json(deletedRecette);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}
const unlikeRecette = async(req, res) => {
    if (!req.body.userId || !req.body.recetteId) {
        return res.status(400).json({ message: "userId et recetteId requis" });
    }
    try {
        const deletedLike = await Like.deleteOne({
            user: req.body.userId,
            recette: req.body.recetteId
        });
        res.json(deletedLike);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getCommentaire = async(req, res) => {
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
}
const postCommentaire = async(req, res) => {
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
}
const likeRecette = async(req, res) => {      
    const { recetteId } = req.body;

try {
    // Recherche un document de 'like' pour la recette spécifiée ou en crée un nouveau
    const recetteLike = await Like.findOneAndUpdate(
        
        { recette: recetteId },
        { $push: { likes: req.body.userId } },
        { new: true }
    );

    if (!recetteLike) {
        const newLike = new Like({
            recette: recetteId,
            likes: [req.body.userId],
        });
        await newLike.save();
    }
    res.json(recetteLike);
} catch (err) {
    res.status(500).json({ message: err.message });
}
}


module.exports = {
    getAllRecettes,
    getRecetteById,
    createRecette,
    updateRecette,
    deleteRecette,
    likeRecette,
    unlikeRecette,
    getCommentaire,
    postCommentaire
}