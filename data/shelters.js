const mongoCollections = require('../config/mongoCollections');
let { ObjectId } = require("mongodb");
const shelterscoll = mongoCollections.shelters;

let exportedMethods = {
    async create(name, email, location, biography, phoneNumber, website, socialMedia, availablePets, adoptedPets, reviews, profilePicture, websiteFeedbackGiven) {
        if (!name || !email || !location || !biography || !phoneNumber || !website || !socialMedia || !availablePets || !adoptedPets || !reviews || !profilePicture || !websiteFeedbackGiven) throw "One of the input paramertes are missing"
        const sheltersCollection = await shelterscoll();

        let newShelter = {
            name: name,
            email: email,
            location: location, //object
            biography: biography,
            phoneNumber: phoneNumber,
            website: website,
            socialMedia: socialMedia, //array
            availablePets: availablePets, //array
            adoptedPets: adoptedPets, //array
            reviews: reviews, //Subdoc
            profilePicture: profilePicture,
            websiteFeedbackGiven: websiteFeedbackGiven //Subdoc

        };

        const insertInfo = await sheltersCollection.insertOne(newShelter);
        if (insertInfo.insertedCount === 0) throw 'Could not add shelter';

        const newId = insertInfo.insertedId;
        let shelter = await this.getShelterByID(newId.toString());
        shelter._id = shelter._id.toString();

        return shelter;
    },

    async getAll() {
        const sheltersCollection = await shelterscoll();
        const getAllShelters = sheltersCollection.find({}).toArray();
        return getAllShelters;
    },

    async getShelterByID(id) {
        if (!id) throw "Please provide a proper ID "
        if (typeof id != "string") throw "Please provide a String based ID"
        if (id.trim().length === 0) throw "Input ID cannot be blank"
        let parsedId = ObjectId(id);
        const sheltersCollection = await shelterscoll();
        let shelter = await sheltersCollection.findOne({ _id: parsedId })

        if (shelter === null) throw "shelter not found";
        shelter._id = shelter._id.toString();
        return shelter;
    },
    // async searchShelter(search) {
    //     if (!search) throw "Please provide a proper Search term "
    //     if (id.trim().length === 0) throw "Input search term cannot be blank"
    //     const sheltersCollection = await shelterscoll();

    //     const shelterResults = await sheltersCollection.find({ 'name': search }).toArray();
    //     let shelterIds = [];

    //     for (let i = 0; i < shelterResults.length; i++) {
    //         shelterIds.push(shelterIds[i]._id.toString());
    //     }
    //     return shelterIds;
    // }


}

module.exports = exportedMethods;