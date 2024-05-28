const express = require("express");
const multer = require("multer");
const UserController = require("../controllers/userControllers");
const verifyToken = require("../Middleware/verifyToken");
const verifyAdmin  = require("../Middleware/verifyAdmin");

const UserRouter = express.Router();


UserRouter.route("/", verifyToken, verifyAdmin)
  .get(UserController.getAllUsers)
  .patch(UserController.updateUser)
  .delete(UserController.deleteAllUsers);

UserRouter.route("/:id")
  .get(UserController.getOneUser)
  .delete(UserController.deleteUser);

UserRouter.post("/register", UserController.createUser);
UserRouter.post("/login", UserController.loginUser);
UserRouter.get("/logout", UserController.logOut);


UserRouter.post("/:userId/commentaire", UserController.postCommentaire);
UserRouter.get("/:userId/recettes", UserController.getUserRecipes);
UserRouter.patch('/admin/:id', verifyToken, verifyAdmin, UserController.makeAdmin);
// like les recettes
UserRouter.get("/:userId/liked-disliked-recettes", UserController. getUserLikedDislikedRecipes);

module.exports = UserRouter;


// _id
// 6626b2860723d637fb207d86
// username
// "johndoe"
// password
// "securePassword123"
// email
// "johndoe@example.com"

