const passport = require("passport");
const Listing = require("../model/listing");
const Review = require("../model/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Login to create a post");
    return res.redirect("/user/login");
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the owner of this listing");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "you are not the owner of this review");
      return res.redirect(`/listing/${id}`);
    }
    next();
  };
  