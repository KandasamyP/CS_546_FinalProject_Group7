const express = require("express");
const router = express.Router();
const petsData = require("../data/pets");

const csvsync = require("csvsync");
const fs = require("fs");
const multer = require("multer"); // required for multer
const { pets } = require("../config/mongoCollections");

/* required for multer --> */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/pets");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // todo find best way to name files if not this. uuid?
  },
});

const upload = multer({ storage: storage });
/* <-- required for multer */

router.get("/pet/:id", async (req, res) => {
  if (!req.params.id) {
    //res.status(404).render("error", {title: "404 Error", error: "No id supplied.", number: "404"});
    return;
  }

  try {
    // This endpoint returns an object that has all the details for a pet with that ID
    const pet = await petsData.getPetById(req.params.id);

    // todo change this to getShelterById and select the shelter name
    const shelterName = pet.associatedShelter;

    const physicalCharacteristics = csvsync.parse(
      fs.readFileSync("data/petInformation/dogPhysical.csv")
    );
    let petPhys = [];
    let petBehavior = [];

    for (let i = 0; i < pet.filters.length; i++) {
      if (physicalCharacteristics[0].includes(pet.filters[i])) {
        petPhys.push(pet.filters[i]);
      } else {
        petBehavior.push(pet.filters[i]);
      }
    }

    res.status(200).render("pets/pets-single", {
      pet,
      physicalCharacteristics: petPhys,
      otherFilters: petBehavior,
      shelterName: shelterName,
    });
  } catch (e) {
    //res.status(404).render("error", { title: "404 Error", error: "No pet was found.", number: 404 });
  }
});

router.post("/search", async (req, res) => {
  try {
    let inputAnimalType = req.body.zipCodeDogs ? "Dog" : "Cat";
    let inputBreeds = req.body.breeds;
    let inputAgeGroups = req.body.ageGroup;
    let inputSex = req.body.sex;
    let inputAppearance = req.body.appearance;
    let inputBehaviors = req.body.behaviors;
    let inputZip = req.body.zipCodeDogs
      ? req.body.zipCodeDogs
      : req.body.zipCodeCats;
    let inputDistance = req.body.distance;

    if (inputBreeds == undefined) {
      inputBreeds = [];
    } else if (!Array.isArray(inputBreeds)) {
      inputBreeds = [inputBreeds];
    }

    if (inputAgeGroups == undefined) {
      inputAgeGroups = [];
    } else if (!Array.isArray(inputAgeGroups)) {
      inputAgeGroups = [inputAgeGroups];
    }

    if (inputSex == undefined) {
      inputSex = [];
    } else if (!Array.isArray(inputSex)) {
      inputSex = [inputSex];
    }

    if (inputAppearance == undefined) {
      inputAppearance = [];
    } else if (!Array.isArray(inputAppearance)) {
      inputAppearance = [inputAppearance];
    }

    if (inputBehaviors == undefined) {
      inputBehaviors = [];
    } else if (!Array.isArray(inputBehaviors)) {
      inputBehaviors = [inputBehaviors];
    }

    let inputFilters = inputAppearance.concat(inputBehaviors);

    if (inputDistance == "") {
      inputDistance = 50; // default to 50 miles if left blank
    }

    let searchResults = await petsData.searchPets(
      inputAnimalType,
      inputBreeds,
      inputAgeGroups,
      inputSex,
      inputFilters,
      inputZip,
      inputDistance
    );

    if (searchResults.length > 0) {
      res.status(200).render("pets/pet-results", {
        searchTerm: inputBreeds,
        pets: searchResults,
      });
    } else {
      res.status(200).render("pets/pet-search");
    }
  } catch (e) {
    res
      .status(500)
      .render("pets/error", { title: "500 Error", number: "500", error: e });
  }
});

/* upload.array(name of item from form submission) is required for multer */
router.post("/add", upload.array("petPictures", 5), async (req, res) => { 
	try {
		let imgArray = [];

		// add file names to an array
		for (let i = 0; i < req.files.length; i++) {
			imgArray.push(req.files[i].filename);
		}

		let breedArray = [];

		// make sure breeds is an array even if one option was chosen
		if (typeof req.body.breeds === "string") {
			breedArray.push(req.body.breeds);
		} else {
			breedArray = req.body.breeds;
		}

		let appearanceArray = [];
		let behaviorsArray = [];

		// make sure filters is an array even if one option was chosen
		if (typeof req.body.appearance === "string") {
			appearanceArray.push(req.body.appearance);
		} else {
			appearanceArray = req.body.appearance;
		}

		if (typeof req.body.behaviors === "string") {
			behaviorsArray.push(req.body.behaviors);
		} else {
			behaviorsArray = req.body.behaviors;
		}

		let filters = appearanceArray.concat(behaviorsArray);

		const newPet = await petsData.addPet(req.body.petName,
			req.body.animalType,
			breedArray,
			imgArray,
			req.body.sex,
			req.body.currentLocation,
			req.body.availableForAdoption === "true" ? true : false,
			req.body.ageGroup,
			req.body.biography,
			"todo", // change to poster's objectid using authentication cookie
			req.body.adoptionFee,
			filters
		);

		console.log(newPet)

		res.redirect(`/pet/${newPet._id}`);
	} catch (e) {
		res.status(500).render("pets/error", { title: "500 Error", number: "500", error: e });
	}
});

router.get("/", async (req, res) => {
  try {
    const dogPhysicalCharacteristics = csvsync.parse(
      fs.readFileSync("data/petInformation/dogPhysical.csv")
    )[0];
    const dogBreeds = csvsync.parse(
      fs.readFileSync("data/petInformation/dogBreeds.csv")
    )[0];
    const catPhysicalCharacteristics = csvsync.parse(
      fs.readFileSync("data/petInformation/catPhysical.csv")
    )[0];
    const catBreeds = csvsync.parse(
      fs.readFileSync("data/petInformation/catBreeds.csv")
    )[0];
    const behaviors = csvsync.parse(
      fs.readFileSync("data/petInformation/behaviors.csv")
    )[0];

    res
      .status(200)
      .render("pets/pet-search", {
        dogBreeds: dogBreeds,
        dogAppearance: dogPhysicalCharacteristics,
        catBreeds: catBreeds,
        catAppearance: catPhysicalCharacteristics,
        behavior: behaviors,
      });
  } catch (e) {
    res
      .status(500)
      .render("pets/error", {
        title: "500 Error",
        number: "500",
        error: "Unknown error occurred.",
      });
  }
});

router.get("/new", async (req, res) => {
  try {
    const dogPhysicalCharacteristics = csvsync.parse(
      fs.readFileSync("data/petInformation/dogPhysical.csv")
    )[0];
    const dogBreeds = csvsync.parse(
      fs.readFileSync("data/petInformation/dogBreeds.csv")
    )[0];
    const catPhysicalCharacteristics = csvsync.parse(
      fs.readFileSync("data/petInformation/catPhysical.csv")
    )[0];
    const catBreeds = csvsync.parse(
      fs.readFileSync("data/petInformation/catBreeds.csv")
    )[0];
    const behaviors = csvsync.parse(
      fs.readFileSync("data/petInformation/behaviors.csv")
    )[0];

    res.status(200).render("pets/pet-add", {
      dogBreeds: dogBreeds,
      dogAppearance: dogPhysicalCharacteristics,
      catBreeds: catBreeds,
      catAppearance: catPhysicalCharacteristics,
      behavior: behaviors,
    });
  } catch (e) {
    res.status(500).render("pets/error", {
      title: "500 Error",
      number: "500",
      error: "Unknown error occurred.",
    });
  }
});

module.exports = router;
