const mongoCollections = require("../config/mongoCollections")
let { ObjectId } = require("mongodb");
const shelters = mongoCollections.shelters;

const exportedMethods = {
    // This async function will return the newly created shelter object
    async addShelters(name, location, biography, phonenumber, website, socialmedia, availablePets, adoptedPets, reviews, websiteFeedbackGiven) {
        // If any inputs are missing, the method should throw
        if (!name, !location, !biography, !phonenumber, !website, !socialmedia, !availablePets, !adoptedPets, !reviews, !websiteFeedbackGiven) 
            throw "There is at least one missing input argument.";
        
        const sheltersCollection = await shelters();

        let newShelter = {
            name: name,
            location: location,
            biography: biography, 
            phonenumber: phonenumber,
            website: website,
            socialmedia: socialmedia,  //array
            availablePets: availablePets, //array
            adoptedPets: adoptedPets, // array
            reviews: reviews,
            websiteFeedbackGiven: websiteFeedbackGiven
        }; 

        const insertInfo = await sheltersCollection.insertOne(newShelter);

        // If the shelter cannot be created, the method should throw
        if (insertInfo.insertedCount === 0) 
            throw "The Shelter could not be created.";

        const newId = insertInfo.insertedId;
        let shelter = await this.getShelterById(newId.toString());
        shelter._id = shelter._id.toString();

        return shelter;
    },

    // When given an id, this function will return a shelter from the database.
    async getShelterById(id) {
        if (!id) 
            throw "The input argument 'id' is missing.";
        if (typeof id != "string") 
            throw "The input 'id' must be a string.";
        if (id.trim().length === 0) 
            throw "The input 'id' must not be empty.";

        let parsedId = ObjectId(id);
        
        const sheltersCollection = await shelters();
        let shelter = await sheltersCollection.findOne({ _id: parsedId });

        // If the no shelter exists with that id, the method should throw
        if (shelter === null) 
            throw "Shelter not found";
    
        shelter._id = shelter._id.toString();
        
        return shelter;
    }
}

   
module.exports = exportedMethods;
