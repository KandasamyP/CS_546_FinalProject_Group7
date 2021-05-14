const mongoCollections = require("../config/mongoCollections");
const zipcodes = require("zipcodes");
const userMethods = require("./petOwner");
let { ObjectId } = require("mongodb");
const pets = mongoCollections.pets;
const sheltersRescues = mongoCollections.shelterAndRescue;
const users = mongoCollections.petAdopterAndOwner;

const exportedMethods = {
  // This async function will return the newly created pet object
  async addPet(
    petName,
    animalType,
    breeds,
    petPictures,
    sex,
    currentLocation,
    availableForAdoption,
    ageGroup,
    biography,
    associatedShelter,
    adoptionFee,
    filters
  ) {
    // If any inputs are missing, the method should throw
    if (
      !petName ||
      !animalType ||
      !breeds ||
      !petPictures ||
      !sex ||
      !currentLocation ||
      availableForAdoption === undefined ||
      !ageGroup ||
      !biography ||
      !associatedShelter ||
      !adoptionFee ||
      !filters
    )
      throw "There is at least one missing input argument.";

    // petName must be a non-empty string
    if (typeof petName !== "string" || petName.trim().length === 0)
      throw "Pet name cannot be empty.";
    // animalType must be a dog or cat
    if (animalType !== "Dog" && animalType !== "Cat")
      throw "Animal type must be cat or dog.";
    // breeds must have an array of strings
    if (!Array.isArray(breeds)) throw "Breeds must be an array.";
    for (let breed of breeds) {
      if (typeof breed !== "string" || breed.trim().length === 0)
        throw "A breed must be a string.";
    }
    // petPictures are file names and the array must have between 1 and 5
    if (!Array.isArray(petPictures)) throw "Pet pictures must be an array.";
    for (let pic of petPictures) {
      if (typeof pic !== "string" || pic.trim().length === 0)
        throw "Each picture file name must be a string.";
    }
    if (petPictures.length < 1 || petPictures.length > 5)
      throw "There must be between 1 and 5 pet pictures.";
    // sex must be male or female
    if (sex !== "Female" && sex !== "Male") throw "Sex must be male or female.";
    // current location must be a valid zip code
    if (zipcodes.lookup(currentLocation) === undefined)
      throw "That is not a valid zip code.";
    // availableForAdoption should be true or false
    if (typeof availableForAdoption !== "boolean")
      throw "Available for adoption must be a boolean.";
    // ageGroup is only a specific set of strings
    if (animalType === "Dog") {
      if (
        ageGroup !== "Puppy" &&
        ageGroup !== "Young" &&
        ageGroup !== "Adult" &&
        ageGroup !== "Senior"
      )
        throw "Age group for dogs must be valid";
    } else {
      if (
        ageGroup !== "Kitten" &&
        ageGroup !== "Young" &&
        ageGroup !== "Adult" &&
        ageGroup !== "Senior"
      )
        throw "Age group for cats must be valid";
    }
    // biography is a string
    if (typeof biography !== "string" || biography.trim().length === 0)
      throw "Biography cannot be empty";
    // associatedShelter is a string that represents an objectid
    if (
      typeof associatedShelter !== "string" ||
      associatedShelter.trim().length === 0
    )
      throw "Associated shelter must be a non-empty string";
    let parsedShelterId = ObjectId(associatedShelter);
    // adoptionFee is a number between 0 and 1000
    if (isNaN(adoptionFee)) throw "Adoption fee must be a number";
    if (adoptionFee < 0 || adoptionFee > 1000) {
      throw "Adoption fee must be between $0 and $1000.";
    }
    // filters must be an array
    if (!Array.isArray(filters)) throw "Filters must be an array";
    for (let filter of filters) {
      if (typeof filter !== "string" || filter.trim().length === 0)
        throw "Individual filters must be strings.";
    }

    const petCollection = await pets();
    let today = new Date();

    let newPet = {
      datePosted: today,
      petName: petName,
      animalType: animalType,
      breeds: breeds,
      petPictures: petPictures,
      sex: sex,
      currentLocation: currentLocation,
      availableForAdoption: availableForAdoption,
      ageGroup: ageGroup,
      biography: biography,
      associatedShelter: associatedShelter,
      adoptionFee: adoptionFee,
      filters: filters,
    };

    const insertInfo = await petCollection.insertOne(newPet);

    // If the pet cannot be created, the method should throw
    if (insertInfo.insertedCount === 0) throw "The pet could not be created.";

    // If the pet was created, add its id to the availablePets array in shelters
    const newId = insertInfo.insertedId;
    const shelterRescueCollection = await sheltersRescues();

    let shelterUpdateInfo;
    if (availableForAdoption === true) {
      shelterUpdateInfo = await shelterRescueCollection.updateOne({ _id: parsedShelterId }, { $push: { availablePets: newId.toString() } });
    } else {
      shelterUpdateInfo = await shelterRescueCollection.updateOne({ _id: parsedShelterId }, { $push: { adoptedPets: newId.toString() } });
    }

  //  const shelterUpdateInfo = await shelterRescueCollection.updateOne(
  //    { _id: parsedShelterId },
     // { $push: { availablePets: newId.toString() } }
    //);


    // If the shelter cannot be updated, the method should throw
    if (shelterUpdateInfo.insertedCount === 0)
      throw "The shelter could not be updated.";

    let pet = await this.getPetById(newId.toString());
    pet._id = pet._id.toString();

    return pet;
  },

  // This function will return an array of all pets in the collection.
  // If there are no pets in your DB, this function will return an empty array.
  async getAll() {
    const petCollection = await pets();
    const allPets = await petCollection.find({}).toArray();
    let allPetsShort = [];

    for (let i = 0; i < allPets.length; i++) {
      let petShort = {
        _id: allPets[i]._id.toString(),
        petName: allPets[i].petName,
      };
      allPetsShort.push(petShort);
    }

    return allPetsShort;
  },

  // When given an id, this function will return a pet from the database.
  async getPetById(id) {
    // If no id is provided, the method should throw
    if (!id) throw "The input argument 'id' is missing.";
    // If the id provided is not a string, or is an  empty string, the method should throw
    if (typeof id != "string") throw "The input 'id' must be a string.";
    if (id.trim().length === 0) throw "The input 'id' must not be empty.";
    // If the id provided is not a valid ObjectId, the method should throw
    // if it cannot be converted to ObjectId, it will automatically throw an error
    let parsedId = ObjectId(id);

    const petCollection = await pets();
    let pet = await petCollection.findOne({ _id: parsedId });

    // If the no pet exists with that id, the method should throw
    if (pet === null) throw "Pet not found";

    pet._id = pet._id.toString();
    return pet;
  },

  async searchPets(
    animalType,
    breeds,
    ageGroups,
    sex,
    appearance,
    otherFilters,
    zip,
    distance
  ) {
    let searchObj = {
      animalType: animalType,
      availableForAdoption: { $eq: true },
    };

    if (breeds.length > 0) {
      searchObj.breeds = {
        $in: breeds,
      };
    }

    if (ageGroups.length > 0) {
      searchObj.ageGroup = {
        $in: ageGroups,
      };
    }

    if (sex.length > 0) {
      searchObj.sex = {
        $in: sex,
      };
    }

    // split filters into appearance and other (behavior/lifestyle) so that all fields entered
    // for behaviors are required; appearance can be any combination of selected options
    if (appearance.length > 0) {
      searchObj.filters = {
        $in: appearance,
      };
    }

    if (otherFilters.length > 0) {
      searchObj.filters = {
        $all: otherFilters,
      };
    }

    const zips = zipcodes.radius(zip, distance);
    searchObj.currentLocation = {
      $in: zips,
    };

    const petCollection = await pets();
    const petResults = await petCollection.find(searchObj).toArray();
    let petArr = [];

    for (let i = 0; i < petResults.length; i++) {
      let pet = {
        _id: petResults[i]._id.toString(),
        petName: petResults[i].petName,
        ageGroup: petResults[i].ageGroup,
        sex: petResults[i].sex,
        defaultPic: petResults[i].petPictures[0],
        currentLocation: petResults[i].currentLocation
      };
      petArr.push(pet);
    }

    return petArr;
  },

  //Get pets array for homepage
  async getPetHomepage() {
    const petCollection = await pets();
    const allPets = await petCollection.find({}).toArray();
    let allPetsShort = [];

    for (let i = 0; i < allPets.length; i++) {
      let petShort = {
        _id: allPets[i]._id.toString(),
        petName: allPets[i].petName,
        animalType: allPets[i].animalType,
        breeds: allPets[i].breeds,
        biography: allPets[i].biography,
        petPhoto: allPets[i].petPictures[0],
      };
      allPetsShort.push(petShort);
    }

    return allPetsShort;
  },

  // Deletes the specified pet
  async delete(id, shelterId) {
    // If no id is provided, the method should throw
    if (!id || !shelterId) throw "The input arguments are missing.";
    // If the id provided is not a string, or is an  empty string, the method should throw
    if (typeof id !== "string" || typeof shelterId !== "string")
      throw "The inputs must be strings.";
    if (id.trim().length === 0 || shelterId.trim().length === 0)
      throw "The inputs must not be empty.";
    // If the id provided is not a valid ObjectId, the method should throw
    // if it cannot be converted to ObjectId, it will automatically throw an error
    let parsedId = ObjectId(id);
    let parsedShelterId = ObjectId(shelterId);

    const petCollection = await pets();
    const pet = await this.getPetById(id);
    const deletionInfo = await petCollection.deleteOne({ _id: parsedId });

    // If the pet cannot be removed (does not exist), the method should throw
    if (deletionInfo.deletedCount === 0)
      throw `The pet with an id of ${id} could not be removed as it does not exist.`;

    const shelterCollection = await sheltersRescues();
    const shelterInfo = await shelterCollection.updateOne(
      { _id: parsedShelterId },
      { $pull: { availablePets: id } }
    );
    if (shelterInfo.insertedCount === 0)
      throw "The available pets array could not be updated.";

    const petOwnerCollection = await users();
    const usersWithPetAsFavorite = await userMethods.getAllUsersWithFavoritePet(
      id
    );

    for (let userId of usersWithPetAsFavorite) {
      let parsedUserId = ObjectId(userId);
      let userInfo = await petOwnerCollection.updateOne(
        { _id: parsedUserId },
        { $pull: { favoritedPets: id } }
      );
      if (userInfo.insertedCount === 0)
        throw "The favorited pets array could not be updated.";
    }

    return;
  },

  async update(id, info) {
    // If no id is provided, the method should throw
    if (!id) throw "The input argument 'id' is missing.";
    // If the id provided is not a string, or is an  empty string, the method should throw
    if (typeof id != "string") throw "The input 'id' must be a string.";
    if (id.trim().length === 0) throw "The input 'id' must not be empty.";
    // If the id provided is not a valid ObjectId, the method should throw
    // if it cannot be converted to ObjectId, it will automatically throw an error
    let parsedId = ObjectId(id);

    // If any inputs are missing, the method should throw
    if (
      !info.petName ||
      !info.animalType ||
      !info.breeds ||
      !info.petPictures ||
      !info.sex ||
      !info.currentLocation ||
      info.availableForAdoption === undefined ||
      !info.ageGroup ||
      !info.biography ||
      !info.associatedShelter ||
      !info.adoptionFee ||
      !info.appearance ||
      !info.behaviors
    )
      throw "There is at least one missing input argument.";

    const petCollection = await pets();
    const updatedData = {};

    if (typeof info.petName !== "string" || info.petName.trim().length === 0)
      throw "Pet name cannot be empty!";
    updatedData.petName = info.petName;

    if (info.animalType !== "Dog" && info.animalType !== "Cat")
      throw "You must choose either cat or dog!";
    updatedData.animalType = info.animalType;

    // breeds must have an array of strings
    if (!Array.isArray(info.breeds)) throw "Breeds must be an array.";
    for (let breed of info.breeds) {
      if (typeof breed !== "string" || breed.trim().length === 0)
        throw "A breed must be a string.";
    }
    updatedData.breeds = info.breeds;

    if (!Array.isArray(info.petPictures))
      throw "Pet pictures must be an array.";
    for (let pic of info.petPictures) {
      if (typeof pic !== "string" || pic.trim().length === 0)
        throw "Each picture file name must be a string.";
    }
    // 0 new pictures means old ones stay
    if (info.petPictures.length > 5)
      throw "There must be between 1 and 5 pet pictures.";
    if (info.petPictures.length > 0) updatedData.petPictures = info.petPictures;

    if (info.sex !== "Female" && info.sex !== "Male")
      throw "Pet must be male or female!";
    updatedData.sex = info.sex;

    if (zipcodes.lookup(info.currentLocation) === undefined)
      throw "Please enter a valid zip code";
    updatedData.currentLocation = info.currentLocation;

    // availableForAdoption should be true or false
    if (typeof info.availableForAdoption !== "boolean")
      throw "Available for adoption must be a boolean.";
    updatedData.availableForAdoption = info.availableForAdoption;

    if (info.animalType === "Dog") {
      if (
        info.ageGroup !== "Puppy" &&
        info.ageGroup !== "Young" &&
        info.ageGroup !== "Adult" &&
        info.ageGroup !== "Senior"
      )
        throw "Age group for dogs must be valid";
    } else {
      if (
        info.ageGroup !== "Kitten" &&
        info.ageGroup !== "Young" &&
        info.ageGroup !== "Adult" &&
        info.ageGroup !== "Senior"
      )
        throw "Age group for cats must be valid";
    }
    updatedData.ageGroup = info.ageGroup;

    if (
      typeof info.biography !== "string" ||
      info.biography.trim().length === 0
    )
      throw "Biography cannot be empty";
    updatedData.biography = info.biography;

    if (
      typeof info.associatedShelter !== "string" ||
      info.associatedShelter.trim().length === 0
    )
      throw "Associated shelter must be a non-empty string";
    updatedData.associatedShelter = info.associatedShelter;

    if (isNaN(info.adoptionFee)) throw "Adoption fee must be a number";
    if (info.adoptionFee < 0 || info.adoptionFee > 1000) {
      throw "Adoption fee must be between $0 and $1000.";
    }
    updatedData.adoptionFee = info.adoptionFee;

    if (!Array.isArray(info.appearance)) throw "Filters must be an array";
    for (let filter of info.appearance) {
      if (typeof filter !== "string" || filter.trim().length === 0)
        throw "Individual filters must be strings.";
    }

    if (!Array.isArray(info.behaviors)) throw "Filters must be an array";
    for (let filter of info.behaviors) {
      if (typeof filter !== "string" || filter.trim().length === 0)
        throw "Individual filters must be strings.";
    }

    updatedData.filters = info.appearance.concat(info.behaviors);

    const oldPetData = await this.getPetById(id);

    let shelterUpdateInfo;
    const shelterRescueCollection = await sheltersRescues();
    // if the pet was considered adopted but is now available again, push into available array and pull from adopted array
    if (info.availableForAdoption === true && oldPetData.availableForAdoption === false) {
      shelterUpdateInfo = await shelterRescueCollection.updateOne({ _id: ObjectId(oldPetData.associatedShelter) }, { $push: { availablePets: id.toString() } });
      shelterUpdateInfo = await shelterRescueCollection.updateOne({ _id: ObjectId(oldPetData.associatedShelter) }, { $pull: { adoptedPets: id.toString() } });
    } else if (info.availableForAdoption === false && oldPetData.availableForAdoption === true) {
      // if pet was available but is now not, push into adopted and pull from available
      shelterUpdateInfo = await shelterRescueCollection.updateOne({ _id: ObjectId(oldPetData.associatedShelter) }, { $pull: { availablePets: id.toString() } });
      shelterUpdateInfo = await shelterRescueCollection.updateOne({ _id: ObjectId(oldPetData.associatedShelter) }, { $push: { adoptedPets: id.toString() } });
    }

    await petCollection.updateOne({ _id: parsedId }, { $set: updatedData });
    return await this.getPetById(id);
  },

  // adds/removes pet to the user's favoritedPets array
  // if isAdding is true, pet gets added; if false, pet gets removed
  async updateFavoritedPets(userId, petId, isAdding) {
    // If no id is provided, the method should throw
    if (!userId || !petId || isAdding === undefined)
      throw "There is an input argument missing.";
    // If the id provided is not a string, or is an  empty string, the method should throw
    if (typeof userId !== "string" || typeof petId !== "string")
      throw "The id inputs must be strings.";
    if (userId.trim().length === 0 || petId.trim().length === 0)
      throw "The id inputs must not be empty.";
    // isAdding must be a boolean
    if (typeof isAdding !== "boolean")
      throw "The input isAdding must be a boolean.";
    // If the id provided is not a valid ObjectId, the method should throw
    // if it cannot be converted to ObjectId, it will automatically throw an error
    let parsedUserId = ObjectId(userId);
    let parsedPetId = ObjectId(petId);

    const userCollection = await users();
    let userInfo;

    // check to make sure petId exists
    const pet = await this.getPetById(petId);

    // if adding, push pet id into array; if adding is false, pull pet id from array
    if (isAdding) {
      userInfo = await userCollection.updateOne(
        { _id: parsedUserId },
        { $push: { favoritedPets: petId } }
      );
    } else {
      userInfo = await userCollection.updateOne(
        { _id: parsedUserId },
        { $pull: { favoritedPets: petId } }
      );
    }

    // If the favorited pets array cannot be updated, the method should throw
    if (userInfo.insertedCount === 0)
      throw "The favorited pets array could not be updated.";

    return;
  },
};

module.exports = exportedMethods;
