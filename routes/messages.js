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
      return;
    } else {
      res.redirect("/login");
      return;
    }
  } catch (e) {
    res.render("pets/error", {
      title: "Something went wrong!",
      error: e,
      pageTitle: "Messages",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
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

      if (!req.body.recipient) {
        res.render("pets/error", {
          title: "Something went wrong!",
          error: "Recipient is missing",
          pageTitle: "Messages",
          isLoggedIn: req.body.isLoggedIn,
        });
        return;
      }

      if (!req.body.reply) {
        res.render("pets/error", {
          title: "Something went wrong!",
          error: "Reply is missing",
          pageTitle: "Messages",
          isLoggedIn: req.body.isLoggedIn,
        });
        return;
      }

      if (typeof req.body.recipient !== "string" || req.body.recipient.trim().length === 0) {
        res.render("pets/error", {
          title: "Something went wrong!",
          error: "Recipient cannot be empty.",
          pageTitle: "Messages",
          isLoggedIn: req.body.isLoggedIn,
        });
        return;
      }

      if (typeof req.body.reply !== "string" || req.body.reply.trim().length === 0) {
        res.render("pets/error", {
          title: "Something went wrong!",
          error: "Reply is missing",
          pageTitle: "Messages",
          isLoggedIn: req.body.isLoggedIn,
        });
        return;
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

      res.status(200).render("messages/messages", {
        thread: threadList,
        userId: userInfo._id,
        reloaded: true,
        isUserShelter: isUserShelter,
        recipient: req.body.recipient,
        pageTitle: "Messages",
        isLoggedIn: req.body.isLoggedIn,
        script: "messages"
      });
      return;
    } else {
      res.redirect("/login");
      return;
    }
  } catch (e) {
    res.status(500).render("pets/error", {
      title: "Something went wrong!",
      error: e,
      pageTitle: "Messages",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }
});

module.exports = router;