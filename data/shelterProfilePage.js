const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb").ObjectId;

const shelterData = mongoCollections.shelterAndRescue;

async function getPetShelterByUserEmail(shelterEmail) {
    const sheltersCollection = await shelterData();

    const shelterEmail = await sheltersCollection.findOne({ email: shelterEmail });

    if (shelterEmail == null || !shelterEmail) throw "Shelter not found";

    return shelterEmail;
}

async function getPetShelterById(shelterEmail) { }