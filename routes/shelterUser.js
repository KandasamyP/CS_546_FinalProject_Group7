const express = require("express");
const router = express.Router();
const shelterUserData = require("../data/shelterUser");
const multer = require("multer");
const data = require("../data");
const axios = require("axios").default;
const zipcodes = require("zipcodes");

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
/* <-- required for multer */

router.get("/", async (req, res) => {
  try {
    if (req.session.user) {
      var email = req.session.user.email;

      const shelterUser = await shelterUserData.getPetShelterByEmail(email);
      //checking if shelter has available pets
      if (shelterUser.availablePets.length != 0) {
        try {
          const shelterAvailablePets = await shelterUserData.getPetsData(
            shelterUser.availablePets
          );
          shelterUser.availablePetsArray = shelterAvailablePets;
        } catch (e) {
          res.status(e.status).json({ error: e.error });
          return;
        }
      }

      //checking if shelter has available pets
      if (shelterUser.adoptedPets.length != 0) {
        try {
          const shelterAdoptedPets = await shelterUserData.getPetsData(
            shelterUser.adoptedPets
          );
          shelterUser.adoptedPetsArray = shelterAdoptedPets;
          // for (let i = 0; i < shelterAdoptedPets.length; i++)
          //   console.log(shelterAdoptedPets[i]);
        } catch (e) {
          res.status(e.status).json({ error: e.error });
          return;
        }
      }

      //checking if shelter has reviews and retrieving reviewer's name
      if (shelterUser.reviews.length != 0) {
        try {
          const shelterDetails = await shelterUserData.getReviews(
            shelterUser.reviews
          );
          shelterUser.reviews = shelterDetails;
        } catch (e) {
          res.status(e.status).json({ error: e.error });
          return;
        }
      }
      res.status(200).render("users/shelterUser", {
        shelterUser,
        script: "sheltersProfile",
        pageTitle: "Shelter/Rescue",
        isLoggedIn: req.body.isLoggedIn,
      });
    }
  } catch (e) {
    res.status(e.status).json({ error: e.error });
    return;
  }
});

//POST --> Updates the shelter's user profile picture
router.post(
  "/changeProfileImage",
  upload.single("shelterprofilePicture"),
  async (req, res) => {
    const imageData = req.body;
    let email = req.session.user.email;

    const shelterUser = await shelterUserData.getPetShelterByEmail(email);
      //checking if shelter has available pets
      if (shelterUser.availablePets.length != 0) {
        try {
          const shelterAvailablePets = await shelterUserData.getPetsData(
            shelterUser.availablePets
          );
          shelterUser.availablePetsArray = shelterAvailablePets;
        } catch (e) {
          res.status(e.status).json({ error: e.error });
          return;
        }
      }

      //checking if shelter has available pets
      if (shelterUser.adoptedPets.length != 0) {
        try {
          const shelterAdoptedPets = await shelterUserData.getPetsData(
            shelterUser.adoptedPets
          );
          shelterUser.adoptedPetsArray = shelterAdoptedPets;
          // for (let i = 0; i < shelterAdoptedPets.length; i++)
          //   console.log(shelterAdoptedPets[i]);
        } catch (e) {
          res.status(e.status).json({ error: e.error });
          return;
        }
      }

      //checking if shelter has reviews and retrieving reviewer's name
      if (shelterUser.reviews.length != 0) {
        try {
          const shelterDetails = await shelterUserData.getReviews(
            shelterUser.reviews
          );
          shelterUser.reviews = shelterDetails;
        } catch (e) {
          res.status(e.status).json({ error: e.error });
          return;
        }
      }

    if (!req.file){
      res.status(500).render("users/shelterUser", {
        shelterUser,
        status: "failed",
        error: "you must provide a picture",
        pageTitle: "Shelter/Rescue",
        isLoggedIn: req.body.isLoggedIn,
        script: "sheltersProfile",
      });
      return
    }
    imageData.profilePicture = req.file.filename;
    // console.log(req.session.user);
    let shelterUserDetails;
    try {
      shelterUserDetails = await shelterUserData.updateShelterProfileImage(
        email,
        imageData.profilePicture
      );
      // console.log(shelterUserDetails.profilePicture);
      res.status(200).render("users/shelterUser", {
        shelterUser: shelterUserDetails,
        status: "success",
        alertMessage: "Profile Picture Updated Successfully.",
        pageTitle: "Shelter/Rescue",
        isLoggedIn: req.body.isLoggedIn,
        script: "sheltersProfile",
      });
    } catch (e) {
      res.status(500).render("users/shelterUser", {
        shelterUser: shelterUserDetails,
        status: "failed",
        alertMessage: "Profile Picture Update Failed. Please try again.",
        pageTitle: "Shelter/Rescue",
        isLoggedIn: req.body.isLoggedIn,
        script: "sheltersProfile",
      });
      return;
    }
  }
);

//handles change password request
router.post("/changePassword", async (req, res) => {
  try {
    let plainTextPassword = req.body.shelterPassword;
    //console.log(req.body);
    if (!plainTextPassword || plainTextPassword.trim() === "") {
      throw {
        status: 404,
        error:
          "Password must be provided. Generated from /routes/shelterUser.js/changePassword",
      };
    }

    if (plainTextPassword.trim().length < 6) {
      throw {
        status: 404,
        error:
          "Password must contain at least 6 characters. Generated from /routes/shelterUser.js/changePassword",
      };
    }
    let email = req.body.userData.email;

    let existingShelterUserData;
    try {
      existingShelterUserData = await shelterUserData.getPetShelterByEmail(
        email
      );
    } catch (e) {
      res.status(e.status).send({ error: e.error });
      return;
    }
    //console.log(existingShelterUserData._id);
    try {
      const shelterData = await shelterUserData.updatePassword(
        existingShelterUserData._id,
        plainTextPassword
      );
      res.status(200).render("users/shelterUser", {
        shelterUser: shelterData,
        status: "success",
        alertMessage: "Password Updated Successfully.",
        pageTitle: "Shelter/Rescue",
        isLoggedIn: req.body.isLoggedIn,
        script: "sheltersProfile",
      });
    } catch (e) {
      res.status(500).render("users/shelterUser", {
        shelterUser: shelterData,
        status: "failed",
        alertMessage: "Password Update Failed. Please try again.",
        pageTitle: "Shelter/Rescue",
        isLoggedIn: req.body.isLoggedIn,
        script: "sheltersProfile",
      });
      return;
    }
  } catch (e) {
    res.status(e.status).json({ error: e.error });
    return;
  }
});

router.post("/", async (req, res) => {
  try {
    const shelterUserInfo = req.body;
    let email = req.body.userData.email;

    let existingShelterUserData;
    try {
      existingShelterUserData = await shelterUserData.getPetShelterByEmail(
        email
      );
    } catch (e) {
      res.status(e.status).send({ error: e.error });
      return;
    }

    const shelterUser = await shelterUserData.getPetShelterByEmail(email);
    //checking if shelter has available pets
    if (shelterUser.availablePets.length != 0) {
      try {
        const shelterAvailablePets = await shelterUserData.getPetsData(
          shelterUser.availablePets
        );
        shelterUser.availablePetsArray = shelterAvailablePets;
      } catch (e) {
        res.status(e.status).json({ error: e.error });
        return;
      }
    }

    //checking if shelter has available pets
    if (shelterUser.adoptedPets.length != 0) {
      try {
        const shelterAdoptedPets = await shelterUserData.getPetsData(
          shelterUser.adoptedPets
        );
        shelterUser.adoptedPetsArray = shelterAdoptedPets;
        // for (let i = 0; i < shelterAdoptedPets.length; i++)
        //   console.log(shelterAdoptedPets[i]);
      } catch (e) {
        res.status(e.status).json({ error: e.error });
        return;
      }
    }

    //checking if shelter has reviews and retrieving reviewer's name
    if (shelterUser.reviews.length != 0) {
      try {
        const shelterDetails = await shelterUserData.getReviews(
          shelterUser.reviews
        );
        shelterUser.reviews = shelterDetails;
      } catch (e) {
        res.status(e.status).json({ error: e.error });
        return;
      }
    }
    //console.log(shelterUserInfo);
    if (
      shelterUserInfo.name === undefined ||
      shelterUserInfo.name.trim() === ""
    ) {
      // throw {
      //   status: 400,
      //   error:
      //     "Shelter/Rescue name not passed - Generated by '/routes/shelterUser.js'.",
      // };

      res.status(400).render("users/shelterUser", {
        shelterUser: shelterUser,
        error: "Shelter/Rescue name not passed.Please try again",
        pageTitle: "Shelter/Rescue",
        isLoggedIn: req.body.isLoggedIn,
        script: "sheltersProfile",
      });
      return;
    }

    if (
      shelterUserInfo.phoneNumber === undefined ||
      shelterUserInfo.phoneNumber.trim() === ""
    ) {
      // throw {
      //   status: 400,
      //   error:
      //     "Shelter/Rescue phone number not passed - Generated by '/routes/shelterUser.js'.",
      // };
      res.status(400).render("users/shelterUser", {
        shelterUser: shelterUser,
        error: "Shelter/Rescue phone number not passed.Please try again",
        pageTitle: "Shelter/Rescue",
        isLoggedIn: req.body.isLoggedIn,
        script: "sheltersProfile",
      });
      return;
    }
    function validatePhoneNumber(phoneNumber) {
      const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      return re.test(String(phoneNumber));
    }

    if (!validatePhoneNumber(shelterUserInfo.phoneNumber)) {
      // throw{
      //   status: 400,
      //   error:
      //     "Shelter/Rescue phone number not passed in correct format- Generated by '/routes/shelterUser.js'.",
      // }
      res.status(400).render("users/shelterUser", {
        shelterUser: shelterUser,
        error: "Invalid phone number. Please try again",
        pageTitle: "Shelter/Rescue",
        isLoggedIn: req.body.isLoggedIn,
        script: "sheltersProfile",
      });
      return;
    }

    if (
      shelterUserInfo.streetAddress1 == undefined ||
      shelterUserInfo.streetAddress1.trim() == ""
    ) {
      throw {
        status: 400,
        error:
          "Street Address line 1 not passed.Generated by '/routes/shelterUser.js' ",
      };
    }

    if (
      shelterUserInfo.city == undefined ||
      shelterUserInfo.city.trim() == ""
    ) {
      throw {
        status: 400,
        error: "city not passed.Generated by '/routes/shelterUser.js' ",
      };
    }

    if (
      shelterUserInfo.stateCode == undefined ||
      shelterUserInfo.stateCode.trim() == ""
    ) {
      throw {
        status: 400,
        error: "state code not passed.Generated by '/routes/shelterUser.js' ",
      };
    }

    if (
      shelterUserInfo.zipCode == undefined ||
      shelterUserInfo.zipCode.trim() == ""
    ) {
      throw {
        status: 400,
        error: "zip code not passed.Generated by '/routes/shelterUser.js' ",
      };
    }

    //checking is zipcode is valid
    if (zipcodes.lookup(shelterUserInfo.zipCode) === undefined) {
      // console.log("Zip code is invalid.");
      // throw {
      //   status: 400,
      //   error:
      //     "Invalid zip code. Generated by '/routes/shelterUser.js'",
      // };
      res.status(400).render("users/shelterUser", {
        shelterUser: shelterUser,
        error: "Invalid zip code. Please try again",
        pageTitle: "Shelter/Rescue",
        isLoggedIn: req.body.isLoggedIn,
        script: "sheltersProfile",
      });
      return;
    }

    try {
     
      const { data } = await axios.get(
        encodeURI(
          `https://us-street.api.smartystreets.com/street-address?auth-id=33470d7f-96b9-3696-5112-d370eef1e36f&auth-token=FWi7nSCzrbUQmPsX5rGe&street=${shelterUserInfo.streetAddress1}&street2=${shelterUserInfo.streetAddress2}&city=${shelterUserInfo.city}&state=${shelterUserInfo.stateCode}&zipcode=${shelterUserInfo.zipCode}`
        )
      );
      // console.log("data");
      // console.log(data);
      if (data.length === 0) {
        res.render("users/shelterUser", {
          shelterUser: shelterUser,
          pageTitle: "Shelter/Rescue",
          isLoggedIn: req.body.isLoggedIn,
          script: "sheltersProfile",
          webImportedScript: `//geodata.solutions/includes/statecity.js`,
          error: `Address entered : ${shelterUserInfo.streetAddress1}, ${shelterUserInfo.streetAddress2} ,${shelterUserInfo.city}, ${shelterUserInfo.stateCode}, ${shelterUserInfo.zipCode} is invalid. Please enter an valid address.`,
        });
        return;
      }
    } catch (e) {
      throw {
        status: 500,
        error: "Axios call failed '/routes/shelterUser.js'.",
      };
    }

    updatedData = {
      name: shelterUserInfo.name,
      phoneNumber: shelterUserInfo.phoneNumber,
      location: {
        streetAddress1: shelterUserInfo.streetAddress1,
        streetAddress2: shelterUserInfo.streetAddress2,
        city: shelterUserInfo.city,
        stateCode: shelterUserInfo.stateCode,
        zipCode: shelterUserInfo.zipCode,
      },
      website: shelterUserInfo.website,
      socialMedia: {
        twitter: shelterUserInfo.twitter,
        facebook: shelterUserInfo.facebook,
        instagram: shelterUserInfo.instagram,
      },
      biography: shelterUserInfo.biography,
    };

    // console.log(updatedData);
    // console.log(req.body.userData.email);

    try {
      const shelterUserInfo = await shelterUserData.updateShelter(
        updatedData,
        req.body.userData.email
      );
      console.log(shelterUserInfo);
      //const shelterUser = await shelterUserData.getPetShelterByEmail(email);
      //checking if shelter has available pets
      if (shelterUserInfo.availablePets.length != 0) {
        try {
          const shelterAvailablePets = await shelterUserData.getPetsData(
            shelterUserInfo.availablePets
          );
          shelterUserInfo.availablePetsArray = shelterAvailablePets;
        } catch (e) {
          res.status(e.status).json({ error: e.error });
          return;
        }
      }

      //checking if shelter has available pets
      if (shelterUserInfo.adoptedPets.length != 0) {
        try {
          const shelterAdoptedPets = await shelterUserData.getPetsData(
            shelterUserInfo.adoptedPets
          );
          shelterUserInfo.adoptedPetsArray = shelterAdoptedPets;
          // for (let i = 0; i < shelterAdoptedPets.length; i++)
          //   console.log(shelterAdoptedPets[i]);
        } catch (e) {
          res.status(e.status).json({ error: e.error });
          return;
        }
      }

      // console.log(shelterUserInfo);
      res.status(200).render("users/shelterUser", {
        shelterUser: shelterUserInfo,
        pageTitle: "Shelter/Rescue",
        isLoggedIn: req.body.isLoggedIn,
        script: "sheltersProfile",
        alertMessage: "Infomation updated successfully",
      });
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  } catch (e) {
    res.status(e.status).json({ error: e.error });
    return;
  }
});

module.exports = router;
