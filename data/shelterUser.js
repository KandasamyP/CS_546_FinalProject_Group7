const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const saltRounds = 16;
const petOwnerData = mongoCollections.petOwner;
const shelterAndRescueData = mongoCollections.shelterAndRescue;
const petData = mongoCollections.pets;

//returns a petOwner user searches by petOwner Email/Username
async function getPetShelterByEmail(shelterEmail) {
    const sheltersCollection = await shelterAndRescueData();

    const shelterDetails = await sheltersCollection.findOne({ email: shelterEmail });

    if (shelterDetails == null || !shelterDetails) throw "Shelter not found";

    // return _id as string
    shelterDetails._id = shelterDetails._id.toString();

    return shelterDetails;
}

//returns updated shelter data
async function updateShelter(updatedData, email) {
 
    // let modifiedData = {
    //   name: String,
    //   phoneNumber: String,
    //   biography: String,
    //   location: {
    //     streetAddress1: String,
    //     streetAddress2: String,
    //     city: String,
    //     stateCode: String,
    //     zipCode: String,
    //   },
    //   socialMedia: {
    //     twitter: String,
    //     facebook: String,
    //     instagram: String
    //   },
    //   availablePets: Array
    // }
    
    const sheltersCollection = await shelterAndRescueData();

    const userDetails = await getPetShelterByEmail(email);

    const updateInfo = await sheltersCollection.updateOne(
      { _id: ObjectId(userDetails._id) },
      { $set: updatedData }
    );

    if (updateInfo.matchedCount === 0 && updateInfo.modifiedCount === 0)
      throw "Could not update user";
     
    return await getShelterById(userDetails._id);
  }

// return a petOwner searches by pet Owner id
async function getShelterById(shelterId) {
  //checking petOwnerId
  if (!ObjectId.isValid(shelterId)) {
    throw "Invalid shelter user id.";
  }

  const sheltersCollection = await shelterAndRescueData();

  const shelterUserDetails = await sheltersCollection.findOne({
    _id: ObjectId(shelterId),
  });

  if (shelterUserDetails == null || !shelterUserDetails) throw "Shelter not found.";

  return shelterUserDetails;
}

async function updatePassword(userId, plainTextPassword){
    //check for type of ID and password
    if(!userId){
      throw "User id must be provided.";
    }

    if(!plainTextPassword){
      throw "Password must be provided";
    }

    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
    const sheltersCollection = await shelterAndRescueData();

    const updateInfo = await sheltersCollection.updateOne(
      {_id: ObjectId(userId)},
      {$set: {"password": hashedPassword}}
    );

    if (updateInfo.matchedCount === 0 && updateInfo.modifiedCount === 0)
        throw "Could not update password";

    return await getShelterById(userId);    
}

async function updateShelterProfileImage(email, picture){
  if (!email) throw "email must be provided";
  if (!picture) throw "picture must be provided";
  
  const userDetails = await getPetShelterByEmail(email);
 
  const sheltersCollection = await shelterAndRescueData();
  const updateInfo = await sheltersCollection.updateOne(
    {_id: ObjectId(userDetails._id)},
    {$set: {"profilePicture": picture}}
  );
 
  if (updateInfo.matchedCount === 0 && updateInfo.modifiedCount === 0)
  throw "Could not update profile picture";
  
  return await getShelterById(ObjectId(userDetails._id));  

}

async function getAvailablePets(email, availablePetsArray){
  const sheltersCollection = await shelterAndRescueData();

  const shelterDetails = await getPetShelterByEmail(email);

  for (let index = 0; index < availablePetsArray.length; index++){
    
  }
}

async function getAdoptedPets(){

}

async function getReviews(){

}

module.exports = {
  updatePassword,
  getPetShelterByEmail,
  updateShelter,
  getShelterById,
  updateShelterProfileImage,
  getAvailablePets,
  getAdoptedPets,
  getReviews
};
