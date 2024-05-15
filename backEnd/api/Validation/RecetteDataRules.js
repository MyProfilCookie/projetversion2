const { check } = require('express-validator');
const createHttpError = require('http-errors');
const Recette = require('../Model/Recette');

exports.checkRecetteInput = [
    check("titre").trim().not().isEmpty().withMessage("Le titre est obligatoire"),
    check("description").trim().not().isEmpty().withMessage("La description est obligatoire"),
    check("ingredients").trim().not().isEmpty().withMessage("Les ingredients sont obligatoires"),
    check("instructions").trim().not().isEmpty().withMessage("Les instructions sont obligatoires"),
    check("temps_preparation").trim().not().isEmpty().withMessage("Le temps de preparation est obligatoire"),
    check("temps_cuisson").trim().not().isEmpty().withMessage("Le temps de cuisson est obligatoire"),
    check("difficulte").trim().not().isEmpty().withMessage("La difficulte est obligatoire"),
    check("category").trim().not().isEmpty().withMessage("La category est obligatoire")
];

exports.checkRecetteUpdateInput = [
    check("titre").trim(),
    check("description").trim(),
    check("ingredients").trim(),
    check("instructions").trim(),
    check("temps_preparation").trim(),
    check("temps_cuisson").trim(),
    check("difficulte").trim(),
    check("category").trim(),
];

exports.checkRecetteDeleteInput = [
    check("id").trim().not().isEmpty().withMessage("L'id est obligatoire")
];