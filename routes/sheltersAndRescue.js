const express = require("express");
const router = express.Router();

const sheltersData = require("../data/shelterAndRescue");
const petsData = require("../data/pets");
const zipcodes = require('zipcodes');
let { ObjectId } = require('mongodb');
const xss = require('xss');

async function getGeoLocation(zip) {
  let zips = zipcodes.lookup(15211, {
    datafile: "./public/zipcodes.csv",
  });
  return zips;
}

router.get('/', async (req, res) => {
  try {
    const shelter = await shelterAndRescueData.getAll();
    // console.log(shelter)
    res.status(200).render("shelters/allShelters", { shelter, title: "List of shelters" });
  } catch (error) {
    res.render('shelters/error', { title: "No Data Found" });
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
    let petsDetailsArray = [];

    for (let i=0; i< shelter.availablePets.length; ++i) {
      const petsDetails = await petsData.getPetById(shelter.availablePets[i]);
      petsDetailsArray.push(petsDetails);
    }
   

    if (shelter.location && shelter.location.zipCode) {
      let avgReviews = 0, totalReviews = 0;
      for(let i=0; i < shelter.reviews.length; ++i) {
        totalReviews = totalReviews + shelter.reviews[i].rating;
      }

      avgReviews = totalReviews/shelter.reviews.length;

      let reviewDetail = {
        avgReviews: avgReviews,
        totalReviews: shelter.reviews.length
      };

      res.status(200).render("sheltersAndRescue/individual-shelter", {
        shelterDetails: shelter,
        geoLocation: await getGeoLocation(shelter.location.zipCode),
        pet: petsDetailsArray,
        reviewDetail: reviewDetail
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
     
  
      if (shelter.location && shelter.location.zipCode) {
        let avgReviews = 0, totalReviews = 0;
        for(let i=0; i< shelter.reviews.length; ++i) {
          totalReviews += shelter.reviews[i].rating;
        }
        avgReviews = totalReviews/shelter.reviews.length;
  
        let reviewDetail = {
          avgReviews: avgReviews,
          totalReviews: shelter.reviews.length
        };
        console.log(shelter);

        res.status(200).render("sheltersAndRescue/individual-shelter", {
          shelterDetails: shelter,
          geoLocation: await getGeoLocation(shelter.location.zipCode),
          pet: petsDetailsArray,
          reviewDetail: reviewDetail
        });
      } else {
  
        res
          .status(200)
          .render("sheltersAndRescue/individual-shelter", { shelterDetails: shelter, petsDetails: petsDetailsArray });
      }
    } catch (e) {
      console.log("error" +e)

      res.status(404).send(e);
    }
});
module.exports = router;