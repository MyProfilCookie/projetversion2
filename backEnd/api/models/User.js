const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// ADMIN_EMAIL est l'email de l'administrateur
const ADMIN_EMAIL = "virginie.ayivor@3wa.io";

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 200,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 200,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isAdmin: { type: Boolean, default: false },
    image: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    likedRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recette",
      },
    ],
    dislikedRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recette",
      },
    ],
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
  },
  { timestamps: true }
);

// Crypte le mot de passe de l'utilisateur avant de l'enregistrer dans la base de données
userSchema.pre("save", async function (next) {
  const user = this;

  // Assigne le role 'admin' à l'utilisateur si l'email correspond à l'administrateur
  if (user.email === ADMIN_EMAIL) {
    user.role = "admin";
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
