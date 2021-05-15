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
    cb(null, Date.now() + "-" + file.originalname.replace(" ", "_"));
  },
});

const upload = multer({ storage: storage });
/* <-- required for multer */

router.get("/pet/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(404).render("pets/error", {
      title: "404 Error",
      error: "No id supplied.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  try {
    let authenticatedPetOwner = false;
    let userId;
    let isUserThisShelter = false;
    let isPetFavorited = false;
    const sessionInfo = req.session.user;

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

    const dropdownData = {
      dogPhysicalCharacteristics: dogPhysicalCharacteristics,
      dogBreeds: dogBreeds,
      catPhysicalCharacteristics: catPhysicalCharacteristics,
      catBreeds: catBreeds,
      behaviors: behaviors,
    };

    // This endpoint returns an object that has all the details for a pet with that ID
    let pet = await petsData.getPetById(req.params.id);

    if (sessionInfo && sessionInfo.userAuthenticated) {
      if (sessionInfo.userType === "popaUser") {
        authenticatedPetOwner = true;
        const userInfo = await petOwnerData.getPetOwnerByUserEmail(
          sessionInfo.email
        );

        if (userInfo.favoritedPets.includes(req.params.id)) {
          isPetFavorited = true;
        }

        userId = userInfo._id;
      } else {
        const userInfo = await shelterData.getPetShelterByEmail(
          sessionInfo.email
        );
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
      dropdownData.animalIsDog = true;
    } else {
      physicalCharacteristics = csvsync.parse(
        fs.readFileSync("data/petInformation/catPhysical.csv")
      );
      dropdownData.animalIsDog = false;
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
      isThisShelterLoggedIn: isUserThisShelter,
      favorited: isPetFavorited,
      dropdownData: dropdownData,
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
      script: "pet-single",
    });
    return;
  } catch (e) {
    res.status(500).render("pets/error", {
      title: "Error",
      error: e,
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }
});

router.post("/inquire", async (req, res) => {
  const sessionInfo = req.session.user;
  if (!sessionInfo || !sessionInfo.userAuthenticated || sessionInfo.userType !== "popaUser") {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "Please sign in as a pet adopter to use this feature.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  if (!req.body.user) {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "No user supplied.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  if (!req.body.petId) {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "No pet id supplied.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  if (!req.body.recipient) {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "No recipient supplied.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  if (!req.body.reply) {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "No reply supplied.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  if (typeof req.body.user !== "string" || req.body.user.trim().length === 0) {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "The user must be a non-empty string.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  if (
    typeof req.body.petId !== "string" ||
    req.body.petId.trim().length === 0
  ) {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "The pet id must be a non-empty string.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  if (
    typeof req.body.recipient !== "string" ||
    req.body.recipient.trim().length === 0
  ) {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "The recipient must be a non-empty string.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  if (
    typeof req.body.reply !== "string" ||
    req.body.reply.trim().length === 0
  ) {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "No reply must be a non-empty string.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  try {
    // check if a thread already exists between these two users
    let thread = await messagesData.getThreadByParticipants([
      req.body.user,
      req.body.recipient,
    ]);

    if (thread === null) {
      // if no thread exists yet, create one
      thread = await messagesData.addNewThread(
        req.body.user,
        req.body.recipient,
        req.body.reply
      );
    } else {
      // if a thread does exist, add a new message to it
      thread = await messagesData.addMessage(
        thread._id,
        req.body.user,
        req.body.reply
      );
    }

    res.redirect(`pet/${req.body.petId}`);
    return;
  } catch (e) {
    res.render("pets/error", {
      title: "Something went wrong!",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
      error: e,
    });
  }
});

router.post("/corrections", async (req, res) => {
  const sessionInfo = req.session.user;
  if (!sessionInfo || !sessionInfo.userAuthenticated || sessionInfo.userType !== "popaUser") {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "Please sign in as a pet adopter to use this feature.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  try {
    // check if a thread already exists between these two users
    let thread = await messagesData.getThreadByParticipants([
      req.body.user,
      req.body.recipient,
    ]);

    let message = `I propose making these changes for ${req.body.petName}: `;

    if (req.body.addBreeds) {
      message = message + `Add breeds: (${req.body.addBreeds.toString()}). `;
    }

    if (req.body.correctSex) {
      message = message + `Correct sex: ${req.body.correctSex}. `;
    }

    if (req.body.correctAgeGroup) {
      message = message + `Correct age: ${req.body.correctAgeGroup}. `;
    }

    if (req.body.addAppearance) {
      message =
        message + `Add appearances: (${req.body.addAppearance.toString()}). `;
    }

    if (req.body.addBehaviors) {
      message =
        message +
        `Add behaviors/lifestyle: (${req.body.addBehaviors.toString()}). `;
    }

    if (req.body.removeBreeds) {
      message =
        message + `Remove breeds: (${req.body.removeBreeds.toString()}). `;
    }

    if (req.body.removeAppearance) {
      message =
        message +
        `Remove appearances: (${req.body.removeAppearance.toString()}). `;
    }

    if (req.body.removeBehaviors) {
      message =
        message +
        `Remove behaviors/lifestyle: (${req.body.removeBehaviors.toString()}). `;
    }

    if (thread === null) {
      // if no thread exists yet, create one
      thread = await messagesData.addNewThread(
        req.body.user,
        req.body.recipient,
        message
      );
    } else {
      // if a thread does exist, add a new message to it
      thread = await messagesData.addMessage(
        thread._id,
        req.body.user,
        message
      );
    }

    res.redirect(`pet/${req.body.petId}`);
    return;
  } catch (e) {
    res.render("pets/error", {
      title: "Something went wrong!",
      error: e,
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }
});

router.post("/search", async (req, res) => {
  // the only required inputs are animalType and zipCode, so don't check for existence of other params
  if (!req.body.animalType) {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "No animal type supplied.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  if (!req.body.zipCode) {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "No zip code supplied.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  if (req.body.animalType !== "Dog" && req.body.animalType !== "Cat") {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "The only pet options right now are cats and dogs.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  // lookup will be undefined if zip code doesn't actually exist, so this will catch bad inputs
  if (zipcodes.lookup(req.body.zipCode) === undefined) {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "That zip code is invalid.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  // check if other input parameters are valid, if supplied
  // breeds is a string if only one selected, array if multiple
  if (req.body.breeds) {
    if (
      !Array.isArray(req.body.breeds) &&
      typeof req.body.breeds !== "string"
    ) {
      res.status(400).render("pets/error", {
        title: "400 Error",
        error:
          "The breeds must be in an array or a single breed must be a string.",
        pageTitle: "Pets",
        isLoggedIn: req.body.isLoggedIn,
      });
      return;
    }

    if (Array.isArray(req.body.breeds)) {
      for (let breed of req.body.breeds) {
        if (typeof breed !== "string" || breed.trim().length() === 0) {
          res.status(400).render("pets/error", {
            title: "400 Error",
            error:
              "The breeds must be in an array or a single breed must be a string.",
            pageTitle: "Pets",
            isLoggedIn: req.body.isLoggedIn,
          });
          return;
        }
      }
    }
  }

  // age group is a string if only one selected, array if multiple
  if (req.body.ageGroup) {
    if (
      !Array.isArray(req.body.ageGroup) &&
      typeof req.body.ageGroup !== "string"
    ) {
      res.status(400).render("pets/error", {
        title: "400 Error",
        error: "The ages must be in an array or a single age must be a string.",
        pageTitle: "Pets",
        isLoggedIn: req.body.isLoggedIn,
      });
      return;
    }
    if (Array.isArray(req.body.ageGroup)) {
      for (let ageGroup of req.body.ageGroup) {
        if (req.body.animalType === "Dog") {
          if (
            ageGroup !== "Puppy" &&
            ageGroup !== "Young" &&
            ageGroup !== "Adult" &&
            ageGroup !== "Senior"
          ) {
            res.status(400).render("pets/error", {
              title: "400 Error",
              error: "The ages do not match the appropriate options.",
              pageTitle: "Pets",
              isLoggedIn: req.body.isLoggedIn,
            });
            return;
          }
        } else {
          if (
            ageGroup !== "Kitten" &&
            ageGroup !== "Young" &&
            ageGroup !== "Adult" &&
            ageGroup !== "Senior"
          ) {
            res.status(400).render("pets/error", {
              title: "400 Error",
              error: "The ages do not match the appropriate options.",
              pageTitle: "Pets",
              isLoggedIn: req.body.isLoggedIn,
            });
            return;
          }
        }
      }
    } else {
      if (req.body.animalType === "Dog") {
        if (
          req.body.ageGroup !== "Puppy" &&
          req.body.ageGroup !== "Young" &&
          req.body.ageGroup !== "Adult" &&
          req.body.ageGroup !== "Senior"
        ) {
          res.status(400).render("pets/error", {
            title: "400 Error",
            error: "The ages do not match the appropriate options.",
            pageTitle: "Pets",
            isLoggedIn: req.body.isLoggedIn,
          });
          return;
        }
      } else {
        if (
          req.body.ageGroup !== "Kitten" &&
          req.body.ageGroup !== "Young" &&
          req.body.ageGroup !== "Adult" &&
          req.body.ageGroup !== "Senior"
        ) {
          res.status(400).render("pets/error", {
            title: "400 Error",
            error: "The ages do not match the appropriate options.",
            pageTitle: "Pets",
            isLoggedIn: req.body.isLoggedIn,
          });
          return;
        }
      }
    }
  }

  // sex is a string if only one selected, array if multiple
  if (req.body.sex) {
    if (!Array.isArray(req.body.sex) && typeof req.body.sex !== "string") {
      res.status(400).render("pets/error", {
        title: "400 Error",
        error:
          "The sexes must be in an array or a single sex must be a string.",
        pageTitle: "Pets",
        isLoggedIn: req.body.isLoggedIn,
      });
      return;
    }
    if (Array.isArray(req.body.sex)) {
      for (let sex of req.body.sex) {
        if (sex !== "Female" && sex !== "Male") {
          res.status(400).render("pets/error", {
            title: "400 Error",
            error: "The sexes do not match the appropriate options.",
            pageTitle: "Pets",
            isLoggedIn: req.body.isLoggedIn,
          });
          return;
        }
      }
    } else {
      if (req.body.sex !== "Female" && req.body.sex !== "Male") {
        res.status(400).render("pets/error", {
          title: "400 Error",
          error: "The sex does not match the appropriate options.",
          pageTitle: "Pets",
          isLoggedIn: req.body.isLoggedIn,
        });
        return;
      }
    }
  }

  // appearance is a string if only one selected, array if multiple
  if (req.body.appearance) {
    if (
      !Array.isArray(req.body.appearance) &&
      typeof req.body.appearance !== "string"
    ) {
      res.status(400).render("pets/error", {
        title: "400 Error",
        error:
          "The appearances must be in an array or a single appearance must be a string.",
        pageTitle: "Pets",
        isLoggedIn: req.body.isLoggedIn,
      });
      return;
    }
    if (Array.isArray(req.body.appearance)) {
      for (let appearance of req.body.appearance) {
        if (
          typeof appearance !== "string" ||
          appearance.trim().length() === 0
        ) {
          res.status(400).render("pets/error", {
            title: "400 Error",
            error:
              "The appearances must be in an array or a single appearance must be a string.",
            pageTitle: "Pets",
            isLoggedIn: req.body.isLoggedIn,
          });
          return;
        }
      }
    }
  }

  // behaviors is a string if only one selected, array if multiple
  if (req.body.behaviors) {
    if (
      !Array.isArray(req.body.behaviors) &&
      typeof req.body.behaviors !== "string"
    ) {
      res.status(400).render("pets/error", {
        title: "400 Error",
        error:
          "The behaviors must be in an array or a single behavior must be a string.",
        pageTitle: "Pets",
        isLoggedIn: req.body.isLoggedIn,
      });
      return;
    }
    if (Array.isArray(req.body.behaviors)) {
      for (let behaviors of req.body.behaviors) {
        if (typeof behaviors !== "string" || behaviors.trim().length() === 0) {
          res.status(400).render("pets/error", {
            title: "400 Error",
            error:
              "The behaviors must be in an array or a single behavior must be a string.",
            pageTitle: "Pets",
            isLoggedIn: req.body.isLoggedIn,
          });
          return;
        }
      }
    }
  }

  // distance is a scalar value so should not be an array
  // even if distance isn't supplied, the request will show up as an empty string anyway which is fine
  // since we have distance default to 50 miles
  if (req.body.distance) {
    if (typeof req.body.distance !== "string") {
      res.status(400).render("pets/error", {
        title: "400 Error",
        error: "The distance must be a scalar value.",
        pageTitle: "Pets",
        isLoggedIn: req.body.isLoggedIn,
      });
      return;
    }

    // if length is greater than 0 that means the distance was supplied
    if (req.body.distance.length > 0) {
      // input must be an integer
      if (!Number.isInteger(parseFloat(req.body.distance))) {
        res.status(400).render("pets/error", {
          title: "400 Error",
          error: "Input distance must be an integer",
          pageTitle: "Pets",
          isLoggedIn: req.body.isLoggedIn,
        });
        return;
      }
      // there is a maximum search radius of 500 miles
      if (req.body.distance < 0 || req.body.distance > 500) {
        res.status(400).render("pets/error", {
          title: "400 Error",
          error: "Input distance must be an integer between 0 and 500.",
          pageTitle: "Pets",
          isLoggedIn: req.body.isLoggedIn,
        });
        return;
      }
    }
  }

  try {
    let inputAnimalType = req.body.animalType;
    let inputBreeds = req.body.breeds;
    let inputAgeGroups = req.body.ageGroup;
    let inputSex = req.body.sex;
    let inputAppearance = req.body.appearance;
    let inputBehaviors = req.body.behaviors;
    let inputZip = req.body.zipCode;
    let inputDistance = req.body.distance;

    if (inputBreeds === undefined) {
      inputBreeds = [];
    } else if (!Array.isArray(inputBreeds)) {
      inputBreeds = [inputBreeds];
    }

    if (inputAgeGroups === undefined) {
      inputAgeGroups = [];
    } else if (!Array.isArray(inputAgeGroups)) {
      inputAgeGroups = [inputAgeGroups];
    }

    if (inputSex === undefined) {
      inputSex = [];
    } else if (!Array.isArray(inputSex)) {
      inputSex = [inputSex];
    }

    if (inputAppearance === undefined) {
      inputAppearance = [];
    } else if (!Array.isArray(inputAppearance)) {
      inputAppearance = [inputAppearance];
    }

    if (inputBehaviors === undefined) {
      inputBehaviors = [];
    } else if (!Array.isArray(inputBehaviors)) {
      inputBehaviors = [inputBehaviors];
    }

    if (inputDistance === "") {
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
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  } catch (e) {
    res.render("pets/error", {
      title: "Something went wrong!",
      error: e,
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }
});

/* upload.array(name of item from form submission) is required for multer */
router.post("/add", upload.array("petPictures", 5), async (req, res) => {
  try {
    const sessionInfo = req.session.user;
    if (
      sessionInfo &&
      sessionInfo.userAuthenticated &&
      sessionInfo.userType === "srUser"
    ) {
      let imgArray = [];

      // add file names to an array
      for (let i = 0; i < req.files.length; i++) {
        imgArray.push(req.files[i].filename);
      }

      let breedArray = [];

      // make sure breeds is an array even if one option was chosen
      if (typeof req.body.breeds === "string") {
        breedArray.push(req.body.breeds);
      } else if (req.body.breeds === undefined) {
        breedArray = ["Unknown"];
      } else {
        breedArray = req.body.breeds;
      }

      let appearanceArray = [];
      let behaviorsArray = [];

      // make sure filters is an array even if one option was chosen
      if (req.body.appearance !== undefined) {
        if (typeof req.body.appearance === "string") {
          appearanceArray.push(req.body.appearance);
        } else {
          appearanceArray = req.body.appearance;
        }
      }

      if (req.body.behaviors !== undefined) {
        if (typeof req.body.behaviors === "string") {
          behaviorsArray.push(req.body.behaviors);
        } else {
          behaviorsArray = req.body.behaviors;
        }
      }

      let filters = [];
      
      filters = appearanceArray.concat(behaviorsArray);

      const shelter = await shelterData.getPetShelterByEmail(sessionInfo.email);

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

      res.redirect(`/pets/pet/${newPet._id}`);
      return;
    } else {
      res.redirect("/");
      return;
    }
  } catch (e) {
    res.render("pets/error", {
      title: "Something went wrong!",
      error: e,
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn
    });
    return;
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
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
      script: "pet-search",
    });
  } catch (e) {
    res.render("pets/error", {
      title: "Something went wrong!",
      error: e,
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
  }
});

router.get("/new", async (req, res) => {
  try {
    const sessionInfo = req.session.user;
    if (
      sessionInfo &&
      sessionInfo.userAuthenticated &&
      sessionInfo.userType === "srUser"
    ) {
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
        pageTitle: "Pets",
        isLoggedIn: req.body.isLoggedIn,
        script: "pet-add",
      });
      return;
    } else {
      res.redirect("/");
      return;
    }
  } catch (e) {
    res.render("pets/error", {
      title: "Something went wrong!",
      error: e,
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }
});

router.get("/pet/:id/update", async (req, res) => {
  try {
    if (!req.params.id || typeof req.params.id !== "string" || req.params.id.trim().length === 0) {
      res.status(404).render("pets/error", {
        title: "404 Error",
        error: "No id supplied.",
        pageTitle: "Pets",
        isLoggedIn: req.body.isLoggedIn,
      });
      return;
    }

    const sessionInfo = req.session.user;

    // if not logged in or logged in as pet adopter, you can't be on this page!
    if (!sessionInfo || sessionInfo.userType === "popaUser") {
      res.redirect(`/pets/pet/${req.params.id}`);
      return;
    }

    const thisShelter = await shelterData.getPetShelterByEmail(sessionInfo.email);
    const pet = await petsData.getPetById(req.params.id);

    // if you are not the shelter that manages this pet, you can't be on this page!
    if (thisShelter._id !== pet.associatedShelter)  {
      res.redirect(`/pets/pet/${req.params.id}`);
      return;
    }

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
      pet: pet,
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
      script: "pet-add"
    });
    return;
  } catch (e) {
    res.render("pets/error", {
      title: "Something went wrong!",
      error: e,
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }
});

router.post("/delete", async (req, res) => {
  try {
    if (
      !req.body.petId ||
      typeof req.body.petId !== "string" ||
      req.body.petId.trim().length === 0
    ) {
      res.status(400).render("pets/error", {
        title: "Error",
        error: "You must supply a pet ID to delete",
        pageTitle: "Pets",
        isLoggedIn: req.body.isLoggedIn,
      });
      return;
    }
  
    if (
      !req.body.shelterId ||
      typeof req.body.shelterId !== "string" ||
      req.body.shelterId.trim().length === 0
    ) {
      res.status(400).render("pets/error", {
        title: "Error",
        error: "You must supply a shelter ID to delete",
        pageTitle: "Pets",
        isLoggedIn: req.body.isLoggedIn,
      });
      return;
    }

    // make sure pet exists
    await petsData.getPetById(req.body.petId);
    await petsData.delete(req.body.petId, req.body.shelterId);

    res.redirect(`/sheltersAndRescue/${req.body.shelterId}`);
    return;
  } catch (e) {
    res.status(404).render("pets/error", {
      title: "Error",
      error: e,
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }
});

// upload.array(name of item from form submission) is required for multer
router.post("/update", upload.array("petPictures", 5), async (req, res) => {
  try {
    const sessionInfo = req.session.user;
    let shelter;
    if (
      sessionInfo &&
      sessionInfo.userAuthenticated &&
      sessionInfo.userType === "srUser"
    ) {
      shelter = await shelterData.getPetShelterByEmail(sessionInfo.email);
    }

    let imgArray = [];
    let info = req.body;

    // add file names to an array
    for (let i = 0; i < req.files.length; i++) {
      imgArray.push(req.files[i].filename);
    }

    info.petPictures = imgArray;

    let inputAnimalType = req.body.animalType;
    let inputBreeds;
    
    if (inputAnimalType === "Dog") {
      inputBreeds = req.body.dogBreeds;
    } else {
      inputBreeds = req.body.catBreeds;
    }

    let inputAgeGroups = req.body.ageGroup;
    let inputSex = req.body.sex;

    let inputAppearance;

    if (inputAnimalType === "Dog") {
      inputAppearance = req.body.dogAppearance;
    } else {
      inputAppearance = req.body.catAppearance;
    }

    let inputBehaviors = req.body.behaviors;

    if (inputBreeds === undefined) {
      inputBreeds = ["Unknown"];
    } else if (!Array.isArray(inputBreeds)) {
      inputBreeds = [inputBreeds];
    } else if (Array.isArray(inputBreeds)) {
      for (let breed of inputBreeds) {
        if (typeof breed !== "string" || breed.trim().length === 0) {
          res.status(400).render("pets/error", {
            title: "Error",
            error: "Any breeds must be strings!",
            pageTitle: "Pets",
            isLoggedIn: req.body.isLoggedIn,
          });
          return;
        }
      }
    }

    if (inputAppearance === undefined) {
      inputAppearance = [];
    } else if (!Array.isArray(inputAppearance)) {
      inputAppearance = [inputAppearance];
    } else if (Array.isArray(inputAppearance)) {
      for (let appearance of inputAppearance) {
        if (typeof appearance !== "string" || appearance.trim().length === 0) {
          res.status(400).render("pets/error", {
            title: "Error",
            error: "Any appearances must be strings!",
            pageTitle: "Pets",
            isLoggedIn: req.body.isLoggedIn,
          });
          return;
        }
      }
    }

    if (inputBehaviors === undefined) {
      inputBehaviors = [];
    } else if (!Array.isArray(inputBehaviors)) {
      inputBehaviors = [inputBehaviors];
    } else if (Array.isArray(inputBehaviors)) {
      for (let behavior of inputBehaviors) {
        if (typeof behavior !== "string" || behavior.trim().length === 0) {
          res.status(400).render("pets/error", {
            title: "Error",
            error: "Any behaviors must be strings!",
            pageTitle: "Pets",
            isLoggedIn: req.body.isLoggedIn,
          });
          return;
        }
      }
    }

    info.animalType = inputAnimalType;
    info.breeds = inputBreeds;
    info.ageGroup = inputAgeGroups;
    info.sex = inputSex;
    info.appearance = inputAppearance;
    info.behaviors = inputBehaviors;
    info.petName = req.body.petName;
    info.associatedShelter = shelter._id;
    info.availableForAdoption =
      req.body.availableForAdoption == "true" ? true : false;
    info.adoptionFee = req.body.adoptionFee;

    const updatedPet = await petsData.update(req.body.petId, info);

    res.redirect(`/pets/pet/${info.petId}`);
    return;
  } catch (e) {
    res.render("pets/error", {
      title: "Something went wrong!",
      error: e,
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }
});

router.post("/favorite", async (req, res) => {
  if (!req.body.favoritedPet || typeof req.body.favoritedPet !== "string" || req.body.favoritedPet.trim().length === 0) {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "No pet id supplied.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  if (!req.body.userId || typeof req.body.userId !== "string" || req.body.userId.trim().length === 0) {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "No user id supplied.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  if (!req.body.favoriteTrueFalse || typeof req.body.favoriteTrueFalse !== "string" || req.body.favoriteTrueFalse.trim().length === 0) {
    res.status(400).render("pets/error", {
      title: "400 Error",
      error: "Can't determine if pet is being favorited or unfavorited.",
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }

  try {
    const sessionInfo = req.session.user;
    let user;
    if (
      sessionInfo &&
      sessionInfo.userAuthenticated &&
      sessionInfo.userType === "popaUser"
    ) {
      user = await petOwnerData.getPetOwnerByUserEmail(sessionInfo.email);
    } else {
      res.status(400).render("pets/error", {
        title: "400 Error",
        error: "You're not able to add or remove favorites without a pet adopter profile",
        pageTitle: "Pets",
        isLoggedIn: req.body.isLoggedIn,
      });
      return;
    }

    let isAdding;

    if (req.body.favoriteTrueFalse === "true") {
      isAdding = true;
    } else if (req.body.favoriteTrueFalse === "false") {
      isAdding = false;
    } else {
      res.status(400).render("pets/error", {
        title: "400 Error",
        error: "Can't determine if pet is being favorited or unfavorited.",
        pageTitle: "Pets",
        isLoggedIn: req.body.isLoggedIn,
      });
      return;
    }

    const updated = await petsData.updateFavoritedPets(
      req.body.userId,
      req.body.favoritedPet,
      isAdding
    );

    res.redirect(`/pets/pet/${req.body.favoritedPet}`);
    return;
  } catch (e) {
    res.render("pets/error", {
      title: "Something went wrong!",
      error: e,
      pageTitle: "Pets",
      isLoggedIn: req.body.isLoggedIn,
    });
    return;
  }
});

module.exports = router;
