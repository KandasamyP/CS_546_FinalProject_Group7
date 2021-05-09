const express = require("express");
const router = express.Router();
const data = require("../data");
const shelterAndRescueData = data.shelterAndRescueData;
const zipcodes = require("zipcodes");

async function getGeoLocation(zip) {
  let zips = zipcodes.lookup(15211, {
    datafile: "./public/zipcodes.csv",
  });
  return zips;
}

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
    const shelter = await shelterAndRescueData.getShelterById(req.params.id);
    console.log(await getGeoLocation("07307"));
    if (shelter.location && shelter.location.zipCode) {
      res.status(200).render("pets/individual-shelter", {
        shelterDetails: shelter,
        geoLocation: await getGeoLocation(shelter.location.zipCode),
      });
    } else {
      res
        .status(200)
        .render("pets/individual-shelter", { shelterDetails: shelter });
    }

    console.log(shelter);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.get('/', async (req, res) => {
    try {
        const shelter = await sheltersData.getAll();
        // console.log(shelter)
        res.status(200).render("shelters/allShelters", { shelter, title: "List of shelters" });
    } catch (error) {
        res.render('shelters/error', { title: "No Data Found" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        let shelter = await sheltersData.getShelterByID(req.params.id)
        res.status(200).render('shelters/shelterDetails', { title: "Individual Shelter Page" })
    } catch (error) {
        res.status(200).render('shelters/error', { title: "No Such shelter Found" });
        retrun;
    }
});

module.exports = router;