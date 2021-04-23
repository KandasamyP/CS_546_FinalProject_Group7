const mongoCollections = require('../config/mongoCollections');
let { ObjectId } = require("mongodb");
const sheltercoll = mongoCollections.shelter;

let exportedMethods = {
    async create(name, email, location, biography, phoneNumber, website, socialMedia, availablePets, adoptedPets, reviews, profilePicture, websiteFeedbackGiven) {
        if (!name || !email || !location || !biography || !phoneNumber || !website || !socialMedia || !availablePets || !adoptedPets || !reviews || !profilePicture || !websiteFeedbackGiven) throw "One of the input paramertes are missing"
        const shelterCollection = await sheltercoll();

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

        const insertInfo = await shelterCollection.insertOne(newShelter);
        if (insertInfo.insertedCount === 0) throw 'Could not add shelter';

        const newId = insertInfo.insertedId;
        let shelter = await this.getShelterByID(newId.toString());
        shelter._id = shelter._id.toString();

        return shelter;
        // const shelter = await this.get(newId);
        // return JSON.parse(JSON.stringify(shelter));
    },

    async getAll() {
        const shelterCollection = await sheltercoll();
        const getAllShelters = shelterCollection.find({}).toArray();
        // let allSheltersName = [];

        // for (let i = 0; i < getAllShelters.length; i++) {
        //     let shelterName = getAllShelters[i].name
        //     allSheltersName.push(shelterName);
        // }

        return getAllShelters;
        // console.log(getAllShelters)
        // return getAllShelters;
    },

    async getShelterByID(id) {
        if (!id) throw "Please provide a proper ID "
        if (typeof id != "string") throw "Please provide a String based ID"
        if (id.trim().length === 0) throw "Input ID cannot be blank"
        let parsedId = ObjectId(id);
        const shelterCollection = await sheltercoll();
        let shelter = await shelterCollection.findOne({ _id: parsedId })

        if (shelter === null) throw "shelter not found";
        return shelter
    },
    // async searchShelter(search) {
    //     if (!search) throw "Please provide a proper Search term "
    //     if (id.trim().length === 0) throw "Input search term cannot be blank"
    //     const shelterCollection = await sheltercoll();

    //     const shelterResults = await shelterCollection.find({ 'name': search }).toArray();
    //     let shelterIds = [];

    //     for (let i = 0; i < shelterResults.length; i++) {
    //         shelterIds.push(shelterIds[i]._id.toString());
    //     }
    //     return shelterIds;
    // }

}

module.exports = exportedMethods;