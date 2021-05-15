const express = require("express");
const router = express.Router();

const sheltersData = require("../data/shelterAndRescue");
const petsData = require("../data/pets");
const zipcodes = require("zipcodes");
let { ObjectId } = require("mongodb");
const xss = require("xss");
const petOwnerData = require("../data/petOwner");

async function getGeoLocation(zip) {
  let zips = zipcodes.lookup(zip, {
    datafile: "./public/zipcodes.csv",
  });
  return zips;
}

router.get("/", async (req, res) => {
  try {
    const shelter = await sheltersData.getAll();
    res.status(200).render("shelters/allShelters", {
      shelter,
      title: "List of shelters",
      pageTitle: "Shelter/Rescue",
      isLoggedIn: req.body.isLoggedIn,
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(404).render("error", {
      title: "404 Error",
      error: "No id supplied.",
      number: "404",
      pageTitle: "Shelter/Rescue",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }


  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw "Request param should be of object id";
    }
    const shelter = await sheltersData.getShelterById(req.params.id);
    let petsDetailsArray = [], adoptedPetsDetailsArray = [];

    for (let i = 0; i < shelter.availablePets.length; ++i) {
      const petsDetails = await petsData.getPetById(shelter.availablePets[i]);
      petsDetailsArray.push(petsDetails);
    }

    for (let i = 0; i < shelter.adoptedPets.length; ++i) {
      const petsDetails = await petsData.getPetById(shelter.adoptedPets[i]);
      adoptedPetsDetailsArray.push(petsDetails);
    }

    
    let avgReviews = 0, totalReviews = 0, userReviewDetail = [];

    for (let i = 0; i < shelter.reviews.length; ++i) {
      if (shelter.reviews[i].reviewer) {
        const petOwnerInfo = await petOwnerData.getPetOwnerById((shelter.reviews[i].reviewer));   
        userReviewDetail.push({
          rating: shelter.reviews[i].rating,
          reviewerName: petOwnerInfo.fullName.firstName + " " + petOwnerInfo.fullName.lastName,
          reviewBody: shelter.reviews[i].reviewBody,
          reviewDate: shelter.reviews[i].reviewDate,
          reviewer: shelter.reviews[i].rating,
        });
      }  else {
          userReviewDetail.push({
            rating: shelter.reviews[i].rating,
            reviewerName: "",
            reviewBody: shelter.reviews[i].reviewBody,
            reviewDate: shelter.reviews[i].reviewDate,
            reviewer: shelter.reviews[i].rating,
          });
        }
      
      totalReviews = totalReviews + parseInt(shelter.reviews[i].rating);
    }

    let reviewDetail = {};

    if (shelter.reviews.length > 0) {
      avgReviews = totalReviews / shelter.reviews.length;
      reviewDetail = {
        avgReviews: avgReviews.toFixed(1),
        totalReviews: shelter.reviews.length,
      };
    } else {
      reviewDetail = {
        avgReviews: 0,
        totalReviews: 0,
      };
    }
    
    let petOwnerDetails;
    if (req.session.user && req.session.user.userType == "popaUser") {
      var email = req.session.user.email;
      const petOwner = await petOwnerData.getPetOwnerByUserEmail(email);

      petOwnerDetails = petOwner;
    }

    if (shelter.location && shelter.location.zipCode) {
      res.status(200).render("sheltersAndRescue/individual-shelter", {
        shelterDetails: shelter,
        geoLocation: await getGeoLocation(shelter.location.zipCode),
        availablePet: petsDetailsArray,
        adoptedPet: adoptedPetsDetailsArray,
        reviewDetail: reviewDetail,
        userReviewDetail: userReviewDetail,
        pageTitle: "Shelter/Rescue",
        isLoggedIn: req.body.isLoggedIn,
        petOwnerDetails: petOwnerDetails,
        script: "individual-shelter",
      });
    } else {
      res.status(200).render("sheltersAndRescue/individual-shelter", {
        shelterDetails: shelter,
        availablePet: petsDetailsArray,
        adoptedPet: adoptedPetsDetailsArray,
        reviewDetail: reviewDetail,
        userReviewDetail: userReviewDetail,
        pageTitle: "Shelter/Rescue",
        isLoggedIn: req.body.isLoggedIn,
        petOwnerDetails: petOwnerDetails,
        script: "individual-shelter",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
    return;
  }
});

router.post("/addReviews/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw "Request param should be of object id";
    }
    const shelter = await sheltersData.updateShelterReviewById(req);
    let petsDetailsArray = [], adoptedPetsDetailsArray = [];
    for (let i = 0; i < shelter.availablePets.length; ++i) {
      const petsDetails = await petsData.getPetById(shelter.availablePets[i]);
      petsDetailsArray.push(petsDetails);
    }

    for (let i = 0; i < shelter.adoptedPets.length; ++i) {
      const petsDetails = await petsData.getPetById(shelter.adoptedPets[i]);
      adoptedPetsDetailsArray.push(petsDetails);
    }
      let avgReviews = 0, totalReviews = 0, userReviewDetail = [];

      for (let i = 0; i < shelter.reviews.length; ++i) {
        if(shelter.reviews[i].reviewer) {
          const petOwnerInfo = await petOwnerData.getPetOwnerById(shelter.reviews[i].reviewer);
          userReviewDetail.push({
            rating: shelter.reviews[i].rating,
            reviewerName: petOwnerInfo.fullName.firstName + " " + petOwnerInfo.fullName.lastName,
            reviewBody: shelter.reviews[i].reviewBody,
            reviewDate: shelter.reviews[i].reviewDate,
            reviewer: shelter.reviews[i].rating,
          });
        } else {
          userReviewDetail.push({
            rating: shelter.reviews[i].rating,
            reviewerName: " ",
            reviewBody: shelter.reviews[i].reviewBody,
            reviewDate: shelter.reviews[i].reviewDate,
            reviewer: shelter.reviews[i].rating,
          });
        }
        totalReviews = totalReviews + parseInt(shelter.reviews[i].rating);
      }
      let reviewDetail;

      if (shelter.reviews.length > 0) {
        avgReviews = totalReviews / shelter.reviews.length;
        reviewDetail = {
          avgReviews: avgReviews.toFixed(1),
          totalReviews: shelter.reviews.length,
        };
       const petOwnerInfo = await petOwnerData.updateShelterReviewsGiven(shelter.reviews[shelter.reviews.length - 1].reviewer, shelter.reviews[shelter.reviews.length - 1]._id);
      } else {
        reviewDetail = {
          avgReviews: 0,
          totalReviews: 0,
        };
      }

      let recentReview = {};

      if(userReviewDetail.length > 0) {
        recentReview = userReviewDetail[userReviewDetail.length - 1];
        recentReview.avgReviews = avgReviews.toFixed(1);
        recentReview.totalReviews = shelter.reviews.length;
      }
      res.status(200).json(recentReview);
   
  } catch (e) {
    res.status(404).send(e);
  } 
});

router.post("/addVolunteer/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw "Request param should be of object id";
    }
    const shelter = await sheltersData.updateVolunteerById(req);
    res.status(200).json(shelter);
  } catch (e) {
    console.log("error" + e);

    res.status(404).send(e);
  } 
});


module.exports = router;
