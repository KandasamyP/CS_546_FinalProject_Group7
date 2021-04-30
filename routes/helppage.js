const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.status(200).render("shelters/helppage", { title: "Help Page" });
    } catch (error) {
        res.render('shelters/error', { title: "No Data Found" });
    }
});
router.post('/', async (req, res) => {
    try {

    } catch (error) {
        res.render('shelters/error', { title: "No Data Found" });
    }
});

module.exports = router;