const mongoCollections = require("../config/mongoCollections")
let { ObjectId } = require("mongodb");
const pets = mongoCollections.pets;

const exportedMethods = {
    // This async function will return the newly created pet object
    async addPet(petName, animalType, breeds, petPictures, sex, currentLocation, availableForAdoption, ageGroup, biography, associatedShelter, adoptionFee, filters) {
        // If any inputs are missing, the method should throw
        if (!petName || !animalType || !breeds || !petPictures || !sex || !currentLocation || !availableForAdoption || !ageGroup || !biography || !associatedShelter || !adoptionFee || !filters) 
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
            filters: filters
        }; 

        const insertInfo = await petCollection.insertOne(newPet);

        // If the pet cannot be created, the method should throw
        if (insertInfo.insertedCount === 0) throw "The pet could not be created.";

        const newId = insertInfo.insertedId;
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
                petName: allPets[i].petName
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

    async searchPets() {
        const petCollection = await pets();


        return await petCollection.find({ 'petName': null }).toArray();
    },

    // search by only one type at a time
    async searchPetsByType(animalType) {
        const petCollection = await pets();
        const petResults = await petCollection.find({ 'animalType': animalType }).toArray();
        let petIds = [];

        for (let i = 0; i < petResults.length; i++) {
            petIds.push(petResults[i]._id.toString());
        }

        return petIds;
    },

    // search by any number of breeds
    async searchPetsByBreed(breeds) {
        const petCollection = await pets();
        const petResults = await petCollection.find({ breeds: { $in: breeds } }).toArray();
        let petIds = [];

        for (let i = 0; i < petResults.length; i++) {
            petIds.push(petResults[i]._id.toString());
        }

        return petIds;
    },

    // search by any number of age groups (puppy, young, adult, senior)
    async searchPetsByAge(ageGroups) {
        const petCollection = await pets();
        const petResults = await petCollection.find({ ageGroup: { $in: ageGroups } }).toArray();
        let petIds = [];

        for (let i = 0; i < petResults.length; i++) {
            petIds.push(petResults[i]._id.toString());
        }

        return petIds;
    },

    // search by only one sex
    async searchPetsBySex(sex) {
        const petCollection = await pets();
        const petResults = await petCollection.find({ sex: sex }).toArray();
        let petIds = [];

        for (let i = 0; i < petResults.length; i++) {
            petIds.push(petResults[i]._id.toString());
        }

        return petIds;
    },

    // search by any filters
    async searchPetsByFilters(filters) {
        const petCollection = await pets();
        const petResults = await petCollection.find({ filters: { $in: filters } }).toArray();
        let petIds = [];

        for (let i = 0; i < petResults.length; i++) {
            petIds.push(petResults[i]._id.toString());
        }

        return petIds;
    }

    // todo add distance search https://docs.mongodb.com/manual/tutorial/calculate-distances-using-spherical-geometry-with-2d-geospatial-indexes/
};

module.exports = exportedMethods;
