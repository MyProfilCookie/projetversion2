const express = require("express");
const AdminRouter = express.Router();

const {userAuthorizationHandler,} = require("../Middleware/UserAuthorizationMiddleware");
const {
    authenticateUser
} = require("../Middleware/UserAuthenticationMiddleware");

// controllers 

const AdminController = require("../controllers/adminControllers");

// routes

AdminRouter.get("/info", 
userAuthorizationHandler("admin"), AdminController.getAllInformations);

AdminRouter.get("/stats", 
userAuthorizationHandler("admin"), AdminController.getAllInfoMonth);

AdminRouter.patch("/update-role",
userAuthorizationHandler("admin"),
AdminController.updateUserRole);


module.exports = AdminRouter;