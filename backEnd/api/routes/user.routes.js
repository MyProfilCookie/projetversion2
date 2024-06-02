// routes/UserRouter.js
const express = require("express");
const multer = require("multer");
const UserController = require("../controllers/userControllers");
const verifyToken = require("../Middleware/verifyToken");
const verifyAdmin  = require("../Middleware/verifyAdmin");

const UserRouter = express.Router();

// Routes for users
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

UserRouter.patch('/admin/:email', verifyToken, verifyAdmin, UserController.makeAdminByEmail);
// UserRouter.delete('/admin/:email', verifyToken, verifyAdmin, UserController.deleteAdminByEmail);
// get list of admins
UserRouter.get('/admin', verifyToken, verifyAdmin, UserController.getAllAdmins);
// verify an admin by email
UserRouter.get('/admin/:email', verifyToken, verifyAdmin, UserController.getOneAdminByEmail);

// like recipes
UserRouter.get("/:userId/liked-disliked-recettes", UserController. getUserLikedDislikedRecipes);

module.exports = UserRouter;
