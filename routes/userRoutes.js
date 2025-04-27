const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../model/user");
const { savedRedirectUrl } = require("../middleWare/middleWare");

router.get("/sign-up", (req, res) => {
  res.render("signUp.ejs");
});

router.post("/sign-up", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({
      username,
      email,
    });
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.logIn(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User registered successfully");
      res.redirect("/listing/allListings");
    });
  } catch (err) {
    console.log(err);
  }
});

//login
router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/login",
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  async (req, res) => {
      req.flash("success", "You have logged in succesfully");
      let redirectUrl = res.locals.redirectUrl || "/listing/allListings"
      res.redirect(redirectUrl);
  }
);

//logout
router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "you have logged out succesfully");
    res.redirect("/listing/allListings");
  });
});
module.exports = router;
