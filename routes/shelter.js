const express = require("express");
const router = express.Router();
const sheltersData = require("../data/shelter");

router.get('/', async (req, res) => {
    try {
        const shelter = await sheltersData.getAll();
        // console.log(shelter)
        res.status(200).render("shelters/allShelters", { shelter });
    } catch (error) {
        res.render('shelters/error', { title: "No Data Found" });
    }
});

// router.get('/:id', async (req, res) => {
//     try {
//         let shelter = await sheltersData.getShelterByID(req.params.id)
//         res.render('shelter/shelterDetails')
//     } catch (error) {
//         res.render('shelters/error', { title: "No Such shelter Found" });
//         retrun;
//     }
// });

// router.post('/search', async (req, res) => {
//     try {

//     } catch (error) {
//         res.render('shelters/error', { title: "No Such shelter Found" });
//         retrun;
//     }
// });

// router.post("/", async (req, res) => {
//     try {

//     } catch (error) {
//         res.render('shelters/error', { title: "No Such shelter Found" });
//         retrun;
//     }
// });
module.exports = router;