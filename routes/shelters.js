const express = require("express");
const router = express.Router();
const sheltersData = require("../data/shelters");


router.get("/:id", async (req, res) => {
	if (!req.params.id) {
		//res.status(404).render("error", {title: "404 Error", error: "No id supplied.", number: "404"});
		return;
	}

	try {
	
		const shelter = await sheltersData.getShelterById(req.params.id);

		res.status(200).render("pets/individual-shelter", {shelterDetails: shelter});
	} catch (e) {
		//res.status(404).render("error", { title: "404 Error", error: "No pet was found.", number: 404 });
	} 
});


module.exports = router;
