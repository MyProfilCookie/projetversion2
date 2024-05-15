const express = require("express");
const router = express.Router();
const { getAllRecettes, getRecetteById, createRecette, updateRecette, deleteRecette, likeRecette, unlikeRecette, getCommentaire, postCommentaire } = require("../controllers/recettesControllers");

// get toutes les recettes
router.get("/", getAllRecettes);
router.get("/:id", getRecetteById);
router.post("/add", createRecette);
router.put("/:id/update", updateRecette);
router.delete("/:id/delete", deleteRecette);
router.patch("/:id/likes", likeRecette);
router.patch("/:id/unlikes", unlikeRecette);
router.get("/:id/commentaires", getCommentaire);
router.post("/commentaires/add", postCommentaire);

















module.exports = router;