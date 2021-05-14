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
        res.render("pets/error", {
            title: "Something went wrong!",
            error: e,
        });
    }
});

router.post("/", async (req, res) => {
    try {
        // if user is authenticated, render messages; if not, redirect to login
        if (req.cookies.AuthCookie && req.cookies.AuthCookie.userAuthenticated) {
            let userInfo;
            let isUserShelter;
            if (req.cookies.AuthCookie.userType === "popaUser") {
                userInfo = await petOwnerData.getPetOwnerByUserEmail(req.cookies.AuthCookie.email);
                isUserShelter = false;
            } else {
                userInfo = await shelterAndRescueData.getShelterAndRescueByUserEmail(req.cookies.AuthCookie.email);
                isUserShelter = true;
            }

            const thread = await messagesData.getThreadByParticipants([userInfo._id, req.body.recipient]);
            const newMsg = await messagesData.addMessage(thread._id, userInfo._id, req.body.reply);
            const threadList = await messagesData.getThreadsByParticipant(userInfo._id);
            //console.log(JSON.stringify(threadList))

            res.status(200).render("messages/messages", {
                thread: threadList,
                userId: userInfo._id,
                reloaded: true,
                recipient: req.body.recipient
            });
        } else {
            res.redirect("/login");
        }
    } catch (e) {
        res.render("pets/error", {
            title: "Something went wrong!",
            error: e,
        });
    }
});

module.exports = router;