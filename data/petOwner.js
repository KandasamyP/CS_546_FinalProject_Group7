const mongoCollections = require('../config/mongoCollections');
const { ObjectId } = require('mongodb').ObjectId;

const petOwnerData = mongoCollections.petOwner;

async function addPetOwner(profilePicture,fullName,emailAddress,password,phoneNumber,zipCode,biography,dateOfBirth,favoritedPets,websiteFeedbackGiven,shelterReviewsGiven,reportedPosts,donatedItems,isVolunteerCandidate){

    let newPetOwner = {
        _id  : ObjectId(),
        profilePicture : profilePicture, //The path or URL to user’s profile picture
        fullName : fullName, //object containing firstName and lastName of the user
        emailAddress : emailAddress, //string
        password : password, //string hashed pwd
        phoneNumber : phoneNumber, //number
        zipCode : zipCode, //string
        biography : biography, //string
        dateOfBirth : dateOfBirth, //Date
        favoritedPets : favoritedPets, //[]
        websiteFeedbackGiven : websiteFeedbackGiven, //subdoc
        shelterReviewsGiven : shelterReviewsGiven, //[]
        reportedPosts : reportedPosts, //[]
        donatedItems : donatedItems, //[]
        isVolunteerCandidate : isVolunteerCandidate //boolean
    }
    
    const petOwnerCollection = await petOwnerData();

    const insertInfo = await petOwnerCollection.insertOne(newPetOwner);

    if (insertInfo.insertedCount === 0) throw "Could not add user";

    const newId = insertInfo.insertedId;

    const petOwnerDetails = await getPetOwnerById(newId);

    return petOwnerDetails;

}

async function getPetOwnerById(petOwnerId){

    const petOwnerCollection = await petOwnerData();

    const petOwnerDetails = await petOwnerCollection.findOne({_id:ObjectId(petOwnerId)});

    if(petOwnerDetails == null || !petOwnerDetails) throw "User not found.";

    return petOwnerDetails;
}

module.exports = {
    addPetOwner,
    getPetOwnerById
}