const express = require("express");
const router = express.Router();
const helppageData = require("../data/helppagedata");

router.get("/", async (req, res) => {
  try {
    res.status(200).render("shelters/helppage", {
      helpfaqdata: helppageData.helpfaqdata,
      helpcarddata: helppageData.helpcarddata,
      title: "Help Page",
      address: helppageData.helpcarddata.address,
      pageTitle: "Help Page",
      isLoggedIn: req.body.isLoggedIn,
    });
  } catch (error) {
    res.render("shelters/error", {
      title: "No Data Found",
      pageTitle: "Help Page",
      isLoggedIn: req.body.isLoggedIn,
    });
  }
});
router.post("/", async (req, res) => {
  try {
  } catch (error) {
    res.render("shelters/error", {
      title: "No Data Found",
      pageTitle: "Help Page",
      isLoggedIn: req.body.isLoggedIn,
    });
  }
});

module.exports = router;
