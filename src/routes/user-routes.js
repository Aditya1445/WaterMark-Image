const express = require("express");
const router = new express.Router();
const userModel = require("../models/user-model");
const Errors = require("../middleware/error");
const auth = require("../middleware/auth");

router.get("/users/signup", (req, res) => {
  res.render("signup");
});

router.get("/users/login", (req, res) => {
  res.render("login");
});
router.get(
  "/users/about",
  auth,
  (req, res) => {
    res.render("about", { userName: req.user.name });
  },
  (err, req, res, next) => {
    res.render("authError", { message: err.message });
  }
);
router.post("/users/signup", async (req, res) => {
  const user = new userModel(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.cookie("jwt", token, { httpOnly: true });
    res.status(201).json({ user, token });
  } catch (e) {
    const error = Errors.handleErrors(e);
    res.status(400).json(error);
  }
});
router.post("/users/login", async (req, res) => {
  try {
    const user = await userModel.findUserByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.cookie("jwt", token, { httpOnly: true });
    res.status(200).json({ user, token });
  } catch (e) {
    const error = Errors.handleErrors(e);
    res.status(400).json({ error });
  }
});

router.get(
  "/users/me",
  auth,
  async (req, res) => {
    try {
      res.json({ user: req.user });
    } catch (e) {
      res.status(500).send(e);
    }
  },
  (err, req, res, next) => {
    res.render("authError", { message: err.message });
  }
);

router.get("/users/logout", auth, async (req, res) => {
  try {
    req.user.Tokens = req.user.Tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.clearCookie("jwt");
    res.redirect("/users/login");
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  console.log('updates', updates)
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((itemsToUpdate) => {
    return allowedUpdates.includes(itemsToUpdate);
  });

  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    const user = req.user;
    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    const err = Errors.handleErrors(error);
    res.status(400).json(err);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = router;
