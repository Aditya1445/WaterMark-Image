const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const autoSequencing = require("../middleware/customSequencing");
const Image = require("../models/image-model");
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minLength: [7, "must be atleast 7"],
      trim: true,
      validate(value) {
        if (validator.contains(value.toLowerCase(), "password")) {
          throw new Error("Password cannot contain password");
        }
      },
    },
    Tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
  { _id: false }
);
userSchema.virtual("userImages", {
  ref: "image",
  localField: "_id",
  foreignField: "owner",
});
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isNew) {
    const sequence = await autoSequencing.getNextSequenceValue("user_id");
    if (!sequence) {
      const newId = await autoSequencing.insertCounter("user_id");
      user._id = newId;
    } else {
      console.log("Id", sequence);
      user._id = sequence;
    }
  }
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.Tokens = [...user.Tokens, { token }];
  await user.save();
  return token;
};

userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await userModel.findOne({ email });
  if (user) {
    // check for password

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (isMatch) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("Incorrect Email");
};
userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const user = this;
    await Image.deleteMany({ owner: user._id });
    next();
  }
);
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.Tokens;
  return userObject;
};
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
