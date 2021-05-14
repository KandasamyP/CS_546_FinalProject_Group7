const express = require("express");
const router = express.Router();
const petOwnerData = require("../data/petOwner");
const multer = require("multer");

/* required for multer --> */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/popaUsers");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
/* <-- required for multer */

//GET --> returns the user document
router.get("/", async (req, res) => {
  try {
    if (req.session.user) {
      var email = req.body.userData.email;
      const petOwner = await petOwnerData.getPetOwnerByUserEmail(email);
      //checking if user has given any shelter reviews
      if (petOwner.shelterReviewsGiven.length != 0) {
        try {
          const shelterReviewsInfo = await petOwnerData.getShelterReviews(
            petOwner.shelterReviewsGiven,
            petOwner._id
          );
          petOwner.shelterReviewsGivenArray = shelterReviewsInfo;
        } catch (e) {
          //res.status(500).json({ error: "Internal server error." });
        }
      }

      //checking if user has any favorite pets
      if (petOwner.favoritedPets.length != 0) {
        try {
          const userFavoritePetsInfo = await petOwnerData.getUserFavoritePets(
            petOwner.favoritedPets
          );
          petOwner.favoritedPetsArray = userFavoritePetsInfo;
        } catch (e) {
          //res.status(500).json({error: "Internal server error"});
        }
      }

      res.status(200).render("users/petOwner", {
        petOwner,
        pageTitle: "Pet Owner",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile",
      });
    }
  } catch (e) {
    res.status(404).json({ error: "User not found." });
    return;
  }
});

//POST --> Updates the user profile picture
router.post(
  "/changeProfileImage",
  upload.single("profilePicture"),
  async (req, res) => {
    const imageData = req.body;

    imageData.profilePicture = req.file.filename;

    let email = req.session.user.email;
    let petOwnerDetails;
    try {
      petOwnerDetails = await petOwnerData.updateProfileImage(
        email,
        imageData.profilePicture
      );
      res.status(200).render("users/petOwner", {
        petOwner: petOwnerDetails,
        status: "success",
        alertMessage: "Profile Picture Updated Successfully.",
        pageTitle: "Pet Owner",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile",
      });
    } catch (e) {
      res.status(500).render("users/petOwner", {
        petOwner: petOwnerDetails,
        status: "failed",
        alertMessage: "Profile Picture Update Failed. Please try again.",
        pageTitle: "Pet Owner",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile",
      });
    }
  }
);

//handles change password request
router.post("/changePassword", async (req, res) => {
  try {
    let plainTextPassword = req.body.password;
    // console.log(plainTextPassword);
    if (!plainTextPassword || plainTextPassword.trim() === "") {
      throw "Password must be provided";
    }
    let email = req.body.userData.email;
    let existingUserData;
    try {
      existingUserData = await petOwnerData.getPetOwnerByUserEmail(email);
    } catch (e) {
      res.status(404).json({ error: "user not found" });
      return;
    }
    try {
      const petOwner = await petOwnerData.updatePassword(
        existingUserData._id,
        plainTextPassword
      );
      // console.log(petOwner);
      res.status(200).render("users/petOwner", {
        petOwner,
        status: "success",
        alertMessage: "Password Updated Successfully.",
        pageTitle: "Pet Owner",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile",
      });
    } catch (e) {
      res.status(200).render("users/petOwner", {
        petOwner,
        status: "failed",
        alertMessage: "Password Update Failed. Please try again.",
        pageTitle: "Pet Owner",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile",
      });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal server error." });
  }
});

//handles user info changes
router.post("/", async (req, res) => {
  const petOwnerInfo = req.body;
  // console.log("PetOwner Data from form");
  // console.log(petOwnerInfo);
  var email = req.body.userData.email;

  //getting existing data of user
  let existingUserData;
  try {
    existingUserData = await petOwnerData.getPetOwnerByUserEmail(email);
  } catch (e) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  // console.log("existingData");
  // console.log(existingUserData);
  let updatedData = {};
  //checking if data was updated
  if (existingUserData.fullName.firstName != petOwnerInfo.firstName) {
    //updatedData.fullName.firstName = petOwnerInfo.firstName;
    updatedData.fullName = { firstName: petOwnerInfo.firstName, lastName: "" };
  }
  if (existingUserData.fullName.lastName != petOwnerInfo.lastName) {
    if (
      updatedData.fullName &&
      updatedData.fullName.hasOwnProperty("firstName")
    ) {
      updatedData.fullName = {
        lastName: petOwnerInfo.lastName,
        firstName: updatedData.fullName.firstName,
      };
    } else {
      updatedData.fullName = { lastName: petOwnerInfo.lastName, firstName: "" };
    }
  }

  if (existingUserData.dateOfBirth != petOwnerInfo.dateOfBirth) {
    updatedData.dateOfBirth = petOwnerInfo.dateOfBirth;
  }
  if (existingUserData.phoneNumber != petOwnerInfo.phoneNumber) {
    updatedData.phoneNumber = petOwnerInfo.phoneNumber;
  }
  if (existingUserData.zipCode != petOwnerInfo.zipCode) {
    updatedData.zipCode = petOwnerInfo.zipCode;
  }
  if (existingUserData.biography != petOwnerInfo.biography) {
    updatedData.biography = petOwnerInfo.biography;
  }
  // console.log("updateData");
  // console.log(updatedData);
  //if user updates any data, calling db function to update it in DB
  if (Object.keys(updatedData).length != 0) {
    try {
      updatedData.email = email;
      const petOwnerAddInfo = await petOwnerData.updatePetOwner(updatedData);
      res.status(200).render("users/petOwner", {
        petOwner: petOwnerAddInfo,
        pageTitle: "Pet Owner",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile",
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } else {
    //user did not update any data. calling db function to get the existing data
    try {
      const petOwner = await petOwnerData.getPetOwnerByUserEmail(
        petOwnerInfo.email
      );
      //res.status(200).json(petOwner);
      res.status(200).render("users/petOwner", {
        petOwner,
        pageTitle: "Pet Owner",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile",
      });
    } catch (e) {
      res.status(404).json({ error: "User not found." });
    }
  }
});

module.exports = router;
