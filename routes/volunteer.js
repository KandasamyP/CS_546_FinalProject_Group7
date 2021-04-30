const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.status(200).render("shelters/volunteer", { title: "Volunteer Page" });
    } catch (error) {
        res.render('shelters/error', { title: "No Data Found" });
    }
});
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, contactNumber, email, addressLine1, addressLine2, city, state, zipCode, country, explainText } = req.body;
        if (!firstName || !lastName || !contactNumber || !email || !addressLine1 || !addressLine2 || !city || !state || !zipCode || !country || !explainText) throw "Please Provide all the details."
    } catch (error) {
        res.render('shelters/error', { title: "No Data Found" });
    }
});

module.exports = router;