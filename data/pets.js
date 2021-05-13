const mongoCollections = require("../config/mongoCollections");
const zipcodes = require("zipcodes");
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
    const parsedShelterId = ObjectId(associatedShelter);
    const shelterUpdateInfo = await shelterRescueCollection.updateOne({ _id: parsedShelterId }, { $push: { reviews: newId.toString() } });

    // If the shelter cannot be updated, the method should throw
    if (shelterUpdateInfo.insertedCount === 0) throw "The shelter could not be updated.";

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

  async searchPets(animalType, breeds, ageGroups, sex, appearance, otherFilters, zip, distance) {
    let searchObj = {
      animalType: animalType,
      availableForAdoption: {$eq: true}
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
      };
      allPetsShort.push(petShort);

      //Need only 5 pets
      if (i === 4) {
        break;
      }
    }

    return allPetsShort;
  },

  // Deletes the specified pet
  async delete(id) {
    // If no id is provided, the method should throw
    if (!id) throw "The input argument 'id' is missing.";
    // If the id provided is not a string, or is an  empty string, the method should throw
    if (typeof id != "string") throw "The input 'id' must be a string.";
    if (id.trim().length === 0) throw "The input 'id' must not be empty.";
    // If the id provided is not a valid ObjectId, the method should throw
    // if it cannot be converted to ObjectId, it will automatically throw an error
    let parsedId = ObjectId(id);

    const petCollection = await pets();
    const pet = await petCollection.findOne({ _id: parsedId });
    const deletionInfo = await petCollection.deleteOne({_id: parsedId});

    // If the pet cannot be removed (does not exist), the method should throw
    if (deletionInfo.deletedCount === 0) throw `The pet with an id of ${id} could not be removed as it does not exist.`;

    // If the removal succeeds, return a message stating that.
    return `${pet.petName} has been removed.`;
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

    const petCollection = await pets();
    const updatedData = {};

    if (typeof info.petName !== "string" || info.petName.trim().length === 0)  
      throw "Pet name cannot be empty!";
    updatedData.petName = info.petName;

    if (info.animalType !== "Dog" && info.animalType !== "Cat")  
      throw "You must choose either cat or dog!";
    updatedData.animalType = info.animalType;
    
    if (!Array.isArray(info.breeds))
      throw "Breeds must be an array"
    updatedData.breeds = info.breeds;

    /*if (typeof info.petPictures !== "string" || info.petPictures.trim().length === 0)  
      throw "Pet picture locations must be non-empty strings.";
    updatedData.petPictures = info.petPictures;*/ // todo fix this so that it's an array and also don't throw if empty

    if (info.sex !== "Female" && info.sex !== "Male")
      throw "Pet must be male or female!"
    updatedData.sex = info.sex;

    if (zipcodes.lookup(info.currentLocation) === undefined)
      throw "Please enter a valid zip code";
    updatedData.currentLocation = info.currentLocation;

    if (info.availableForAdoption === undefined)
      throw "You must enter whether or not this pet is available for adoption";
    updatedData.availableForAdoption = info.availableForAdoption;

    if (info.animalType === "Dog") {
      if (info.ageGroup !== "Puppy" && info.ageGroup !== "Young" && 
        info.ageGroup !== "Adult" && info.ageGroup !== "Senior")
        throw "Age group for dogs must be valid";
    } else {
      if (info.ageGroup !== "Kitten" && info.ageGroup !== "Young" && 
        info.ageGroup !== "Adult" && info.ageGroup !== "Senior")
        throw "Age group for cats must be valid";
    }
    updatedData.ageGroup = info.ageGroup;

    if (typeof info.biography !== "string" || info.biography.trim().length === 0) 
      throw "Biography cannot be empty"
    updatedData.biography = info.biography;

    if (typeof info.associatedShelter !== "string" || info.associatedShelter.trim().length === 0)
      throw "Associated shelter must be a non-empty string";
    updatedData.associatedShelter = info.associatedShelter;

    if (isNaN(info.adoptionFee))
      throw "Adoption fee must be a number";
    updatedData.adoptionFee = info.adoptionFee;

    if (!Array.isArray(info.appearance))
      throw "Filters must be an array"

    if (!Array.isArray(info.behaviors))
      throw "Filters must be an array"

    
    updatedData.filters = info.appearance.concat(info.behaviors);

    await petCollection.updateOne({ _id: parsedId }, { $set: updatedData });
    return await this.getPetById(id);
  },

  // adds/removes pet to the user's favoritedPets array
  // if isAdding is true, pet gets added; if false, pet gets removed
  async updateFavoritedPets(userId, petId, isAdding) {
    // If no id is provided, the method should throw
    if (!userId || !petId || isAdding === undefined) throw "There is an input argument missing.";
    // If the id provided is not a string, or is an  empty string, the method should throw
    if (typeof userId !== "string" || typeof petId !== "string") throw "The id inputs must be strings.";
    if (userId.trim().length === 0 || petId.trim().length === 0) throw "The id inputs must not be empty.";
    // isAdding must be a boolean
    if (typeof isAdding !== "boolean") throw "The input isAdding must be a boolean.";
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
      userInfo = await userCollection.updateOne({ _id: parsedUserId }, { $push: { favoritedPets: petId } } );
    } else {
      userInfo = await userCollection.updateOne({ _id: parsedUserId }, { $pull: { favoritedPets: petId } } );
    }
    
    // If the favorited pets array cannot be updated, the method should throw
    if (userInfo.insertedCount === 0) throw "The favorited pets array could not be updated.";

    return;
  },
};

module.exports = exportedMethods;
