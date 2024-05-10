const express = require("express");
const router = express.Router();
const { User, LoginSchema, SignupSchema } = require("./schema");
const { sign, verify } = require("jsonwebtoken");
const mongoose = require("mongoose");

router.post("/login", async (req, res) => {
  const userLogin = {
    email: req.body.data.email,
    password: req.body.data.password,
  };
  const result = LoginSchema.safeParse(userLogin);
  if (!result.success) {
    res.json({ success: false, message: "User credientials are wrong" });
    return;
  }
  const user = await User.findOne({
    email: userLogin.email,
  });
  if (user) {
    // if exists...
    if (!(user.password === userLogin.password)) {
      res.json({ success: false, message: "Password is incorrect" });
      return;
    }
    const token = sign(userLogin, process.env.JWTSecurityKey);
    res.json({ success: true, id: user._id.toString(), token: token });
    return;
  }
  // if not exists...
  res.json({ success: false, message: "User not found" });
});

router.post("/signup", async (req, res) => {
  const userSignup = {
    username: req.body.data.name,
    email: req.body.data.email,
    password: req.body.data.password,
  };
  const result = SignupSchema.safeParse(userSignup);
  if (!result.success) {
    res.json({ success: false, message: "User credientials are wrong." });
    return;
  }
  // check in DB is user already exists
  const user = await User.findOne({ email: userSignup.email });
  if (user) {
    // if exists...
    res.json({ success: false, message: "User already exists." });
    return;
  }
  // if not exists...
  const newUser = new User({
    ...userSignup,
    images: [],
  });
  await newUser.save();
  const JWTSignup = {
    email: userSignup.email,
    password: userSignup.password,
  };
  const token = sign(JWTSignup, process.env.JWTSecurityKey);
  res.json({
    success: true,
    message: "Account has been created.",
    id: newUser._id.toString(),
    token: token,
  });
});

router.post("/image", async (req, res) => {
  const userId = req.query.id;
  const image = req.body.data.image;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { images: image } },
      { new: true }
    );
    res.json({ success: true, message: "Image Uploaded" });
  } catch (e) {
    res.json({ success: false, message: "Image not Uploaded" });
  }
});

router.get("/details", async (req, res) => {
  const userId = req.query.id;
  try {
    const user = await User.findById(userId);
    if (user) {
      res.json({ success: true, ...user });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

router.post("/verify-user", async (req, res) => {
  const token = req.body.token;
  try {
    verify(token, process.env.JWTSecurityKey);
    res.json({ success: true, message: "User verified" });
  } catch (e) {
    res.json({ success: false, message: "User session expired" });
  }
});

module.exports = router;
