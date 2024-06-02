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

const makeAdminByEmail = async (req, res) => {
  const email = req.params.email;
    if (!email) {
        return res.status(400).json({ message: "Email parameter is required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.role = 'admin';
        await user.save();
        res.status(200).json({ message: "User promoted to admin", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getOneAdminByEmail = async (req, res, next) => {
    try {
      const admin = await User.findOne({ email: req.params.email });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      res.status(200).json({ admin: admin.role === 'admin' });
    } catch (error) {
      next(createError(500, error.message));
    }
  };

const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const profileImagePath = req.file.path;

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: profileImagePath },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "Image uploaded successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error uploading image", error });
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
        message: "Utilisateur déconnecté",
      });
  } catch (error) {
    next(createError(500, error.message));
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
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

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(500, "Email incorrect"));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(500, "Mot de passe incorrect"));
    }

    const TOKEN = JWTGenerator(user._id, user.role);
    res.status(200).json({
      status: true,
      message: "Login avec succès",
      result: user,
      TOKEN,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

const updateUser = async (req, res, next) => {
  const data = req.body;
  try {
    if (req?.user?._id !== req.params.id) {
      return next(createError(400, "Vous n'avez pas les droits"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: true,
      message: "Utilisateur mis à jour avec succès",
      result: updatedUser,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "ID n'existe pas"));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(createError(400, "Cet utilisateur n'existe pas"));
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "Utilisateur supprimé avec succès",
    });
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
    next(createError(500, `quelque chose s'est mal passé: ${error.message}`));
  }
};

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
    const user = await User.findById(req.params.id)
      .populate("likedRecipes")
      .populate("dislikedRecipes");
    res.status(200).json({
      likedRecipes: user.likedRecipes || [],
      dislikedRecipes: user.dislikedRecipes || [],
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};
const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json(admins);
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  uploadProfileImage,
  updateUser,
  deleteUser,
  deleteAllUsers,
  logOut,
  getOneUser,
  postCommentaire,
  getUserRecipes,
  getUserLikedDislikedRecipes,
  makeAdminByEmail,
  getOneAdminByEmail,
  getAllAdmins,
};
