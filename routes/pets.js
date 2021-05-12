const express = require("express");
const router = express.Router();
const petsData = require("../data/pets");
const shelterData = require("../data/shelterAndRescue");
const petOwnerData = require("../data/petOwner");
const messagesData = require("../data/messages");
const zipcodes = require("zipcodes");

const csvsync = require("csvsync");
const fs = require("fs");
const multer = require("multer"); // required for multer
const { pets } = require("../config/mongoCollections");
const session = require("express-session");

/* required for multer --> */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/pets");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
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
    // only pet owner/adopter accounts can message shelters, so even a logged in SR user will
    // have authentication set to false for this page
    let authenticatedPetOwner = false;
    let userId;
    let isUserThisShelter = false;
    const sessionInfo = req.cookies.AuthCookie;

    // This endpoint returns an object that has all the details for a pet with that ID
    let pet = await petsData.getPetById(req.params.id);

    if (sessionInfo && sessionInfo.userAuthenticated) {
      if (sessionInfo.userType === "popaUser") {
        authenticatedPetOwner = true;
        const userInfo = await petOwnerData.getPetOwnerByUserEmail(sessionInfo.email);
        userId = userInfo._id;
      } else {
        const userInfo = await shelterData.getShelterAndRescueByUserEmail(sessionInfo.email);
        userId = userInfo._id;
        if (userId === pet.associatedShelter) {
          isUserThisShelter = true;
        }
      }
    }

    let currentLoc = zipcodes.lookup(pet.currentLocation);
    let cityState = currentLoc.city + ", " + currentLoc.state;
    let latLong = currentLoc.latitude + "," + currentLoc.longitude;
    pet.currentLocation = cityState;

    const shelter = await shelterData.getShelterById(pet.associatedShelter);

    let physicalCharacteristics;
    
    if (pet.animalType === "Dog") {
      physicalCharacteristics = csvsync.parse(
        fs.readFileSync("data/petInformation/dogPhysical.csv")
      );
    } else {
      physicalCharacteristics = csvsync.parse(
        fs.readFileSync("data/petInformation/catPhysical.csv")
      );
    }

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
      pet: pet,
      physicalCharacteristics: petPhys,
      otherFilters: petBehavior,
      shelter: shelter,
      latLong: latLong,
      isAuthenticated: authenticatedPetOwner,
      userId: userId,
      isThisShelterLoggedIn: isUserThisShelter
    });
  } catch (e) {
    //res.status(404).render("error", { title: "404 Error", error: "No pet was found.", number: 404 });
  }
});

router.post("/inquire", async (req, res) => {
  //console.log(req.body)
  try {
    // check if a thread already exists between these two users
    let thread = await messagesData.getThreadByParticipants([req.body.user, req.body.recipient]);
    
    if (thread === null) {	  
      thread = await messagesData.addNewThread(req.body.user, req.body.recipient, req.body.reply);
    } else {
      //console.log(thread)
      thread = await messagesData.addMessage(thread._id, req.body.user, req.body.reply);
    }
      
    res.redirect(`pet/${req.body.petId}`);
  } catch (e) {
    res.render("pets/error", { 
      title: "Something went wrong!",
      error: e,
    });
  }
});

router.post("/search", async (req, res) => {
  try {
    let inputAnimalType = req.body.animalType;
    let inputBreeds = req.body.breeds;
    let inputAgeGroups = req.body.ageGroup;
    let inputSex = req.body.sex;
    let inputAppearance = req.body.appearance;
    let inputBehaviors = req.body.behaviors;
    let inputZip = req.body.zipCode;
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

    if (inputDistance == "") {
      inputDistance = 50; // default to 50 miles if left blank
    }

    let searchResults = await petsData.searchPets(
      inputAnimalType,
      inputBreeds,
      inputAgeGroups,
      inputSex,
      inputAppearance,
      inputBehaviors,
      inputZip,
      inputDistance
    );

    res.status(200).render("pets/pet-results", {
      searchTerm: inputBreeds,
      pets: searchResults,
    });
  } catch (e) {
    res.render("pets/error", { 
      title: "Something went wrong!",
      error: e,
    });
  }
});

/* upload.array(name of item from form submission) is required for multer */
router.post("/add", upload.array("petPictures", 5), async (req, res) => {
  try {
    const sessionInfo = req.cookies.AuthCookie;
    if (sessionInfo && sessionInfo.userAuthenticated && sessionInfo.userType === "srUser") {

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

      const newPet = await petsData.addPet(
        req.body.petName,
        req.body.animalType,
        breedArray,
        imgArray,
        req.body.sex,
        req.body.currentLocation,
        req.body.availableForAdoption === "true" ? true : false,
        req.body.ageGroup,
        req.body.biography,
        shelter._id,
        req.body.adoptionFee,
        filters
      );

      res.redirect(`/pet/${newPet._id}`);
    } else {
      res.redirect("/");
    }
  } catch (e) {
    res.render("pets/error", { 
      title: "Something went wrong!",
      error: e,
    });
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

    res.status(200).render("pets/pet-search", {
      dogBreeds: dogBreeds,
      dogAppearance: dogPhysicalCharacteristics,
      catBreeds: catBreeds,
      catAppearance: catPhysicalCharacteristics,
      behavior: behaviors,
    });
  } catch (e) {
    res.render("pets/error", { 
      title: "Something went wrong!",
      error: e,
    });
  }
});

router.get("/new", async (req, res) => {
  try {
    const sessionInfo = req.cookies.AuthCookie;
    if (sessionInfo && sessionInfo.userAuthenticated && sessionInfo.userType === "srUser") {
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

      const shelter = await shelterData.getShelterAndRescueByUserEmail(sessionInfo.email);
  
      res.status(200).render("pets/pet-add", {
        dogBreeds: dogBreeds,
        dogAppearance: dogPhysicalCharacteristics,
        catBreeds: catBreeds,
        catAppearance: catPhysicalCharacteristics,
        behavior: behaviors,
      });
    } else {
      res.redirect("/"); 
    }
  } catch (e) {
    res.render("pets/error", { 
      title: "Something went wrong!",
      error: e,
    });
  }
});

router.get("/pet/:id/update", async (req, res) => {
  try {
    const pet = await petsData.getPetById(req.params.id);

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

    let petPhys = [];
    let petBehavior = [];
    let physicalCharacteristics;

    if (pet.animalType === "Dog") {
      physicalCharacteristics = csvsync.parse(
        fs.readFileSync("data/petInformation/dogPhysical.csv")
      );
    } else {
      physicalCharacteristics = csvsync.parse(
        fs.readFileSync("data/petInformation/catPhysical.csv")
      );
    }

    for (let i = 0; i < pet.filters.length; i++) {
      if (physicalCharacteristics[0].includes(pet.filters[i])) {
        petPhys.push(pet.filters[i]);
      } else {
        petBehavior.push(pet.filters[i]);
      }
    }

    pet.physicalCharacteristics = petPhys;
    pet.petBehavior = petBehavior;

    res.status(200).render("pets/pet-update", {
      dogBreeds: dogBreeds,
      dogAppearance: dogPhysicalCharacteristics,
      catBreeds: catBreeds,
      catAppearance: catPhysicalCharacteristics,
      behavior: behaviors,
      pet: pet
    });
  } catch (e) {
    res.render("pets/error", { 
      title: "Something went wrong!",
      error: e,
    });
  }
});

router.post('/delete', async (req, res) => {
  if (!req.body.petId) {
      res.status(400).json({ error: 'You must supply an ID to delete' });
      return;
  }

  try {
      await petsData.getPetById(req.body.petId);
  } catch (e) {
      res.status(404).json({ error: 'Pet not found' });
      return;
  }

  try {
      const deleted = await petsData.delete(req.body.petId);
      res.redirect(`/shelters/${req.body.shelterId}`);
  } catch (e) {
      res.status(500).json({ error: e });
  }
});

  /* upload.array(name of item from form submission) is required for multer */
  router.post("/update", upload.array("petPictures", 5), async (req, res) => {
    try {
      // todo add authentication check
      const sessionInfo = req.cookies.AuthCookie;
      let shelter;
    if (sessionInfo && sessionInfo.userAuthenticated && sessionInfo.userType === "srUser") {
      shelter = await shelterData.getShelterAndRescueByUserEmail(sessionInfo.email);
    }

    let imgArray = [];
    let info = req.body;

    // add file names to an array
    for (let i = 0; i < req.files.length; i++) {
      imgArray.push(req.files[i].filename);
    }

    info.petPictures = imgArray;

    let inputAnimalType = req.body.animalType;
    let inputBreeds = req.body.breeds;
    let inputAgeGroups = req.body.ageGroup;
    let inputSex = req.body.sex;
    let inputAppearance = req.body.appearance;
    let inputBehaviors = req.body.behaviors;

    if (inputBreeds == undefined) {
      inputBreeds = [];
    } else if (!Array.isArray(inputBreeds)) {
      inputBreeds = [inputBreeds];
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

    info.animalType = inputAnimalType;
    info.breeds = inputBreeds;
    info.ageGroup = inputAgeGroups;
    info.sex = inputSex;
    info.appearance = inputAppearance;
    info.behaviors = inputBehaviors;
    info.petName = req.body.petName;
    info.associatedShelter = shelter._id;
    info.availableForAdoption = req.body.availableForAdoption;
    info.adoptionFee = req.body.adoptionFee;

    const updatedPet = await petsData.update(req.body.petId, info);

    res.redirect(`/pets/pet/${info.petId}`);
    } catch (e) {
      res.render("pets/error", { 
        title: "Something went wrong!",
        error: e,
      });
    }
  });

module.exports = router;
