const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOveride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user");

const reviewRoutes = require("./routes/reviewRoutes");
const listingRoutes = require("./routes/listingRoutes");
const userRoutes = require("./routes/userRoutes");


app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(methodOveride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

//setting ejs module
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.set();

//session options
app.use(
  session({
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const dbUrl = process.env.db_connect_link;


const connectToDB = async () => {
  await mongoose.connect(dbUrl);
};

//database connection
connectToDB()
  .then(() => {
    console.log("db connection succesfull");
  })
  .catch((e) => {
    console.log(e);
  });

//middle-ware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

/* app.get("/demoUser", async(req, res) => {
  const fakeUser = new User({
    email : "user@gmai.com",
    username : "fake User"
  });

  let registeredUser = await User.register(fakeUser, "HelloWorld");
  res.send(registeredUser);
  
}) */

//routes
app.use("/listing/:id/reviews", reviewRoutes);
app.use("/listing", listingRoutes);
app.use("/user", userRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  res.status(statusCode).render("error.ejs", {message});
});



app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
