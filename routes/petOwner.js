const express = require("express");
const router = express.Router();
const petOwnerData = require("../data/petOwner");
const multer = require("multer");
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

//GET --> returns the user document
router.get("/", async (req, res) => {
  try {
    if (req.session.user) {
      var email = req.body.userData.email;

      const petOwner = await petOwnerData.getPetOwnerByUserEmail(email);
       
      // console.log(petOwner);

      // //checking if user has given any shelter reviews
     if (petOwner.shelterReviewsGiven.length != 0) {
        try {
          const shelterReviewsInfo = await petOwnerData.getShelterReviews(
            petOwner._id
          );
          petOwner.shelterReviewsGivenArray = shelterReviewsInfo;
        } catch (e) {
          res.status(e.status).send({error: e.error});
          return;
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
          res.status(e.status).send({error: e.error});
          return;
        }
      }

      res.status(200).render("users/petOwner", {
        petOwner,
        pageTitle: "Pet Owner/Pet Adopter",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile",
       
      });
    }
  } catch (e) {
    res.status(e.status).send({error: e.error});
    return;
  }
});

//POST --> Updates the user profile picture
router.post(
  "/changeProfileImage",
  upload.single("profilePicture"),
  async (req, res) => {
    const imageData = req.body;
    // console.log(req.body);
  
    var email = req.session.user.email;
    const petOwner = await petOwnerData.getPetOwnerByUserEmail(email);
       
      // console.log(petOwner);

      // //checking if user has given any shelter reviews
     if (petOwner.shelterReviewsGiven.length != 0) {
        try {
          const shelterReviewsInfo = await petOwnerData.getShelterReviews(
            petOwner._id
          );
          petOwner.shelterReviewsGivenArray = shelterReviewsInfo;
        } catch (e) {
          res.status(e.status).send({error: e.error});
          return;
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
          res.status(e.status).send({error: e.error});
          return;
        }
      }

    if (!req.file){
      res.status(500).render("users/petOwner", {
        petOwner,
        status: "failed",
        error: "you must provide a picture",
        pageTitle: "Pet Owner/Pet Adopter",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile",
      });
      return
    }
    imageData.profilePicture = req.file.filename;

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
        pageTitle: "Pet Owner/Pet Adopter",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile",
      });
    } catch (e) {
      res.status(500).render("users/petOwner", {
        petOwner: petOwnerDetails,
        status: "failed",
        alertMessage: "Profile Picture Update Failed. Please try again.",
        pageTitle: "Pet Owner/Pet Adopter",
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
      throw {status: 400, error: "Password must be provided"} ;
    }

    if(plainTextPassword.trim().length < 6){
      throw {status: 404, error: "Password must contain at least 6 characters."};
    }

    let email = req.body.userData.email;
    let existingUserData;
    try {
      existingUserData = await petOwnerData.getPetOwnerByUserEmail(email);
    } catch (e) {
      res.status(e.status).send({error: e.error});
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
        pageTitle: "Pet Owner/Pet Adopter",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile",
      });
    } catch (e) {
      res.status(200).render("users/petOwner", {
        petOwner,
        status: "failed",
        alertMessage: "Password Update Failed. Please try again.",
        pageTitle: "Pet Owner/Pet Adopter",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile",
      });
    }
  } catch (e) {
    res.status(e.status).send({error: e.error});
    return;
  }
});

//handles user info changes
router.post("/", async (req, res) => {
  try{
    const petOwnerInfo = req.body;
    console.log(petOwnerInfo);
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
    //console.log(existingUserData);
    const petOwnerDetails = await petOwnerData.getPetOwnerByUserEmail(email);

    // //checking if user has given any shelter reviews
    if (petOwnerDetails.shelterReviewsGiven.length != 0) {
      try {
        const shelterReviewsInfo = await petOwnerData.getShelterReviews(
          petOwnerDetails._id
        );
        petOwnerDetails.shelterReviewsGivenArray = shelterReviewsInfo;
      } catch (e) {
        res.status(e.status).send({error: e.error});
        return;
      }
   }
  
     //checking if user has any favorite pets
     if (petOwnerDetails.favoritedPets.length != 0) {
      try {
        const userFavoritePetsInfo = await petOwnerData.getUserFavoritePets(
          petOwnerDetails.favoritedPets
        );
        petOwnerDetails.favoritedPetsArray = userFavoritePetsInfo;
      } catch (e) {
        res.status(e.status).send({error: e.error});
        return;
      }
    }
  
    if (!petOwnerInfo.firstName || !petOwnerInfo.lastName || !petOwnerInfo.dateOfBirth || !petOwnerInfo.phoneNumber || !petOwnerInfo.zipCode){
      throw {status:404, error: "One of the mandatory fields is missing. generated by /routes/petOwner"};
    }
  
    //checking is zipcode is valid
    if (zipcodes.lookup(petOwnerInfo.zipCode) === undefined) {
      // console.log("Zip code is invalid.");
      // throw {
      //   status: 400,
      //   error:
      //     "Invalid zip code.",
      // };
    
      res.status(200).render("users/petOwner", {
        petOwner: petOwnerDetails,
        pageTitle: "Pet Owner/Pet Adopter",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile",
        error: "Invalid zip code. Please try again."
      });
      return;
    }
  
    const phoneNumberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;  //regex to check phone Number
  
    if(!phoneNumberRegex.test(petOwnerInfo.phoneNumber)){
      res.status(200).render("users/petOwner", {
        petOwner:petOwnerDetails,
        pageTitle: "Pet Owner/Pet Adopter",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile",
        error: "Invalid phone number. Please try again."
      });
      return;
    }
  
    function dateChecker(date1, date2 = new Date()) {
      var date1 = new Date(Date.parse(date1));
      var date2 = new Date(Date.parse(date2));
      var ageTime = date2.getTime() - date1.getTime();
  
      if (ageTime < 0) {
        return false; //date2 is before date1
      } else {
        return true;
      }
    }
      if (!dateChecker(petOwnerInfo.dateOfBirth)) {
        // throw {
        //   status: 400,
        //   error:
        //     "Date of Birth cannot be a future date.",
        // };
        res.status(200).render("users/petOwner", {
          petOwner: petOwnerDetails,
          pageTitle: "Pet Owner/Pet Adopter",
          isLoggedIn: req.body.isLoggedIn,
          script: "userProfile",
          error: "Date of Birth cannot be a future date. Please try again."
        });
        return;
      }
    
    //console.log(existingUserData);
    let updatedData = {};
    //checking if data was updated
    if (existingUserData.fullName.firstName != petOwnerInfo.firstName) {
      updatedData.fullName.firstName = petOwnerInfo.firstName;
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
    //if user updates any data, calling db function to update it in DB
    if (Object.keys(updatedData).length != 0) {
      try {
        updatedData.email = email;
        const petOwnerAddInfo = await petOwnerData.updatePetOwner(updatedData);
        //console.log(petOwnerAddInfo);
        const petOwnerDetails = await petOwnerData.getPetOwnerByUserEmail(email);

        if (petOwnerAddInfo.shelterReviewsGiven.length != 0) {
          try {
            const shelterReviewsInfo = await petOwnerData.getShelterReviews(
              petOwnerDetails._id
            );
            petOwnerAddInfo.shelterReviewsGivenArray = shelterReviewsInfo;
          } catch (e) {
            res.status(e.status).send({error: e.error});
            return;
          }
       }
      
         //checking if user has any favorite pets
         if (petOwnerAddInfo.favoritedPets.length != 0) {
          try {
            const userFavoritePetsInfo = await petOwnerData.getUserFavoritePets(
              petOwnerAddInfo.favoritedPets
            );
            petOwnerAddInfo.favoritedPetsArray = userFavoritePetsInfo;
          } catch (e) {
            res.status(e.status).send({ error: e.error});
            return;
          }
        }
      
        res.status(200).render("users/petOwner", {
          petOwner: petOwnerAddInfo,
          pageTitle: "Pet Owner/Pet Adopter",
          isLoggedIn: req.body.isLoggedIn,
          script: "userProfile",
          status: "success",
          alertMessage: "Information updated successfully."
        });
      } catch (e) {
        res.status(e.status).send({error: e.error});
        return;
      }
    } else {
      //user did not update any data. calling db function to get the existing data
      try {
        const petOwner = await petOwnerData.getPetOwnerByUserEmail(
          email
        );
        if (petOwner.shelterReviewsGiven.length != 0) {
          try {
            const shelterReviewsInfo = await petOwnerData.getShelterReviews(
              petOwner._id
            );
            petOwner.shelterReviewsGivenArray = shelterReviewsInfo;
          } catch (e) {
            res.status(e.status).send({ error: e.error});
            return;
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
            res.status(e.status).send({error: e.error});
            return;
          }
        }
  
        //res.status(200).json(petOwner);
        res.status(200).render("users/petOwner", {
          petOwner,
          pageTitle: "Pet Owner/Pet Adopter",
          isLoggedIn: req.body.isLoggedIn,
          script: "userProfile",
          status: "success",
          alertMessage: "Information updated successfully."
        });
      } catch (e) {
        res.status(e.status).send({error: e.error});
        return;
      }
    }
  }catch(e){
    res.status(e.status).send({error:e.error});
    return;
  }
  
});

//updates the status of isVolunteerCandidate field
router.post("/changeVolunteer", async(req,res)=>{
  try{
    
    if (!req.body.status) { throw {status:400, error: "volunteer status must be provided."} };

    let isVolunteerStatus = req.body.status;
     
    let email = req.body.userData.email;
    let existingUserData;
    try {
        existingUserData = await petOwnerData.getPetOwnerByUserEmail(email);
    } catch (e) {
        res.status(e.status).send({error: e.error});
        return;
    }

    try{
      const petOwner = await petOwnerData.updateVolunteerStatus(existingUserData._id,isVolunteerStatus);
      res.status(200).render("users/petOwner", { petOwner,
        pageTitle: "Pet Owner/Pet Adopter/Pet Adopter",
        isLoggedIn: req.body.isLoggedIn,
        script: "userProfile", 
      alertMessage: "Information updated successfully"});
    }catch(e){
      res.status(e.status).send({error: e.error});
      return;
    }
  }catch(e){
    res.status(e.status).send({error: e.error});
    return;
  }
});

module.exports = router;

