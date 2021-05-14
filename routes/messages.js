const express = require("express");
const router = express.Router();
const messagesData = require("../data/messages");
const shelterAndRescueData = require("../data/shelterAndRescue");
const petOwnerData = require("../data/petOwner");

router.get("/", async (req, res) => {
  try {
    // if user is authenticated, render messages; if not, redirect to login
    if (req.session.user && req.session.user.userAuthenticated) {
      let userInfo;
      let isUserShelter;
      if (req.session.user.userType === "popaUser") {
        userInfo = await petOwnerData.getPetOwnerByUserEmail(
          req.session.user.email
        );
        isUserShelter = false;
      } else {
        userInfo = await shelterAndRescueData.getPetShelterByEmail(
          req.session.user.email
        );
        isUserShelter = true;
      }

      // todo need to check specifically for userType just in case ids overlap
      const threadList = await messagesData.getThreadsByParticipant(
        userInfo._id
      );

      res.status(200).render("messages/messages", {
        thread: threadList,
        userId: userInfo._id,
        reloaded: false,
        isUserShelter: isUserShelter,
        pageTitle: "Messages",
        isLoggedIn: req.body.isLoggedIn,
        script: "messages",
      });
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    res.render("pets/error", {
      title: "Something went wrong!",
      error: e,
      pageTitle: "Messages",
      isLoggedIn: req.body.isLoggedIn,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    // if user is authenticated, render messages; if not, redirect to login
    if (req.session.user && req.session.user.userAuthenticated) {
      let userInfo;
      let isUserShelter;
      if (req.session.user.userType === "popaUser") {
        userInfo = await petOwnerData.getPetOwnerByUserEmail(
          req.session.user.email
        );
        isUserShelter = false;
      } else {
        userInfo = await shelterAndRescueData.getPetShelterByEmail(
          req.session.user.email
        );
        isUserShelter = true;
      }

      const thread = await messagesData.getThreadByParticipants([
        userInfo._id,
        req.body.recipient,
      ]);
      const newMsg = await messagesData.addMessage(
        thread._id,
        userInfo._id,
        req.body.reply
      );

      const threadList = await messagesData.getThreadsByParticipant(
        userInfo._id
      );
      //console.log(JSON.stringify(threadList))

      res.status(200).render("messages/messages", {
        thread: threadList,
        userId: userInfo._id,
        reloaded: true,
        recipient: req.body.recipient,
        pageTitle: "Messages",
        isLoggedIn: req.body.isLoggedIn,
        script: "messages",
      });
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    res.render("pets/error", {
      title: "Something went wrong!",
      error: e,
      pageTitle: "Messages",
      isLoggedIn: req.body.isLoggedIn,
    });
  }
});

module.exports = router;
