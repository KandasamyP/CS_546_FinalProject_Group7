//Clear server console
console.clear();

//Require Express, Express Handlebars, Express Session & Cookie Parser
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const exphbs = require("express-handlebars");

//Setup Static Folder and Routes File
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");

//Setup Express App & Middleware
const app = express();
app.use("/public", static);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setup Express View Engine as Express Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Create Express Session
app.use(
  session({
    name: "getAPet",
    secret: "the quick brown fox jumps over the lazy dog",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000 },
  })
);

//Middleware: Check if user is already signed in on signup route
app.use("/signup", (req, res, next) => {
  if (req.cookies.AuthCookie) {
    return res.redirect("/");
  } else {
    next();
  }
});

//Middleware: Check if user is already signed in on pet search route
app.use("/pets", (req, res, next) => {
  if (!req.cookies.AuthCookie) {
    return res.redirect("/");
  } else {
    next();
  }
});
//Middleware: Check if user is already signed in on shelters route
app.use("/shelters", (req, res, next) => {
  if (!req.cookies.AuthCookie) {
    return res.redirect("/");
  } else {
    next();
  }
});
//Middleware: Check if user is already signed in on profile route
app.use("/profile", (req, res, next) => {
  if (!req.cookies.AuthCookie) {
    return res.redirect("/");
  } else {
    next();
  }
});

//Setup Routes
configRoutes(app);

//Start Application

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
