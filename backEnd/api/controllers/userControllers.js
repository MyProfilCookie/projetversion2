const User = require("../models/User");
const Recette = require("../models/Recette");
const createError = require("http-errors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWTGenerator = require("../Utils/JWTGenerator");

const getAllUsers = async (req, res, next) => {
  try {
    const result = await User.find({});
    res.status(200).json({
      status: true,
      result,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

const getMe = async (req, res, next) => {
  try {
    const me = req.user;
    if (!me) {
      next(createError(404, "Utilisateur introuvable"));
    }
    res.status(200).json({
      status: true,
      me,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

const postCommentaire = async (req, res, next) => {
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
    next(createError(500, error.message));
  }
};

const logOut = async (req, res, next) => {
  try {
    res
      .cookie(process.env.COOKIE_NAME, "", {
        maxAge: 1,
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      })
      .status(200)
      .json({
        status: true,
        message: "Utilisateur deconnecté",
      });
  } catch (error) {
    next(createError(500, error.message));
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    next(createError(500, error.message));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUserEmailExists = await User.findOne({ email });
    const isUserUsernameExists = await User.findOne({
      username: username,
    });

    if (isUserEmailExists && !isUserUsernameExists) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        isUserEmailExists.password
      );
      if (isPasswordCorrect) {
        const TOKEN = JWTGenerator(
          isUserEmailExists._id,
          isUserEmailExists.role
        );
        res.status(200).json({
          status: true,
          message: "Login avec succes",
          result: isUserEmailExists,
          TOKEN,
        });
        console.log(isUserEmailExists);
      } else {
        next(createError(500, "Mot de passe incorrect"));
      }
    } else if (!isUserEmailExists && isUserUsernameExists) {
      next(createError(500, "Email incorrect"));
    } else {
      next(createError(500, "Email ou mot de passe incorrect"));
    }
  } catch (error) {
    next(createError(500, error.message));
  }
};

const updateUser = async (req, res, next) => {
  const data = req.body;
  try {
    if (req?.user?._id !== req.params.id) {
      return next(createError(400, "Vous n'avez pas les droits"));
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: data },
        { new: true }
      );
      if (updateUser.nModified > 0) {
        const updatedUser = await User.findById(req.params.id).select(
          "-password"
        );
        res.status(200).json({
          status: true,
          message: "Utilisateur mis à jour avec succes",
          result: updatedUser,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Aucun changement",
          result: null,
        });
      }
    }
  } catch (error) {
    next(createError(500, error.message));
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      next(createError(400, "ID n'existe pas"));
    }
    const isUserExists = await User.findById(id);
    if (!isUserExists) {
      next(createError(400, "Cet utilisateur n'existe pas"));
    } else {
      await User.findByIdAndDelete(id);
      res.status(200).json({
        status: true,
        message: "Utilisateur supprimé avec succes",
      });
    }
  } catch (error) {
    next(createError(500, error.message));
  }
};

const deleteAllUsers = async (req, res, next) => {
  try {
    await User.deleteMany();
    res.status(201).json({
      status: true,
      message: "Tous les utilisateurs ont bien été supprimés",
    });
  } catch (error) {
    next(createError(500, `quelque chose s'est mal passe: ${error.message}`));
  }
};

// Nouvelle fonction pour obtenir les recettes publiées par l'utilisateur
const getUserRecipes = async (req, res, next) => {
  try {
    const userRecipes = await Recette.find({ user: req.params.id });
    res.status(200).json(userRecipes);
  } catch (error) {
    next(createError(500, error.message));
  }
};

const getUserLikedDislikedRecipes = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('likedRecipes').populate('dislikedRecipes');
    res.status(200).json({
      likedRecipes: user.likedRecipes || [],
      dislikedRecipes: user.dislikedRecipes || []
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};


module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
  logOut,
  getOneUser,
  getMe,
  postCommentaire,
  getUserRecipes,
  getUserLikedDislikedRecipes
};
