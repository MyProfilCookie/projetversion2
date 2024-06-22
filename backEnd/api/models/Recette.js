const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Création du schéma de la base de données pour les recettes
const recetteSchema = new Schema(
  {
    titre: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 500, // Augmenter pour permettre des descriptions plus longues
    },
    ingredients: [
      {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 5000, // Augmenter pour permettre des ingrédients plus longs
      },
    ],
    instructions: [
      {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 10000, // Augmenter pour permettre des instructions plus longues
      },
    ],
    temps_preparation: {
      type: String,
      trim: true,
      required: true,
      minlength: 1,
      maxlength: 1000,
    },
    temps_cuisson: {
      type: String,
      trim: true,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    difficulte: {
      type: String,
      trim: true,
      required: true,
      minlength: 6,
      maxlength: 10,
      enum: ["facile", "moyenne", "difficile"],
    },
    category: {
      type: String,
      trim: true,
      required: true,
      minlength: 1,
      maxlength: 30,
      enum: ["Chocolat", "Gourmandises", "Pains et viennoiserie", "Fruits"], // Ajouter les autres catégories si elles sont requises
    },
    image: {
      type: String,
      trim: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        commenterId: String,
        commenterPseudo: String,
        text: String,
        timestamp: Number,
      },
    ],
    likes: {
      type: [String],
    },
    dislikes: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Exportation du schéma
const Recette = mongoose.model("Recette", recetteSchema);

module.exports = Recette;

