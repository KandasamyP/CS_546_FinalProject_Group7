const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const saltRounds = 16;
const petOwnerData = mongoCollections.petOwner;

// //creates a petOwner user
async function addPetOwner(
  profilePicture,
  fullName,
  email,
  password,
  phoneNumber,
  zipCode,
  biography,
  dateOfBirth,
  favoritedPets,
  websiteFeedbackGiven,
  shelterReviewsGiven,
  reportedPosts,
  donatedItems,
  isVolunteerCandidate
) {
  //add profilePicture when that functionality is added
  //favoritedPets, websiteFeedbackGiven, shelterReviewsGiven, reportedPosts, donatedItems, isVolunteerCandidate are not mandatory fields while creating a user.
  if (
    !fullName ||
    !email ||
    !password ||
    !phoneNumber ||
    !zipCode ||
    !biography
  ) {
    throw "There is atleast one field missing.";
  }
  let newPetOwner = {
    _id: ObjectId(),
    profilePicture: profilePicture, //The path or URL to user’s profile picture
    fullName: fullName, //object containing firstName and lastName of the user
    email: email, //string
    password: password, //string hashed pwd
    phoneNumber: phoneNumber, //number
    zipCode: zipCode, //string
    biography: biography, //string
    dateOfBirth: dateOfBirth, //Date
    favoritedPets: favoritedPets, //[]
    websiteFeedbackGiven: websiteFeedbackGiven, //subdoc
    shelterReviewsGiven: shelterReviewsGiven, //[]
    reportedPosts: reportedPosts, //[]
    donatedItems: donatedItems, //[]
    isVolunteerCandidate: isVolunteerCandidate, //boolean
  };

  const petOwnerCollection = await petOwnerData();

  const insertInfo = await petOwnerCollection.insertOne(newPetOwner);

  if (insertInfo.insertedCount === 0) throw "Could not add user";

  const newId = insertInfo.insertedId;

  const petOwnerDetails = await getPetOwnerById(newId);

  return petOwnerDetails;
}

//returns a petOwner user searches by petOwner Email/Username
async function getPetOwnerByUserEmail(petOwnerEmail) {
  //check email
  const petOwnerCollection = await petOwnerData();

  const petOwnerDetails = await petOwnerCollection.findOne({
    email: petOwnerEmail,
  });

  if (petOwnerDetails == null || !petOwnerDetails) throw "User not found.";

  return petOwnerDetails;
}

// return a petOwner searches by pet Owner id
async function getPetOwnerById(petOwnerId) {
  //checking petOwnerId
  if (!ObjectId.isValid(petOwnerId)) {
    throw "Invalid user id.";
  }

  const petOwnerCollection = await petOwnerData();

  const petOwnerDetails = await petOwnerCollection.findOne({
    _id: ObjectId(petOwnerId),
  });

  if (petOwnerDetails == null || !petOwnerDetails) throw "User not found.";

  return petOwnerDetails;
}

//returns updated petOwner data
async function updatePetOwner(updatedData) {
  //let userDetails = await getPetOwnerById(userDetails._id);

  // console.log(updatedData);
  // console.log(existingUserData);
  let modifiedData = {
    fullName: {
      firstName: String,
      lastName: String,
    },
    phoneNumber: Number,
    zipCode: String,
    biography: String,
    dateOfBirth: String,
  };

  //check updatedData fields
  let existingUserData = await getPetOwnerByUserEmail(updatedData.email);

  if (updatedData.fullName) {
    if (
      updatedData.fullName.hasOwnProperty("firstName") &&
      updatedData.fullName.firstName.trim() != ""
    ) {
      // modifiedData.fullName = {firstName : updatedData.fullName.firstName};
      modifiedData.fullName["firstName"] = updatedData.fullName.firstName;
    } else {
      //modifiedData.fullName = {firstName : existingUserData.fullName.firstName};
      modifiedData.fullName["firstName"] = existingUserData.fullName.firstName;
    }
    if (
      updatedData.fullName.hasOwnProperty("lastName") &&
      updatedData.fullName.lastName.trim() != ""
    ) {
      // modifiedData.fullName = {lastName : updatedData.fullName.lastName};
      modifiedData.fullName["lastName"] = updatedData.fullName.lastName;
    } else {
      //modifiedData.fullName = {lastName : existingUserData.fullName.lastName};
      modifiedData.fullName["lastName"] = existingUserData.fullName.lastName;
    }
  } else {
    modifiedData.fullName = existingUserData.fullName;
  }

  if (updatedData.phoneNumber) {
    modifiedData.phoneNumber = updatedData.phoneNumber;
  } else {
    modifiedData.phoneNumber = existingUserData.phoneNumber;
  }

  if (updatedData.zipCode) {
    modifiedData.zipCode = updatedData.zipCode;
  } else {
    modifiedData.zipCode = existingUserData.zipCode;
  }

  if (updatedData.biography) {
    modifiedData.biography = updatedData.biography;
  } else {
    modifiedData.biography = existingUserData.biography;
  }
  if (updatedData.dateOfBirth) {
    modifiedData.dateOfBirth = updatedData.dateOfBirth;
  } else {
    modifiedData.dateOfBirth = existingUserData.dateOfBirth;
  }

  // let modifiedData = {
  //     fullName : {
  //         firstName : updatedData.firstName,
  //         lastName : updatedData.lastName
  //     }, //object containing firstName and lastName of the user
  //     password : updatedData.password, //string hashed pwd
  //     phoneNumber : updatedData.phoneNumber, //number
  //     zipCode : updatedData.zipCode, //string
  //     biography : updatedData.biography, //string
  //     dateOfBirth : updatedData.dateOfBirth, //Date
  // }
  //console.log(modifiedData);
  const petOwnerCollection = await petOwnerData();

  const updateInfo = await petOwnerCollection.updateOne(
    { _id: existingUserData._id },
    { $set: modifiedData }
  );
  if (updateInfo.matchedCount === 0 && updateInfo.modifiedCount === 0)
    throw "Could not update user";

  // console.log("Final updated result");
  // console.log(await getBookById(bookId))
  return await getPetOwnerById(existingUserData._id);
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
    const petOwnerCollection = await petOwnerData();

    const updateInfo = await petOwnerCollection.updateOne(
      {_id: userId},
      {$set: {"password": hashedPassword}}
    );

    if (updateInfo.matchedCount === 0 && updateInfo.modifiedCount === 0)
        throw "Could not update password";

    return await getPetOwnerById(userId);    
}

module.exports = {
  addPetOwner,
  getPetOwnerById,
  updatePetOwner,
  getPetOwnerByUserEmail,
  updatePassword
};
