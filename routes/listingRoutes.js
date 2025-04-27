const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../model/listing");
const { isLoggedIn, isOwner } = require("../middleWare/middleWare");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
require("dotenv").config();

router.get("/", (req, res) => {
  res.send("welcome to WonderLust");
});

//index route
router.get("/allListings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
});

//add route
router.get("/new", async (req, res) => {
  res.render("newList.ejs");
});

router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  async (req, res, next) => {
    try {
      let url = req.file.path;
      let filename = req.file.filename;
      console.log(url, "...", filename);
      let newList = new Listing(req.body.listing);
      newList.author = req.user._id;
      newList.image = { url, filename };

      await newList.save();
      req.flash("success", "New listing created");
      res.redirect("/listing/allListings");
    } catch (err) {
      next(err);
    }
  }
);

//show route
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const findListById = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  res.render("show.ejs", { findListById });
});

//edit route
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const listDetails = await Listing.findById(id);
  if (!listDetails) {
    req.flash("error", "Listing you requsted for does not exist");
    res.redirect("/allListings");
  }
  let originalImgUrl = listDetails.image.url;
  originalImgUrl = originalImgUrl.replace("/upload", "/upload/h_200,w_250");

  res.render("edit.ejs", { listDetails, originalImgUrl });
});

//update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  async (req, res) => {
    const { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      console.log(url, "...", filename);
      listing.image = { url, filename };
      await listing.save();
    }
    req.flash("success", "Listing edited succesfully");
    res.redirect(`/listing/${id}`);
  }
);

//delete route
router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
  const { id } = req.params;
  const result = await Listing.findByIdAndDelete(id);
  console.log(result);
  req.flash("success", "Listing deleted succesfully");
  res.redirect("/listing/allListings");
});



module.exports = router;
