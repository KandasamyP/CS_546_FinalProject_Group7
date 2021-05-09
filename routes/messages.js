const express = require("express");
const router = express.Router();
const messagesData = require("../data/messages");

router.get("/", async (req, res) => {
    try {
        const threadList = await messagesData.getThreadsByParticipant("asdfghjkl");
        const userId = "asdfghjkl";

        res.status(200).render("messages/messages", {
            thread: threadList,
            userId: userId,
            reloaded: false
        });
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