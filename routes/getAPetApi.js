const express = require("express");
const router = express.Router();

const data = require("../data");
const getAPetData = data.getAPetData;

const path = require("path");

// GET http://localhost:3000/
router.get("/", async (req, res) => {
  try {
    res.status(200).render("homepage");
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

router.get("/login", async (req, res) => {
  res.status(200).render("login");
});

router.get("/signup/sr", async (req, res) => {
  res.status(200).render("shelter&rescueSignup");
});

router.post("/signup/sr", async (req, res) => {
  const signupData = req.body;

  try {
    const newSrUser = await getAPetData.addSr(signupData);
    res.redirect("/");
  } catch (e) {
    res.status(e.status).json({ error: e.error });
  }
});

router.get("/signup/petOwner&petAdopter", async (req, res) => {
  res.status(200).render("petOwner&petAdopterSignup");
});

router.post("/signup/petOwner&petAdopter", async (req, res) => {
  const signupData = req.body;

  try {
    const newPetUser = await getAPetData.addPetOwner(signupData);
    res.redirect("/");
  } catch (e) {
    res.status(e.status).json({ error: e.error });
  }
});
module.exports = router;
