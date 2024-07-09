const express = require("express");
const UserController = require("../controllers/userControllers");
const verifyToken = require("../Middleware/verifyToken");
const verifyAdmin = require("../Middleware/verifyAdmin");
const User = require("../models/User");
const Recette = require("../models/Recette");
const multer = require("multer");
const {checkRegisterInput} = require("../Validation/UserDataRules");
const UserRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Le dossier de destination
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Route pour l'affichage de tous les utilisateurs
UserRouter.route("/", verifyToken, verifyAdmin)
  .get(UserController.getAllUsers)
  .patch(UserController.updateUser)
  .delete(UserController.deleteAllUsers);


// Route pour l'affichage d'un seul utilisateur
UserRouter.get("/last-one", UserController.getLastUser);
UserRouter.patch(
  "/admin/:email",
  verifyToken,
  verifyAdmin,
  UserController.makeAdminByEmail
);


// Route pour l'affichage de tous les administrateurs
UserRouter.get("/admin", verifyToken, verifyAdmin, UserController.getAllAdmins);
UserRouter.get("/admin/:email", verifyToken, verifyAdmin, (req, res) => {
  res.status(200).json({ admin: true });
});
UserRouter.put(
  "/admin/:id",
  verifyToken,
  verifyAdmin,
  UserController.makeAdminById
);
UserRouter.delete(
  "/admin/:id",
  verifyToken,
  verifyAdmin,
  UserController.removeAdminById
);

UserRouter.put("/toggle-admin/:id", verifyToken, verifyAdmin, UserController.toggleAdminStatus);

// Route pour envoyer et récuperer un message à un utilisateur
UserRouter.post("/message/:id", async (req, res) => {
    const messageId = req.params.id;
    const messageBody = req.body;
    console.log(`Received message ID: ${messageId}`);
    console.log(`Message body: `, messageBody);

    // Répondre avec succès
    res.status(200).send({ status: 'Message received', messageId, messageBody });
});
UserRouter.get("/message/:id", async (req, res) => {
    const messageId = req.params.id;
    console.log(`Received message ID: ${messageId}`);
    res.status(200).send({ status: 'Message received', messageId });
});


UserRouter.route("/:id")
  .get(UserController.getOneUser)
  .delete(UserController.deleteUser);

//Les routes pour les utilisateurs
UserRouter.post("/register",checkRegisterInput, UserController.createUser);
UserRouter.post("/login", UserController.loginUser);
UserRouter.get("/logout", UserController.logOut);


// Route pour modifier un utilisateur
UserRouter.patch('/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const updates = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
UserRouter.post('/users/:userId/upload', upload.single('profileImage'), UserController.uploadImage);

// Routes pour les recettes likées et dislikées
UserRouter.get("/:userId/liked-disliked-recettes", verifyToken, UserController.getUserLikedDislikedRecipes);
UserRouter.post("/:userId/liked-recipes", verifyToken, UserController.toggleLikeRecipe);
UserRouter.delete("/:userId/liked-recipes", verifyToken, UserController.toggleLikeRecipe);
UserRouter.post("/:userId/disliked-recipes", verifyToken, UserController.toggleDislikeRecipe);
UserRouter.delete("/:userId/disliked-recipes", verifyToken, UserController.toggleDislikeRecipe);

UserRouter.get("/:userId/liked-recipes", verifyToken, UserController.getLikedRecettes);
UserRouter.get("/:userId/disliked-recipes", verifyToken, UserController.getDislikedRecettes);

UserRouter.post('/:userId/recettes', upload.single('image'), async (req, res) => {
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
      user: req.params.userId,
      status: 'pending', // Statut par défaut 'pending' pour les recettes non validées
    });

    const savedRecette = await newRecette.save();
    res.status(201).json(savedRecette);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


UserRouter.get('/:userId/pending-recettes', async (req, res) => {
  try {
    const pendingRecettes = await Recette.find({
      user: req.params.userId,
      status: 'pending',
    });
    res.status(200).json(pendingRecettes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending recipes', error });
  }
});
UserRouter.get('/:userId/recettes', async (req, res) => {
  try {
    const recettes = await Recette.find({ user: req.params.userId });
    res.status(200).json(recettes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
});


module.exports = UserRouter;
