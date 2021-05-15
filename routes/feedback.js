const express = require("express");
const router = express.Router();
const shelterAndRescueData = require("../data/shelterAndRescue");
const petOwnerData = require("../data/petOwner");

router.get("/", async (req, res) => {
  try {
    // if (req.session.user) {
    //     var email = req.body.userData.email;
    //     const shelterOwnerDetails = await shelterAndRescueData.getUserByEmail(email);

    //     res.status(200).render("shelters/feedback", { title: "Feedback" });
    // }
    res.status(200).render("shelters/feedback", {
      title: "Feedback",
      pageTitle: "Feedback",
      isLoggedIn: req.body.isLoggedIn,
      script: "feedback",
    });
  } catch (error) {
    res.status(404).json({ error: "User not found." });
    return;
  }
});
router.post("/", async (req, res) => {
  const feedbackdata = req.body;
  //const session = req.session.user;
  //console.log(req)
  if (
    !feedbackdata.rating ||
    feedbackdata.rating === undefined ||
    feedbackdata.rating.trim() === ""
  ) {
    throw {
      status: 400,
      error: "Please provide a proper rating.",
    };
  }
  if (
    !feedbackdata.experience ||
    feedbackdata.experience === undefined ||
    feedbackdata.experience.trim() === ""
  ) {
    throw {
      status: 400,
      error: "Pease provide a feedback.",
    };
  }
  try {
    if (req.session.user.userType === "srUser") {
      await shelterAndRescueData.updateShelterFeedbackById(req);
    }
    if (req.session.user.userType === "popaUser") {
      await petOwnerData.updatePetOwnerFeedbackById(req);
    }
    res
      .status(200)
      .render("shelters/feedback", {
        title: "Feedback",
        isLoggedIn: req.body.isLoggedIn,
        script: "feedback",
      });
  } catch (e) {
    res.status(e.status).json({ error: e.error });
  }
});

module.exports = router;
