const express = require("express");
const UserRouter = express.Router();

// Controllers
const UserController = require("../controllers/userControllers");
const { checkRegisterInput, checkLoginInput, checkUserUpdateInput } = require("../Validation/UserDataRules");

// toutes les recettes d'un utilisateur
UserRouter.route("/")
  .get(UserController.getAllUsers)
  .patch(UserController.updateUser)
  .delete(UserController.deleteAllUsers);

UserRouter.route("/:id")
  .get(UserController.getOneUser)
  .delete(UserController.deleteUser);

// Route pour obtenir les recettes publiées par un utilisateur
UserRouter.get("/:id/recipes", UserController.getUserRecipes);

// Route pour obtenir les recettes likées et dislikées par un utilisateur
UserRouter.get("/:id/liked-disliked-recipes", UserController.getUserLikedDislikedRecipes);

UserRouter.post("/register", checkRegisterInput, UserController.createUser);
UserRouter.post("/login", checkLoginInput, UserController.loginUser);
UserRouter.get("/logout", UserController.logOut);
UserRouter.get("/me", UserController.getMe);

module.exports = UserRouter;


// _id
// 6626b2860723d637fb207d86
// username
// "johndoe"
// password
// "securePassword123"
// email
// "johndoe@example.com"

