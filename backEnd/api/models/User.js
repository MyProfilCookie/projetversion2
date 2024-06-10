const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

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
    image: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    likers: {
      type: [String],
      required: true,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  
  if (user.email === ADMIN_EMAIL) {
    user.role = "admin";
  }
  
  next();
});

/*userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});
*/
const User = mongoose.model("User", userSchema);

module.exports = User;