const express = require("express");
const router = express.Router();

const data = require("../data");
const getAPetData = data.getAPetData;

const path = require("path");

// GET http://localhost:3000/
router.get("/", async (req, res) => {
  try {
    res.status(200).render("homepage");
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

router.get("/login", async (req, res) => {
  res.status(200).render("login");
});

router.post("/login", async (req, res) => {
  try {
    const logInData = req.body;

    function validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
    const isSuccess = await getAPetData.logInUser(logInData);

    if (isSuccess) {
      res.cookie("AuthCookie", { userAuthenticated: true });
      res.redirect("/");
    } else {
      res.render("login", {
        message: "Wrong Username or Password!",
      });
    }
  } catch (e) {
    res.status(e.status).json({ error: e.error });
  }
});

router.get("/signup/sr", async (req, res) => {
  res.status(200).render("shelter&rescueSignup");
});

router.post("/signup/sr", async (req, res) => {
  try {
    const signupData = req.body;

    function validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

    if (
      signupData.profilePicture === undefined ||
      signupData.profilePicture.trim() === ""
    ) {
      throw {
        status: 400,
        error:
          "Profile Picture public URL not passed - Generated by '/routes/getAPetApi.js'.",
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

    if (signupData.street === undefined || signupData.street.trim() === "") {
      throw {
        status: 400,
        error:
          "Location Street not passed - Generated by '/routes/getAPetApi.js'.",
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
  } catch (e) {
    res.status(e.status).send({ title: "Error", error: e.error });
    return;
  }

  try {
    const signupData = req.body;
    const newSrUser = await getAPetData.addSr(signupData);

    if (newSrUser) {
      res.redirect("/");
    } else {
      res.render("login", {
        message: "User is already registered, please Log In!",
      });
    }
  } catch (e) {
    res.status(e.status).json({ error: e.error });
  }
});

router.get("/signup/popa", async (req, res) => {
  res.status(200).render("petOwner&petAdopterSignup");
});

router.post("/signup/popa", async (req, res) => {
  try {
    const signupData = req.body;

    function validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
        error: "First name not passed - Generated by '/routes/getAPetApi.js'.",
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

    //Phone Number
    function validatePhoneNumber(phoneNumber) {
      const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      return re.test(String(phoneNumber));
    }
    if (signupData.phoneNumber) {
      if (!validatePhoneNumber(signupData.phoneNumber)) {
        throw {
          status: 400,
          error:
            "Phone Number not in correct format - Generated by '/routes/getAPetApi.js'.",
        };
      }
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
    const newPoPa = await getAPetData.addPoPa(signupData);

    if (newPoPa) {
      res.redirect("/");
    } else {
      res.render("login", {
        message: "User is already registered, please Log In!",
      });
    }
  } catch (e) {
    res.status(e.status).json({ error: e.error });
  }
});
module.exports = router;