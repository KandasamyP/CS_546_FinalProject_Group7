const express = require("express");
const router = express.Router();
const messagesData = require("../data/messages");
const shelterAndRescueData = require("../data/shelterAndRescue");
const petOwnerData = require("../data/petOwner");

router.get("/", async (req, res) => {
    try {
        // if user is authenticated, render messages; if not, redirect to login
        if (req.cookies.AuthCookie && req.cookies.AuthCookie.userAuthenticated) {
            let userInfo;
            let isUserShelter;
            //todo add another if condition to check if it's an sr or pet owner user
            if (req.cookies.AuthCookie.userType === "popaUser") {
                userInfo = await petOwnerData.getPetOwnerByUserEmail(req.cookies.AuthCookie.email);
                isUserShelter = false;
            } else {
                userInfo = await shelterAndRescueData.getShelterAndRescueByUserEmail(req.cookies.AuthCookie.email);
                isUserShelter = true;
            }

            // todo need to check specifically for userType just in case ids overlap
            const threadList = await messagesData.getThreadsByParticipant(userInfo._id);

            res.status(200).render("messages/messages", {
                thread: threadList,
                userId: userInfo._id,
                reloaded: false,
                isUserShelter: isUserShelter
            });
        } else {
            res.redirect("login");
        }
    } catch (e) {
        res.status(500).render("pets/error", {
          title: "500 Error",
          number: "500",
          error: e,
        });
    }
});

router.post("/", async (req, res) => {
    //console.log(req.body)
    const threadId = await messagesData.getThreadByParticipants(["asdfghjkl", req.body.recipient]);
    const newMsg = await messagesData.addMessage(threadId, "asdfghjkl", req.body.reply);

    const threadList = await messagesData.getThreadsByParticipant("asdfghjkl");
    const userId = "asdfghjkl";
    //console.log(newMsg)

    res.status(200).render("messages/messages", {
        thread: threadList,
        userId: userId,
        reloaded: true,
        recipient: req.body.recipient
    });
    /*try {
        const threadList = await messagesData.getThreadsByParticipant("asdfghjkl");
        const userId = "asdfghjkl";

        res.status(200).render("messages/messages", {
            thread: threadList,
            userId: userId
        });
    } catch (e) {
        res.status(500).render("pets/error", {
          title: "500 Error",
          number: "500",
          error: e,
        });
    }*/
});

module.exports = router;