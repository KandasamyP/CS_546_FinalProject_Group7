console.clear();
const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const session = require("express-session");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


app.use(
  session({
    name: "getAPet",
    secret: "the quick brown fox jumps over the lazy dog",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000 },
  })
);

app.use("/signup", (req, res, next) => {
  if (req.cookies.AuthCookie) {
    return res.redirect("/");
  } else {
    next();
  }
});

// exphbs.registerHelper('loud', function (aString) {
//     return aString.toUpperCase()
// })


configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
