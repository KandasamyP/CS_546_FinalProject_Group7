const express = require("express");
const router = express.Router();
const shelterUserData = require("../data/shelterUser");
const multer = require("multer");

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
        } catch (e) {}
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
        } catch (e) {}
      }

      //checking if shelter has reviews and retrieving reviewer's name
      if (shelterUser.reviews.length != 0) {
        try {
          const shelterDetails = await shelterUserData.getReviews(
            shelterUser.reviews
          );
          shelterUser.reviews = shelterDetails;
        } catch (e) {}
      }
      res
        .status(200)
        .render("users/shelterUser", {
          shelterUser,
          script: "sheltersProfile",
          pageTitle: "Shelter/Rescue",
          isLoggedIn: req.body.isLoggedIn,
        });
    }
  } catch (e) {
    res.status(404).json({ error: "Shelter User not found." });
    return;
  }
});

//POST --> Updates the shelter's user profile picture
router.post(
  "/changeProfileImage",
  upload.single("profilePicture"),
  async (req, res) => {
    const imageData = req.body;
    // console.log("In routes");
    // console.log(req.session.user);
    imageData.profilePicture = req.file.filename;
    // console.log(req.session.user);
    let email = req.session.user.email;
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
    }
  }
);

//handles change password request
router.post("/changePassword", async (req, res) => {
  try {
    let plainTextPassword = req.body.password;
    //console.log(req.body);
    if (!plainTextPassword || plainTextPassword.trim() === "") {
      throw "Password must be provided";
    }
    let email = req.body.userData.email;

    let existingShelterUserData;
    try {
      existingShelterUserData = await shelterUserData.getPetShelterByEmail(
        email
      );
    } catch (e) {
      res.status(404).json({ error: "shelter user not found" });
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
    }
  } catch (e) {
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/", async (req, res) => {
  const shelterUserInfo = req.body;
  //console.log(shelterUserInfo);

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

    // console.log(shelterUserInfo);
    res.status(200).render("users/shelterUser", {
      shelterUser: shelterUserInfo,
      pageTitle: "Shelter/Rescue",
      isLoggedIn: req.body.isLoggedIn,
      script: "sheltersProfile",
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
