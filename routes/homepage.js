const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios").default;

const data = require("../data");
const petsData = data.pets;
const homepageData = data.homepageData;

/* required for multer --> */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/users");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

//Export Router function
module.exports = router;

// GET '/'
router.get("/", async (req, res) => {
  try {
    var pets = await petsData.getPetHomepage();

    res.status(200).render("homepage/homepage", {
      defaultTitle: true,
      isLoggedIn: req.body.isLoggedIn,
      username: req.body.isLoggedIn ? req.body.userData.email : false,
      pet: pets,
      script: "homepage",
    });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

// GET '/login'

router.get("/login", async (req, res) => {
  try {
    res.status(200).render("homepage/login", {
      pageTitle: "Log In",
      script: "homepage/login",
    });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

// POST '/login'
router.post("/login", async (req, res) => {
  try {
    const logInData = req.body;

    function validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    if (logInData.email === undefined || logInData.email.trim() === "") {
      throw {
        status: 400,
        error: "E-Mail not passed - Generated by '/routes/getAPetApi.js'.",
      };
    }

    if (!validateEmail(logInData.email)) {
      throw {
        status: 400,
        error:
          "E-Mail not in correct format - Generated by '/routes/getAPetApi.js'.",
      };
    }

    if (logInData.password === undefined || logInData.password.trim() === "") {
      throw {
        status: 400,
        error: "Password not passed - Generated by '/routes/getAPetApi.js'.",
      };
    }

    if (!logInData.userType) {
      throw {
        status: 400,
        error: "User type not passed - Generated by '/routes/getAPetApi.js'.",
      };
    }
  } catch (e) {
    res.status(e.status).send({ title: "Error", error: e.error });
    return;
  }

  try {
    const logInData = req.body;
    const isSuccess = await homepageData.logInUser(logInData);

    if (isSuccess) {
      req.session.user = {
        userAuthenticated: true,
        email: logInData.email,
        userType: logInData.userType,
      };
      res.cookie("AuthCookie", {
        userAuthenticated: true,
      });
      res.redirect("/");
      return;
    } else {
      res.render("homepage/login", {
        error: `Wrong Email-ID or Password!`,
        pageTitle: "Log In",
        script: "homepage/login",
      });
      return;
    }
  } catch (e) {
    res.status(e.status).json({ error: e.error });
    return;
  }
});

// GET '/signup/sr'
router.get("/signup/sr", async (req, res) => {
  res.status(200).render("homepage/srSignup", {
    pageTitle: "Signup",
    script: "homepage/srSignup",
    webImportedScript: `//geodata.solutions/includes/statecity.js`,
  });
});

// POST 'signup/sr'
router.post("/signup/sr", upload.single("profilePicture"), async (req, res) => {
  try {
    const signupData = req.body;

    function validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    if (signupData.email === undefined || signupData.email.trim() === "") {
      throw {
        status: 400,
        error: "E-Mail not passed - Generated by '/routes/getAPetApi.js'.",
      };
    }

    if (!validateEmail(signupData.email)) {
      throw {
        status: 400,
        error:
          "E-Mail not in correct format - Generated by '/routes/getAPetApi.js'.",
      };
    }

    if (
      signupData.password === undefined ||
      signupData.password.trim() === ""
    ) {
      throw {
        status: 400,
        error: "Password not passed - Generated by '/routes/getAPetApi.js'.",
      };
    }

    if (signupData.name === undefined || signupData.name.trim() === "") {
      throw {
        status: 400,
        error:
          "Shelter/Rescue name not passed - Generated by '/routes/getAPetApi.js'.",
      };
    }

    if (req.file.filename === undefined || req.file.filename.trim() === "") {
      throw {
        status: 400,
        error:
          "Profile Picture not passed - Generated by '/routes/getAPetApi.js'.",
      };
    }

    if (signupData.state === undefined || signupData.state.trim() === "") {
      throw {
        status: 400,
        error:
          "Location State not passed - Generated by '/routes/getAPetApi.js'.",
      };
    }

    if (signupData.city === undefined || signupData.city.trim() === "") {
      throw {
        status: 400,
        error:
          "Location City not passed - Generated by '/routes/getAPetApi.js'.",
      };
    }

    if (
      signupData.streetAddress1 === undefined ||
      signupData.streetAddress1.trim() === ""
    ) {
      throw {
        status: 400,
        error:
          "Location Street not passed - Generated by '/routes/getAPetApi.js'.",
      };
    }

    if (signupData.zipCode === undefined || signupData.zipCode.trim() === "") {
      throw {
        status: 400,
        error: "Zip Code not passed - Generated by '/routes/getAPetApi.js'.",
      };
    }

    if (signupData.biography === undefined || signupData.biography === "") {
      throw {
        status: 400,
        error: "Biography not passed - Generated by '/routes/getAPetApi.js'.",
      };
    }

    function validatePhoneNumber(phoneNumber) {
      const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      return re.test(String(phoneNumber));
    }

    if (signupData.phoneNumber === undefined) {
      throw {
        status: 400,
        error:
          "Phone Number not passed - Generated by '/routes/getAPetApi.js'.",
      };
    }

    if (!validatePhoneNumber(signupData.phoneNumber)) {
      throw {
        status: 400,
        error:
          "Phone Number not passed in correct format - Generated by '/routes/getAPetApi.js'.",
      };
    }

    try {
      const { data } = await axios.get(
        encodeURI(
          `https://us-street.api.smartystreets.com/street-address?auth-id=33470d7f-96b9-3696-5112-d370eef1e36f&auth-token=FWi7nSCzrbUQmPsX5rGe&street=${signupData.streetAddress1}&street2=${signupData.streetAddress2}&city=${signupData.city}&state=${signupData.state}&zipcode=${signupData.zipCode}`
        )
      );

      if (data.length === 0) {
        res.render("homepage/srSignup", {
          pageTitle: "Signup",
          script: "homepage/srSignup",
          webImportedScript: `//geodata.solutions/includes/statecity.js`,
          error: `Please check your Zip Code for the address: ${signupData.streetAddress1}, ${signupData.city}, ${signupData.state}`,
          email: signupData.email,
          name: signupData.name,
          biography: signupData.biography,
          phoneNumber: signupData.phoneNumber,
          website: signupData.website,
          facebook: signupData.facebook,
          instagram: signupData.instagram,
          twitter: signupData.twitter,
        });
        return;
      }
    } catch (e) {
      throw {
        status: 500,
        error: "Axios call failed '/routes/getAPetApi.js'.",
      };
    }
  } catch (e) {
    res.status(e.status).send({ title: "Error", error: e.error });
    return;
  }
  try {
    const signupData = req.body;
    signupData.profilePicture = req.file.filename;
    const newSrUser = await homepageData.addSr(signupData);

    if (newSrUser) {
      res.redirect("/login");
    } else {
      res.render("homepage/login", {
        pageTitle: "Log In",
        script: "homepage/login",
        error: "User is already registered, please Log In!",
      });
    }
  } catch (e) {
    res.status(e.status).json({ error: e.error });
  }
});

// GET '/signup/popa'
router.get("/signup/popa", async (req, res) => {
  res.status(200).render("homepage/popaSignup", {
    pageTitle: "Signup",
    script: "homepage/popaSignup",
  });
});

// POST 'signup/popa'
router.post(
  "/signup/popa",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const signupData = req.body;

      function validateEmail(email) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }

      if (signupData.email === undefined || signupData.email.trim() === "") {
        throw {
          status: 400,
          error: "E-Mail not passed - Generated by '/routes/getAPetApi.js'.",
        };
      }

      if (!validateEmail(signupData.email)) {
        throw {
          status: 400,
          error:
            "E-Mail not in correct format - Generated by '/routes/getAPetApi.js'.",
        };
      }

      if (
        signupData.password === undefined ||
        signupData.password.trim() === ""
      ) {
        throw {
          status: 400,
          error: "Password not passed - Generated by '/routes/getAPetApi.js'.",
        };
      }

      if (signupData.fname === undefined || signupData.fname.trim() === "") {
        throw {
          status: 400,
          error:
            "First name not passed - Generated by '/routes/getAPetApi.js'.",
        };
      }

      if (signupData.lname === undefined || signupData.lname.trim() === "") {
        throw {
          status: 400,
          error: "Last name not passed - Generated by '/routes/getAPetApi.js'.",
        };
      }

      if (
        signupData.dateOfBirth === undefined ||
        signupData.dateOfBirth.trim() === ""
      ) {
        throw {
          status: 400,
          error: "DOB not passed - Generated by '/routes/getAPetApi.js'.",
        };
      }

      if (req.file.filename === undefined || req.file.filename.trim() === "") {
        throw {
          status: 400,
          error:
            "Profile Picture not passed - Generated by '/routes/getAPetApi.js'.",
        };
      }

      //Phone Number
      function validatePhoneNumber(phoneNumber) {
        const re =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return re.test(String(phoneNumber));
      }

      if (signupData.phoneNumber === undefined) {
        throw {
          status: 400,
          error:
            "Phone Number not passed - Generated by '/routes/getAPetApi.js'.",
        };
      }

      if (!validatePhoneNumber(signupData.phoneNumber)) {
        throw {
          status: 400,
          error:
            "Phone Number not passed in correct format - Generated by '/routes/getAPetApi.js'.",
        };
      }

      function validateZipCode(zipCode) {
        const re = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
        return re.test(String(zipCode));
      }
      if (signupData.zipCode) {
        if (!validateZipCode(signupData.zipCode)) {
          throw {
            status: 400,
            error:
              "Zip Code not in correct format - Generated by '/routes/getAPetApi.js'.",
          };
        }
      }
    } catch (e) {
      res.status(e.status).send({ error: e.error, title: "Error" });
      return;
    }

    try {
      const signupData = req.body;
      signupData.profilePicture = req.file.filename;
      const newPoPa = await homepageData.addPoPa(signupData);

      if (newPoPa) {
        res.redirect("/login");
      } else {
        res.render("homepage/login", {
          pageTitle: "Log In",
          script: "homepage/login",
          message: "User is already registered, please Log In!",
        });
      }
    } catch (e) {
      res.status(e.status).json({ error: e.error });
    }
  }
);

// GET '/logout'
router.get("/logout", async (req, res) => {
  res.clearCookie("AuthCookie");
  req.session.destroy();
  res.status(200).redirect("/");
});
