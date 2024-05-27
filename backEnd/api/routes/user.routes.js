const express = require("express");
const multer = require("multer");
const UserController = require("../controllers/userControllers");
const { verifyToken} = require("../Middleware/verifyToken");
const { verifyAdmin } = require("../Middleware/verifyAdmin");

const UserRouter = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

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
UserRouter.get("/me", UserController.getMe);
UserRouter.post("/:userId/upload", upload.single('profileImage'), UserController.uploadProfileImage);

module.exports = UserRouter;


// _id
// 6626b2860723d637fb207d86
// username
// "johndoe"
// password
// "securePassword123"
// email
// "johndoe@example.com"

