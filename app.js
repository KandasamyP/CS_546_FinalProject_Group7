//Clear server console
console.clear();

//Require Express, Express Handlebars, Express Session & Cookie Parser
const express = require("express");
const moment = require("moment");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const exphbs = require("express-handlebars");
require("dotenv").config();
const xss = require("xss");

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
//Formats for moment.js can be found here: https://momentjs.com/

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: require("./config/handlebars-helpers"),
  })
);
app.set("view engine", "handlebars");

//Create Express Session
app.use(
  session({
    name: "getAPet",
    secret: "the quick brown fox jumps over the lazy dog",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 6000000 },
  })
);

//XSS
app.use("*", (req, res, next) => {
  // console.log(req.method);

  if (req.body) {
    // console.log(req.body);
    Object.keys(req.body).map(function (key, index) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    });
    // console.log(req.body);

    if (req.params) {
      // console.log(req.params);
      Object.keys(req.params).map(function (key, index) {
        if (typeof req.params[key] === "string") {
          req.params[key] = xss(req.params[key]);
        }
      });
      // console.log(req.params);
    }
    next();
  } else {
    next();
  }
});

app.use("*", (req, res, next) => {
  if (req.session.user) {
    req.body.isLoggedIn = true;
    req.body.userData = req.session.user;
    next();
  } else {
    req.body.isLoggedIn = false;
    next();
  }
});

//Middleware: Check if user is already signed in on signup route
app.use("/", (req, res, next) => {
  if (req.session.user) {
    req.body.isLoggedIn = true;
    req.body.userData = req.session.user;
    next();
  } else {
    req.body.isLoggedIn = false;
    next();
  }
});

//Middleware: Check if user is already signed in on signup route
app.use("/signup", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    req.body.isLoggedIn = false;
    next();
  }
});

//Middleware: Check if user is already logged in on login route
app.use("/login", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    req.body.isLoggedIn = false;
    next();
  }
});

//Middleware: Check if user is already signed in on pet search route
/*app.use("/pets", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    next();
  }

});


}); // SH people should be able to do a search without creating an account

//Middleware: Check if user is already signed in on shelters route

app.use("/shelters", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    req.body.userData = req.session.user;
    next();}
});

app.use("/sheltersAndRescue", (req, res, next) => {
  if (!req.cookies.AuthCookie) {
    return res.redirect("/");
  } else {
    next();
  }
});*/

// app.use("/sheltersAndRescue", (req, res, next) => {
//   if (!req.session.user) {
//     return res.redirect("/login");

//   } else {
//     next();
//   }
// });

//Middleware: Check if user is already signed in on profile route
app.use("/profile", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    req.body.userData = req.session.user;
    next();
  }
});

// app.use("/shelters", (req, res, next) => {
//   if (!req.session.user) {
//     return res.redirect("/login");
//   } else {
//     req.body.userData = req.session.user;
//     // console.log(req.body.userData)
//     next();
//   }
// });

app.use("/petOwner", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    req.body.userData = req.session.user;
    next();
  }
});

app.use("/logout", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
});
//Middleware: Check if user is already signed in on feedback route
app.use("/feedback", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    next();
  }
});
//Middleware: Check if user is already signed in on helppage route
app.use("/helppage", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    next();
  }
});

app.use("/profile", (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.userType === "srUser") {
      return res.redirect("/shelterUser");
    } else if (req.session.user.userType === "popaUser") {
      return res.redirect("/petOwner");
    }
    next();
  } else {
    return res.redirect("/login");
  }
});

//Setup Routes
configRoutes(app);

//Start Application
app.listen(process.env.PORT || 3000, () => {
  console.log("We've now got a server!");
});
