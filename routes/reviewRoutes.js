const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../model/listing");
const Review = require("../model/review");
const { reviewSchema } = require("../schema");
const { isLoggedIn, isAuthor } = require("../middleWare/middleWare");

//validation middle-ware
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
};


// POST route for adding reviews
router.post("/",validateReview, isLoggedIn, async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new review added successfully");
    req.flash("success", "Review added succesfully")
    res.redirect(`/listing/${listing._id}`);
});
  
//delete review route
router.delete("/:reviewId", isLoggedIn, isAuthor, async(req, res) => {
    let {id, reviewId} = req.params;
  
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted succesfully")

  
    res.redirect(`/listing/${id}`)
});

module.exports = router;

