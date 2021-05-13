//Clear server console
console.clear();

//Require Express, Express Handlebars, Express Session & Cookie Parser
const express = require("express");
const moment = require("moment");
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
//Formats for moment.js can be found here: https://momentjs.com/

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: {
      formatDate: function (date, format) {
        return moment(date).format(format);
      },
      ifUserIsSender: function (senderId, userId) {
        return senderId === userId ? "user" : "recipient";
      },
      ifMessageSent: function (recipient, participant) {
        if (recipient === participant) {
          return "reloaded";
        }
        return;
      },
      setSenderName: function (
        senderId,
        userId,
        petOwnerName,
        shelterName,
        isUserShelter
      ) {
        if (senderId === userId) {
          return "You";
        } else {
          if (isUserShelter) {
            return petOwnerName;
          } else {
            return shelterName;
          }
        }
      },
      prefillRadioButton: function (originalValue, formValue) {
        if (originalValue === formValue) {
          return "checked";
        } else {
          return "unchecked";
        }
      },
      prefillCheckboxes: function (originalValues, formValue) {
        for (let val of originalValues) {
          if (val === formValue) {
            return "checked";
          }
        }
        return;
      },
    },
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

//Middleware: Check if user is already signed in on signup route
app.use("/", (req, res, next) => {
  if (req.session.user) {
    req.body.userData = req.session.user;
    next();
  } else {
    next();
  }
});

//Middleware: Check if user is already signed in on signup route
app.use("/signup", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
});

//Middleware: Check if user is already logged in on login route
app.use("/login", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  } else {
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

app.use("/sheltersAndRescue", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");

  } else {
    next();
  }
});

//Middleware: Check if user is already signed in on profile route
app.use("/profile", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    req.body.userData = req.session.user;
    next();
  }
});

app.use("/shelters", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    req.body.userData = req.session.user;
   // console.log(req.body.userData)
    next();
  }
});

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

//Setup Routes
configRoutes(app);

//Start Application

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
})
