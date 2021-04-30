const express = require("express");
const router = express.Router();
const petsData = require("../data/pets");
const csvsync = require('csvsync');
const fs = require('fs');

router.get("/:id", async (req, res) => {
	if (!req.params.id) {
		//res.status(404).render("error", {title: "404 Error", error: "No id supplied.", number: "404"});
		return;
	}

	try {
		// This endpoint returns an object that has all the details for a pet with that ID
		const pet = await petsData.getPetById(req.params.id);

		// todo change this to getShelterById and select the shelter name
		const shelterName = pet.associatedShelter;

		const physicalCharacteristics = csvsync.parse(fs.readFileSync('data/petInformation/dogPhysical.csv'));
		let petPhys = [];
		let petBehavior = [];

		for (let i = 0; i < pet.filters.length; i++) {
			if (physicalCharacteristics[0].includes(pet.filters[i])) {
				petPhys.push(pet.filters[i]);
			} else {
				petBehavior.push(pet.filters[i]);
			}
		}
		
		res.status(200).render("pets/pets-single", {pet, physicalCharacteristics: petPhys, otherFilters: petBehavior, shelterName: shelterName});
	} catch (e) {
		//res.status(404).render("error", { title: "404 Error", error: "No pet was found.", number: 404 });
	} 
});

router.post("/", async (req, res) => {
	if (req.body.searchTerm.trim().length === 0) {
		res.status(400).render("pets/error", { title: "400 Error", number: "400", error: "You must provide a search term" });
		return;
	}

  	try {
		let searchResults = await searchData.getShowsBySearchTerm(req.body.searchTerm);
		// if search results are empty, the view will state no matches were found
		res.status(200).render("pets/pet-results", { title: "Shows Found", searchTerm: req.body.searchTerm , shows: searchResults });
  	} catch (e) {
    	res.status(500).render("pets/error", { title: "500 Error", number: "500", error: "Unknown error occurred." });
  	}
})


module.exports = router;