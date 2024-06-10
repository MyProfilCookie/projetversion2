// routes/UserRouter.js
const express = require("express");
const UserController = require("../controllers/userControllers");
const verifyToken = require("../Middleware/verifyToken");
const verifyAdmin  = require("../Middleware/verifyAdmin");
const authenticateUser= require("../Middleware/UserAuthenticationMiddleware");

const UserRouter = express.Router();

// Routes for users
UserRouter.route("/", verifyToken, verifyAdmin)
  .get(UserController.getAllUsers)
  .patch(UserController.updateUser)
  .delete(UserController.deleteAllUsers)
UserRouter.get("/last-one", UserController.getLastUser);


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
// UserRouter.get('/admin/:email', verifyToken, verifyAdmin, UserController.getOneAdminByEmail);
UserRouter.get('/admin/:email', verifyToken, verifyAdmin, (req, res) => {
  res.status(200).json({ admin: true });
});
// like recipes
UserRouter.get("/:userId/liked-disliked-recettes", UserController. getUserLikedDislikedRecipes);
UserRouter.get('/profile', verifyToken, (req, res) => {
  const user = req.user; // Utilisateur décodé à partir du token
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ user });
});

// UserRouter.get('/profile', verifyToken, UserController.getProfile);

module.exports = UserRouter;
