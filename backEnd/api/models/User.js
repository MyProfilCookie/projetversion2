const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      minlenght: 5,
      maxlenght: 100,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlenght: 5,
      maxlenght: 200,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      minlenght: 5,
      maxlenght: 200,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    image: {
      type: String,
      trim: true,
      // required: true,
      minlenght: 5,
      maxlenght: 200,
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
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const User = mongoose.model("user", userSchema);
module.exports = User;
