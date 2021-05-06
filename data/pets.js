const mongoCollections = require("../config/mongoCollections")
const zipcodes = require("zipcodes-nearby");
let { ObjectId } = require("mongodb");
const pets = mongoCollections.pets;

const exportedMethods = {
    // This async function will return the newly created pet object
    async addPet(petName, animalType, breeds, petPictures, sex, currentLocation, availableForAdoption, ageGroup, biography, associatedShelter, adoptionFee, filters) {

        // If any inputs are missing, the method should throw
        if (!petName || !animalType || !breeds || !petPictures || !sex || !currentLocation || availableForAdoption === undefined || !ageGroup || !biography || !associatedShelter || !adoptionFee || !filters) 
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

    async searchPets(animalType, breeds, ageGroups, sex, filters, zip, distance) {
        let searchObj = {
            animalType: animalType
        }

        if (breeds.length > 0) {
            searchObj.breeds = {
                $in: breeds
            }
        };

        if (ageGroups.length > 0) {
            searchObj.ageGroup = {
                $in: ageGroups
            }
        };

        if (sex.length > 0) {
            searchObj.sex = {
                $in: sex
            }
        };

        if (filters.length > 0) {
            searchObj.filters = {
                $all: filters // todo probably should separate appearance and behaviors. sigh.
            }
        };

        const zips = await getDistance(zip, distance);
        searchObj.currentLocation = {
            $in: zips
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
                defaultPic: petResults[i].petPictures[0]
            }
            petArr.push(pet);
        }

        return petArr;
    }
};

async function getDistance(zip, dist) {
    let metersPerMile = 1609.34;
    let zips = zipcodes.near(zip, dist*metersPerMile, { datafile: './public/zipcodes.csv' });
    return zips;
}

module.exports = exportedMethods;
