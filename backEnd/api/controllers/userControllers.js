const User = require("../models/User");
const Recette = require("../models/Recette");
const createError = require("http-errors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Récupère tous les utilisateurs
const getAllUsers = async (req, res, next) => {
  try {
    const result = await User.find({});
    res.status(200).json({
      status: true,
      result,
    });
  } catch (error) {
    // next signifie qu'il y a une erreur et qu'elle doit être transmise à l'erreur suivante
    next(createError(500, error.message));
  }
};

// Récupère tous les recettes d'un utilisateur
const getUserRecipes = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const recettes = await Recette.find({ user: userId });

    if (!recettes) {
      return res.status(404).json({ message: 'Aucune recette trouvée pour cet utilisateur' });
    }

    res.status(200).json(recettes);
  } catch (error) {
    next(error);
  }
};


// Promote un utilisateur à admin par son email
const makeAdminByEmail = async (req, res) => {
  // Recherche l'utilisateur par son email le req.params.email correspond à l'email de l'utilisateur a promouvoir à admin
  const email = req.params.email;
  if (!email) {
    return res.status(400).json({ message: "L'email est manquant" });
  }
  try {
    // Trouve l'utilisateur par son email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "l'utilisateur n'existe pas" });
    }
    user.role = 'admin';
    await user.save();
    res.status(200).json({ message: "L'utilisateur est maintenant admin", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur", error });
  }
};
// Récupère un utilisateur par son email et vérifie s'il est admin
const getOneAdminByEmail = async (req, res, next) => {
   try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, 'Utilisateur non trouvé'));
    }
    res.status(200).json({ admin: user.role === 'admin' });
  } catch (error) {
    next(createError(500, error.message));
  }
};

// Récupère un utilisateur par son token
const validateToken = async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  if (!token) {
    return res.status(403).send({ message: "Aucun token n'est transmis" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send({ message: "L'utilisateur n'existe pas ou n'est pas authentifie" });
    }
    res.status(200).send({ user });
  } catch (err) {
    res.status(500).send({ message: "Aucun token n'est transmis" });
  }
};

// Récupère un profil d'un utilisateur par son ID
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.decoded.id);
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    res.status(200).json({ user });
  } catch (error) {
    next(createError(500, 'Server error'));
  }
};


// Met à jour l'image de profil d'un utilisateur par son ID
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
      return res.status(404).send({ message: "L'utilisateur n'existe pas ou n'est pas authentifie" });
    }

    res.status(200).send({ message: "Image de profil mise à jour", user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erreur du serveur", error });
  }
};

// const postCommentaire = async (req, res, next) => {
//   try {
//     const newCommentaire = new Commentaire({
//       userId: req.body.userId,
//       recetteId: req.body.recetteId,
//       contenu: req.body.contenu,
//     });
//     const result = await newCommentaire.save();
//     res.status(200).json({
//       status: true,
//       result,
//     });
//   } catch (error) {
//     next(createError(500, error.message));
//   }
// };

// Le logout de l'utilisateur
const logOut = async (req, res, next) => {
  try {
    // Suppression du cookie de session qu'on a mis dans le navigateur
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

// Récupère un utilisateur par son ID
const getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Creer un utilisateur et le sauvegarde dans la base de donnees
const createUser = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    // on verifie que tous les champs sont remplis et valides avant de creer un utilisateur
    if (!email || !password || !username) {
      return next(createError(400, "Tous les champs sont obligatoires"));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, "Un utilisateur avec cet e-mail existe déjà"));
    }
    // on hash le mot de passe avant de le sauvegarder
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // on cree un nouvel utilisateur avec les informations saisies par l'utilisateur
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    res.status(201).json({ user: savedUser });
  } catch (error) {
    next(createError(500, error.message));
  }
};

// Connexion d'un utilisateur
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError(400, 'Email et mot de passe sont requis'));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(400, 'Utilisateur non trouvé'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createError(400, 'Mot de passe incorrect'));
    }
    // Génération d'un jeton JWT pour l'utilisateur lors de la connexion
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    // Enregistrement du jeton dans le cookie de session pour l'utilisateur
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Utilisation des cookies sécurisés en production
      maxAge: 3600000, // 1 heure en millisecondes
      sameSite: 'Strict', // Cookies strictement identiques
    });

    console.log("Cookie set: ", res.cookies);

    res.status(200).json({
      user: { id: user._id, email: user.email, username: user.username },
      token,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

// Récupère le dernier utilisateur
const getLastUser = async (req, res, next) => {
  try {
    // Tri des utilisateurs par date de création dans l'ordre descendant et récupération du premier utilisateur
    const lastUser = await User.findOne().sort({ createdAt: -1 });
    if (!lastUser) {
      return res.status(404).json({ message: `L'utilisateur n\'existe pas` });
    }
    res.status(200).json({ id: lastUser._id, email: lastUser.email });
  } catch (error) {
    console.error('Erreur du serveur au moment de la requête du dernier utilisateur:', error); 
    next(createError(500, error.message));
  }
};

// Met à jour les informations d'un utilisateur
const updateUser = async (req, res, next) => {
  const data = req.body;
  try {
    // on verifie que l'utilisateur a bien les droits pour mettre a jour les informations
    if (req?.user?._id !== req.params.id) {
      return next(createError(400, "Vous n'avez pas les droits"));
    }
    // on met à jour l'utilisateur $set pour mettre a jour les informations présent dans la base de données et on renvoie les informations mis à jour
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Cet utilisateur n'existe pas" });
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

// Supprime un utilisateur par son ID
const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    // on verifie si l'id est valide par la fonction mongoose.isValidObjectId et on verifie si l'utilisateur existe bien
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
// Supprime tous les utilisateurs
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

// Gére les likes et les dislikes des recettes
const toggleLikeRecipe = async (req, res) => {
  try {
    // Vérifie si l'utilisateur et la recette existent
    const { userId } = req.params;
    const { recetteId } = req.body;

    const user = await User.findById(userId);
    const recipe = await Recette.findById(recetteId);

    if (!user || !recipe) {
      return res.status(404).json({ message: `L'utilisateur ou la recette n\'existe pas` });
    }
    // indexOf est la fonction qui permet de trouver l'index d'un élément dans un tableau et -1 signifie qu'il n'y a pas d'élément dans le tableau
    const index = user.likedRecipes.indexOf(recetteId);

    if (req.method === 'POST') {
      if (index === -1) {
        user.likedRecipes.push(recetteId);
        recipe.likes.push(userId);
      }
    } else if (req.method === 'DELETE') {
      if (index !== -1) {
        user.likedRecipes.splice(index, 1);
        const recipeLikeIndex = recipe.likes.indexOf(userId);
        if (recipeLikeIndex > -1) {
          recipe.likes.splice(recipeLikeIndex, 1);
        }
      }
    }

    await user.save();
    await recipe.save();

    res.status(200).json({ likedRecipes: user.likedRecipes, dislikedRecipes: user.dislikedRecipes });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification des likes', error });
  }
};
 // Gére les dislikes des recettes
const toggleDislikeRecipe = async (req, res) => {
  try {
    const { userId } = req.params;
    const { recetteId } = req.body;

    const user = await User.findById(userId);
    const recipe = await Recette.findById(recetteId);

    if (!user || !recipe) {
      return res.status(404).json({ message: 'L\'utilisateur ou la recette n\'existe pas' });
    }

    const index = user.dislikedRecipes.indexOf(recetteId);

    if (req.method === 'POST') {
      if (index === -1) {
        user.dislikedRecipes.push(recetteId);
        recipe.dislikes.push(userId);
      }
    } else if (req.method === 'DELETE') {
      if (index !== -1) {
        user.dislikedRecipes.splice(index, 1);
        const recipeDislikeIndex = recipe.dislikes.indexOf(userId);
        if (recipeDislikeIndex > -1) {
          recipe.dislikes.splice(recipeDislikeIndex, 1);
        }
      }
    }

    await user.save();
    await recipe.save();

    res.status(200).json({ likedRecipes: user.likedRecipes, dislikedRecipes: user.dislikedRecipes });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification des dislikes', error });
  }
};
// Récupere les likes et les dislikes d'un utilisateur
const getUserLikedDislikedRecipes = async (req, res) => {
  try {
    const { userId } = req.params;
    // Populate permet de faire le lien entre les documents de 'like' et 'user' et de les afficher
    const user = await User.findById(userId)
      .populate('likedRecipes')
      .populate('dislikedRecipes');

    if (!user) {
      return res.status(404).json({ message: 'L\'utilisateur n\'existe pas' });
    }
    // Récupère les likes et les dislikes d'un utilisateur
    res.status(200).json({
      likedRecipes: user.likedRecipes,
      dislikedRecipes: user.dislikedRecipes
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recuperation des likes', error });
  }
};

// Gére les likes d'une recette
const likeRecette = async (req, res) => {
  try {
    const { userId } = req.params;
    const { recetteId } = req.body;

    // Trouve la recette et le user
    const recette = await Recette.findById(recetteId);
    if (!recette) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    const userIndex = recette.likes.indexOf(userId);
    if (userIndex === -1) {
      recette.likes.push(userId);
    } else {
      recette.likes.splice(userIndex, 1);
    }

    const dislikeIndex = recette.dislikes.indexOf(userId);
    if (dislikeIndex !== -1) {
      recette.dislikes.splice(dislikeIndex, 1);
    }

    await recette.save();
    res.status(200).json({ message: "Recette mise à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Gére les dislikes d'une recette
const dislikeRecette = async (req, res) => {
  try {
    const { userId } = req.params;
    const { recetteId } = req.body;

    const recette = await Recette.findById(recetteId);
    if (!recette) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    const userIndex = recette.dislikes.indexOf(userId);
    if (userIndex === -1) {
      recette.dislikes.push(userId);
    } else {
      recette.dislikes.splice(userIndex, 1);
    }

    const likeIndex = recette.likes.indexOf(userId);
    if (likeIndex !== -1) {
      recette.likes.splice(likeIndex, 1);
    }

    await recette.save();
    res.status(200).json({ message: "Recette mise à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupère les likes et les dislikes d'un utilisateur
const getLikedRecettes = async (req, res) => {
  try {
    const { userId } = req.params;
    const recettes = await Recette.find({ likes: userId });
    res.status(200).json(recettes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupère les dislikes d'un utilisateur
const getDislikedRecettes = async (req, res) => {
  try {
    const { userId } = req.params;
    const recettes = await Recette.find({ dislikes: userId });
    res.status(200).json(recettes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Gére le rôle d'un utilisateur par son ID
const makeAdminById = async (req, res) => {
  try {
    // Requête reçue pour promouvoir l'utilisateur avec l'ID : userId
    const userId = req.params.id;
    console.log(`Requête reçue pour promouvoir l'utilisateur avec l'ID : ${userId}`);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log(`Utilisateur non trouvé avec l'ID : ${userId}`);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    // Promouvoir l'utilisateur avec l'ID : userId en rôle d'admin
    user.role = "admin";
    await user.save();
    console.log(`Utilisateur avec l'ID : ${userId} promu au rôle d'admin`);
    
    res.status(200).json({ message: "Utilisateur promu au rôle d'admin", user });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Gére le rôle d'un utilisateur par son ID pour le révoquer
const removeAdminById = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Requête reçue pour révoquer les privilèges d'administrateur de l'utilisateur avec l'ID : ${userId}`);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log(`Utilisateur non trouvé avec l'ID : ${userId}`);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    user.role = "user";
    await user.save();
    console.log(`Privilèges d'administrateur révoqués pour l'utilisateur avec l'ID : ${userId}`);
    
    res.status(200).json({ message: "Privilèges d'administrateur révoqués", user });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


// Récupère tous les administrateurs
const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json(admins);
  } catch (error) {
    next(createError(500, error.message));
  }
};

const removeLikeRecette = async (req, res) => {
  try {
    const { userId } = req.params;
    const { recetteId } = req.body;

    const recette = await Recette.findById(recetteId);
    if (!recette) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    const userIndex = recette.likes.indexOf(userId);
    if (userIndex !== -1) {
      recette.likes.splice(userIndex, 1);
      await recette.save();
    }

    res.status(200).json({ message: "Like supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Enleve un dislike d'une recette
const removeDislikeRecette = async (req, res) => {
  try {
    const { userId } = req.params;
    const { recetteId } = req.body;

    const recette = await Recette.findById(recetteId);
    if (!recette) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    const userIndex = recette.dislikes.indexOf(userId);
    if (userIndex !== -1) {
      recette.dislikes.splice(userIndex, 1);
      await recette.save();
    }

    res.status(200).json({ message: "Dislike supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleAdminStatus = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(`Recherche de l'utilisateur avec l'ID: ${userId}`);

    const user = await User.findById(userId);
    if (!user) {
      console.error(`Utilisateur non trouvé avec l'ID: ${userId}`);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Inverser le rôle de l'utilisateur entre "admin" et "user"
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    console.log(`Rôle mis à jour pour l'utilisateur avec l'ID: ${userId}, rôle: ${user.role}`);
    res.status(200).json({ message: 'Rôle mis à jour', role: user.role });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du rôle: ${error.message}`);
    next(error);
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
  getUserRecipes,
  getUserLikedDislikedRecipes,
  makeAdminByEmail,
  getOneAdminByEmail,
  getAllAdmins,
  getLastUser,
  validateToken,
  getProfile,
  makeAdminById,
  removeAdminById,
  likeRecette,
  dislikeRecette,
  getLikedRecettes,
  getDislikedRecettes,
  getUserRecipes,
  removeDislikeRecette,
  removeLikeRecette,
  toggleLikeRecipe,
  toggleDislikeRecipe,
  toggleAdminStatus,
};