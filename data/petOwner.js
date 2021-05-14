const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const saltRounds = 16;
const petOwnerData = mongoCollections.petOwner;
const shelterAndRescueData = mongoCollections.shelterAndRescue;
const petData = mongoCollections.pets;

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

  let petOwnerDetails = await petOwnerCollection.findOne({ email: petOwnerEmail });

  if (petOwnerDetails == null || !petOwnerDetails) throw "User not found. data/petOwner getbyemail";

  // return _id as string
  petOwnerDetails._id = petOwnerDetails._id.toString();

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

  if (petOwnerDetails == null || !petOwnerDetails) throw "User not found. data/petOwner/getbyid";

  return petOwnerDetails;
}

//returns updated petOwner data
async function updatePetOwner(updatedData) {
  //let userDetails = await getPetOwnerById(userDetails._id);
  // console.log("In data updated data");
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
  // console.log("existing data");
  // console.log(existingUserData);

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
    { _id: ObjectId(existingUserData._id) },
    { $set: modifiedData }
  );
  if (updateInfo.matchedCount === 0 && updateInfo.modifiedCount === 0)
    throw "Could not update user error in data";

  // console.log("Final updated result");
  // console.log(await getBookById(bookId))
  // console.log("after update:");
  // console.log(await getPetOwnerById(existingUserData._id));
  return await getPetOwnerById(existingUserData._id);
}


async function updatePetOwnerFeedbackById(req) {
  const petOwnerCollection = await petOwnerData();
  let petOwner = await this.getPetOwnerByUserEmail(req.cookies.AuthCookie.email);

  const addFeedback = {
    date: new Date(),
    rating: req.body.rating,
    feedback: req.body.experience,
  };
  addFeedback._id = ObjectId();

  petOwner.websiteFeedbackGiven.push(addFeedback);

  petOwner._id = ObjectId(petOwner._id);

  const updateInfo = await petOwnerCollection.updateOne({ _id: ObjectId(petOwner._id) }, { $set: petOwner });
  if (updateInfo.modifiedCount === 0)
    throw "Not able to update db";
}

async function updatePassword(userId, plainTextPassword) {
  //check for type of ID and password
  if (!userId) {
    throw "User id must be provided.";
  }

  if (!plainTextPassword) {
    throw "Password must be provided";
  }

  const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
  const petOwnerCollection = await petOwnerData();

  const updateInfo = await petOwnerCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: { "password": hashedPassword } }
  );

  if (updateInfo.matchedCount === 0 && updateInfo.modifiedCount === 0)
    throw "Could not update password";

  return await getPetOwnerById(userId);
}

//this function updates the profile picture
async function updateProfileImage(email, picture) {
  if (!email) throw "email must be provided";
  if (!picture) throw "picture must be provided";

  const userDetails = await getPetOwnerByUserEmail(email);

  const petOwnerCollection = await petOwnerData();
  const updateInfo = await petOwnerCollection.updateOne(
    { _id: ObjectId(userDetails._id) },
    { $set: { "profilePicture": picture } }
  );

  if (updateInfo.matchedCount === 0 && updateInfo.modifiedCount === 0)
    throw "Could not update profile picture";

  return await getPetOwnerById(ObjectId(userDetails._id));

}

//this function returns the data
async function getShelterReviews(shelterReviewsArray, userId) {
  let shelterReviewDetails = [];
  //console.log(typeof userId);
  if (!Array.isArray(shelterReviewsArray)) throw "Parameter must be an array";

  const shelterAndRescueCollection = await shelterAndRescueData();

  for (let index = 0; index < shelterReviewsArray.length; index++) {
    const parsedId = ObjectId(shelterReviewsArray[index]);
    //console.log(parsedId);
    const reviewData = await shelterAndRescueCollection.findOne({ "reviews._id": parsedId }, { projection: { _id: 0, reviews: 1, name: 1 } });

    if (reviewData === null) throw `No review found`;

    shelterReviewDetails.push(reviewData);
    //console.log(shelterReviewDetails);

  }
  let shelterReviewArray = [];

  for (let i = 0; i < shelterReviewDetails.length; i++) {
    for (let j = 0; j < shelterReviewDetails[i].reviews.length; j++) {
      if (shelterReviewDetails[i].reviews[j].reviewer == userId) {
        shelterReviewArray.push({
          name: shelterReviewDetails[i].name,
          reviews: shelterReviewDetails[i].reviews[j]
        });
      }
    }
  }

  // for (let index = 0; index < shelterReviewArray.length; index++)
  //   console.log(shelterReviewArray[index]);
  return shelterReviewArray;
}

async function getUserFavoritePets(favoritePetArray) {

  if (!Array.isArray(favoritePetArray)) throw "Parameter must be an array";

  const petCollection = await petData();
  let favoritePetsDetails = [];
  for (let i = 0; i < favoritePetArray.length; i++) {

    const petDetails = await petCollection.findOne({ _id: ObjectId(favoritePetArray[i]) });
    if (petDetails == null) throw "pet not found";
    favoritePetsDetails.push({
      name: petDetails.petName,
      image: petDetails.petPictures[0]
    });
  }
  // for (let index = 0; index < favoritePetsDetails.length; index++)
  //   console.log(favoritePetsDetails[index]);
  return favoritePetsDetails;
}


async function updateVolunteerStatus(userId, status){
  let value = Boolean;
  //console.log(userId+" "+status);
  if (status == "true")
    value = true;
  else  
    value = false;  
  const petOwnerCollection = await petOwnerData();
 

  const updateInfo = await petOwnerCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: { "isVolunteerCandidate": value } }
  );

  if (updateInfo.matchedCount === 0 && updateInfo.modifiedCount === 0)
    throw "Could not update password";

  return await getPetOwnerById(userId);
}

async function getPetCount(){
  const shelterAndRescueCollection = await shelterAndRescueData();

  const shelterData = await shelterAndRescueCollection.find({}).toArray();

  if (shelterData == null) throw "Data not found";
  let total = 0
  for (let i =0; i < shelterData.length; i++){
    total += shelterData[i].adoptedPets.length;
  }
  return total;
} 
async function getAllUsersWithFavoritePet(id) {
  if (!id) throw "The input id is missing.";
  // If the id provided is not a string, or is an  empty string, the method should throw
  if (typeof id !== "string") throw "The input must be a string.";
  if (id.trim().length === 0) throw "The input must not be empty.";
  // If the id provided is not a valid ObjectId, the method should throw
  // if it cannot be converted to ObjectId, it will automatically throw an error
  let parsedId = ObjectId(id);

  const userCollection = await petOwnerData();
  let userResults = await userCollection.find( { favoritedPets: id } ).toArray();
  let userIds = [];

  for (let user of userResults) {
    userIds.push(user._id.toString());
  }
  
  return userIds;
}

module.exports = {
  addPetOwner,
  getPetOwnerById,
  updatePetOwner,
  getPetOwnerByUserEmail,
  updatePetOwnerFeedbackById,
  updatePassword,
  getShelterReviews,
  updateProfileImage,
  getUserFavoritePets,

  updateVolunteerStatus,
  getPetCount,

  getAllUsersWithFavoritePet

};
