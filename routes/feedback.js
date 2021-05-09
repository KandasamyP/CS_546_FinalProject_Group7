const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.status(200).render("shelters/feedback", { title: "Feedback" });
    } catch (error) {
        res.render('shelters/error', { title: "No Data Found" });
    }
});
router.post('/', async (req, res) => {
    const { inlineRadioOptions, experience } = req.body
    if (!inlineRadioOptions) throw "Please provide a rating."
    try {

    } catch (error) {
        res.render('shelters/error', { title: "Error." });
    }
});

module.exports = router;