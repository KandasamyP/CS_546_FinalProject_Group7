const express = require("express");
const router = express.Router();
const shelterUserData = require("../data/shelterUser");
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

router.get("/", async (req, res) => {
  try {
    if (req.session.user) {
      var email = req.body.userData.email;
      const shelterUser = await shelterUserData.getPetShelterByEmail(email);
      res.status(200).render("users/shelterUser", { shelterUser });
    }
  } catch (e) {
    res.status(404).json({ error: "Shelter User not found." });
    return;
  }
});

//POST --> Updates the shelter's user profile picture
router.post("/changeProfileImage", upload.single("profilePicture"), async(req,res)=>{
  const imageData = req.body;
 
  imageData.profilePicture = req.file.filename;
  console.log(req.session.user);
  // let email = req.session.user.email;
  // let shelterUserDetails;
  // try{
  //   shelterUserDetails = await petOwnerData.updateShelterProfileImage(email, imageData.profilePicture);
  //    res.status(200).render("users/shelterUser", { petOwner:shelterUserDetails, status: "success", alertMessage: "Profile Picture Updated Successfully." });  
  // }catch(e){
  //   res.status(500).render("users/shelterUser", { petOwner:shelterUserDetails, status: "failed", alertMessage: "Profile Picture Update Failed. Please try again."});
  // }
});

//handles change password request
router.post("/changePassword", async(req,res)=>{
  try{
        let plainTextPassword = req.body.password;
        console.log(req.body);
        if (!plainTextPassword || plainTextPassword.trim() === ""){
            throw "Password must be provided";
        }
        let email = req.cookies.AuthCookie.email;
        let existingUserData;
        try {
            existingUserData = await petOwnerData.getPetOwnerByUserEmail(email);
        } catch (e) {
            res.status(404).json({error: "user not found"});
            return;
        }
        try{
          const petOwner = await petOwnerData.updatePassword(existingUserData._id,plainTextPassword);
          console.log(petOwner);
          res.status(200).render("users/petOwner", { petOwner, status: "success", alertMessage: "Password Updated Successfully." });
        }catch(e){
          res.status(200).render("users/petOwner", { petOwner, status: "failed", alertMessage: "Password Update Failed. Please try again."});
        }
        
    }catch(e){
      res.status(500).json({error: "Internal server error."});
    };
});

router.post("/", async (req, res) => {
  const petOwnerInfo = req.body;
  //console.log(petOwnerInfo);
  //console.log(req);
  //let hashedPassword = await bcrypt.hash(petOwnerInfo.password, saltRounds);
  //console.log(hashedPassword);
  //petOwnerInfo.password = hashedPassword;
  //getting existing data of user
  let existingUserData;
  try {
    existingUserData = await petOwnerData.getPetOwnerByUserEmail(req.cookies.AuthCookie.email);
  } catch (e) {
    res.status(404).json({ error: "user not found" });
    return;
  }

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

  //if user updates any data, calling db function to update it in DB
  if (Object.keys(updatedData).length != 0) {
    try {
      updatedData.email = petOwnerInfo.email;
      const petOwnerAddInfo = await petOwnerData.updatePetOwner(updatedData);
      res.status(200).render("users/petOwner", { petOwner: petOwnerAddInfo });
    } catch (e) {
      res.status(500).json({ error: "Could not update user data." });
    }
  } else {
    //user did not update any data. calling db function to get the existing data
    try {
      const petOwner = await petOwnerData.getPetOwnerByUserEmail(
        petOwnerInfo.email
      );
      //res.status(200).json(petOwner);
      res.status(200).render("users/petOwner", { petOwner });
    } catch (e) {
      res.status(404).json({ error: "User not found." });
    }
  }
});

module.exports = router;