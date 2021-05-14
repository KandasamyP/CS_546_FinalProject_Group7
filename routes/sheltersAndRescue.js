const express = require("express");
const router = express.Router();

const sheltersData = require("../data/shelterAndRescue");
const petsData = require("../data/pets");
const zipcodes = require('zipcodes');
let { ObjectId } = require('mongodb');
const xss = require('xss');
const petOwnerData  = require("../data/petOwner");


async function getGeoLocation(zip) {
  let zips = zipcodes.lookup(15211, {
    datafile: "./public/zipcodes.csv",
  });
  return zips;
}

router.get('/', async (req, res) => {
  try {
    const shelter = await sheltersData.getAll();
    // console.log(shelter)
    res.status(200).render("shelters/allShelters", { shelter, title: "List of shelters" });
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
    });
    return;
  }

  try {

    const shelter = await sheltersData.getShelterById(req.params.id);
    let petsDetailsArray = [], adoptedPetsDetailsArray = [];

    for (let i = 0; i < shelter.availablePets.length; ++i) {
      const petsDetails = await petsData.getPetById(shelter.availablePets[i]);
      petsDetailsArray.push(petsDetails);
    }


    for (let i=0; i< shelter.adoptedPets.length; ++i) {
      const petsDetails = await petsData.getPetById(shelter.adoptedPets[i]);
      adoptedPetsDetailsArray.push(petsDetails);
    }



    if (shelter.location && shelter.location.zipCode) {
      let avgReviews = 0, totalReviews = 0, userReviewDetail = [];
      console.log(shelter.reviews)
      for (let i = 0; i < shelter.reviews.length; ++i) {
        const petOwnerInfo = await petOwnerData.getPetOwnerById(shelter.reviews[i].reviewer);

        userReviewDetail.push({
          rating: shelter.reviews[i].rating,
          reviewerName: "John",// petOwnerInfo.fullName.firstName + " " + petOwnerInfo.fullName.lastName,
          reviewBody: shelter.reviews[i].reviewBody,
          reviewDate: shelter.reviews[i].reviewDate,
          reviewer: shelter.reviews[i].rating
        });
        totalReviews = totalReviews + parseInt(shelter.reviews[i].rating);
      }
      console.log(totalReviews);
      console.log(shelter.reviews.length);

      avgReviews = totalReviews / shelter.reviews.length;

      let reviewDetail = {
        avgReviews: avgReviews,
        totalReviews: shelter.reviews.length
      };

      res.status(200).render("sheltersAndRescue/individual-shelter", {
        shelterDetails: shelter,
        geoLocation: await getGeoLocation(shelter.location.zipCode),
        availablePet: petsDetailsArray,
        adoptedPet: adoptedPetsDetailsArray,
        reviewDetail: reviewDetail,
        userReviewDetail: userReviewDetail
      });
    } else {
      res
        .status(200)
        .render("sheltersAndRescue/individual-shelter", { shelterDetails: shelter, petsDetails: petsDetailsArray });
    }
  } catch (e) {
    console.log(e);

    res.status(404).send(e);
  }
});


router.post("/addReviews/:id", async (req, res) => {
  try {
    const shelter = await sheltersData.updateShelterReviewById(req);

    let petsDetailsArray = [];

      for (let i=0; i< shelter.availablePets.length; ++i) {
        const petsDetails = await petsData.getPetById(shelter.availablePets[i]);
        petsDetailsArray.push(petsDetails);
      }
     
      const recentlyAddedReview = shelter.reviews[shelter.reviews.length-1];
      if (shelter.location && shelter.location.zipCode) {
        let avgReviews = 0, totalReviews = 0, userReviewDetail = [];
        for (let i = 0; i < shelter.reviews.length; ++i) {
         // const petOwnerInfo = await petOwnerData.findOne({_id: ObjectId(shelter.reviews[i].reviewer)});
  
          userReviewDetail.push({
            rating: shelter.reviews[i].rating,
            reviewerName: "John",// petOwnerInfo.fullName.firstName + " " + petOwnerInfo.fullName.lastName,
            reviewBody: shelter.reviews[i].reviewBody,
            reviewDate: shelter.reviews[i].reviewDate,
            reviewer: shelter.reviews[i].rating
          });
          totalReviews = totalReviews + parseInt(shelter.reviews[i].rating);
        }
        console.log(totalReviews);
        avgReviews = totalReviews/shelter.reviews.length;
  
        let reviewDetail = {
          avgReviews: avgReviews,
          totalReviews: shelter.reviews.length
        };
        let recentReview = shelter.reviews[shelter.reviews.length - 1];

        //res.status(200).json(recentReview);
        res
          .status(200)
          .json(recentReview);
      } else {
  
        res
          .status(200)
          .render("partials/add-review", { shelterDetails: shelter, petsDetails: petsDetailsArray });
        }
    } catch (e) {
    console.log("error" + e)

    res.status(404).send(e);
  }
});

module.exports = router;