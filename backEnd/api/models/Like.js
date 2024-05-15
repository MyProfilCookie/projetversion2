const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définition du schéma pour les likes d'une recette
const LikeSchema = new Schema({
    recette: {
        type: Schema.Types.ObjectId, // Utilise ObjectId pour référencer une recette
        ref: 'Recette',              // Le modèle 'Recette' référencé
        required: true               // Champ obligatoire
    },
    likesCount: {
        type: Number,                // Compteur de likes
        default: 0                   // Initialise à zéro
    }
}, {
    timestamps: true  // Ajoute les propriétés `createdAt` et `updatedAt` automatiquement
});

// Création du modèle Mongoose 'RecetteLike' à partir du schéma défini
const Like = mongoose.model('RecetteLike', LikeSchema);

module.exports = Like;
