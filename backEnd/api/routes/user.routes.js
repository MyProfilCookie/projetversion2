const express = require("express");
const UserRouter = express.Router();

// Controllers
const UserController = require("../controllers/userControllers");
const {checkRegisterInput, checkLoginInput, checkUserUpdateInput} = require("../Validation/UserDataRules");
// const {inputValidationMiddleware} = require("../Validation/ValidationMiddleware");
// const {
//     userAuthorizationHandler,
   
// } = require("../Middleware/UserAuthorizationMiddleware");


// toutes les recettes d'un utilisateur
UserRouter.route("/")
    .get(UserController.getAllUsers)
    .patch(UserController.updateUser)
    .delete(UserController.deleteAllUsers);

UserRouter.route("/:id")
    .get(UserController.getOneUser)
    .delete(UserController.deleteUser);

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

