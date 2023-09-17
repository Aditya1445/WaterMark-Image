const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const auth = async function (req, res, next) {
  res.set({
    "Cache-Control": "no-cache, private, no-store, must-revalidate",
  });
  try {
    const token = req.cookies.jwt
    if (!token) {
      throw Error();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "Tokens.token": token,
    });
    if (!user) {
      throw Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    e.message = "Authentication failed";
    next(e);
  }
};

module.exports = auth;
