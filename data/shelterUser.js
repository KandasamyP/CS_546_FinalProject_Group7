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

async function getAvailablePets(availablePetsArray){
  // console.log("In data");
  // console.log("email "+email);
  // for (let i=0; i < availablePetsArray.length; i++)
  //   console.log(availablePetsArray[i]);
  const petCollection = await petData();
  let availablePetsDetails = [];

  for (let index = 0; index < availablePetsArray.length; index++){
    const petDetails = await petCollection.findOne({_id: ObjectId(availablePetsArray[index])});
    
    if (petDetails == null) throw "pet not found";

    availablePetsDetails.push({
      name: petDetails.petName,
      profilePicture: petDetails.petPictures[0]
    });
  }
  return availablePetsDetails;
}

//returns the pet name and profile picture. petsIdArray is a list if pet ids either available for adoption or already adopted
async function getPetsData(petsIdArray){
  const petCollection = await petData();
  let petsDetails = [];

  for (let index = 0; index < petsIdArray.length; index++){
    const petInfo = await petCollection.findOne({_id: ObjectId(petsIdArray[index])});
    
    if (petInfo == null) throw "pet not found";

    petsDetails.push({
      name: petInfo.petName,
      profilePicture: petInfo.petPictures[0]
    });
  }
  return petsDetails;
}

async function getReviews(reviewsIdArray){
  let reviewData = [];
  for (let index = 0; index < reviewsIdArray.length; index++){

      const petOwnerCollection = await petOwnerData();
      const petOwnerInfo = await petOwnerCollection.findOne({_id:ObjectId(reviewsIdArray[index].reviewer)});

      reviewData.push({
        rating: reviewsIdArray[index].rating,
        reviewerName: petOwnerInfo.fullName.firstName + " "+ petOwnerInfo.fullName.lastName,
        reviewBody: reviewsIdArray[index].reviewBody,
        reviewDate: reviewsIdArray[index].reviewDate
      });
  }
  return reviewData;
}

module.exports = {
  updatePassword,
  getPetShelterByEmail,
  updateShelter,
  getShelterById,
  updateShelterProfileImage,
  getReviews,
  getPetsData
};
