const {check} = require('express-validator');
const User = require('../models/User');
const createHttpError = require('http-errors');

exports.checkRegisterInput = [
    check("username").trim().not().isEmpty().withMessage("L'username est obligatoire"),
    check("email")
    .trim()
    .not().isEmpty()
    .withMessage("L'email est obligatoire")
    .isEmail()
    .withMessage("L'email n'est pas valide")
    .custom(async (value) => {
        const user = await User.findOne({email: value});
        if (user) {
            throw createHttpError(400, "Cet email est deja utilise");
        }
    }),
    check("password")
    .trim()
    .not().isEmpty()
    .withMessage("Le mot de passe est obligatoire")
    .isLength({min: 8})
    .withMessage("Le mot de passe doit contenir au moins 6 caractères")
];

exports.checkLoginInput = [
    check("email")
    .trim()
    .not().isEmpty()
    .withMessage("L'email est obligatoire")
    .isEmail()
    .withMessage("L'email n'est pas valide")
    .custom(async (value) => {
        const user = await User.findOne({email: value});
        if (!user) {
            throw createHttpError(400, "Cet email n'existe pas");
        }
    }),
    check("password")
    .trim()
    .not().isEmpty()
    .withMessage("Le mot de passe est obligatoire")
    .isLength({min: 8})
    .withMessage("Le mot de passe doit contenir au moins 6 caractères")
];

exports.checkUserUpdateInput = [
    check("username").trim(),
    check("email").trim(),
    check("password").trim(),
];

