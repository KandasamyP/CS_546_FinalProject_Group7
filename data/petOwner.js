const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const saltRounds = 16;
const petOwnerData = mongoCollections.petOwner;
const shelterAndRescueData = mongoCollections.shelterAndRescue;
const petData = mongoCollections.pets;


//Check if user is volunteer
async function checkVolunteer(emailID) {
  try {
    if (emailID === undefined || emailID.trim() === "") {
      throw "Email ID Not passed";
    }
  } catch (e) {
    throw e;
  }

  try {
    const petOwnerCollection = await petOwnerData();

    let petOwnerDetails = await petOwnerCollection.findOne({
      email: emailID,
    });
    return petOwnerDetails.isVolunteerCandidate;
  } catch (e) {
    throw "Cannot check if volunteer";
  }
}

// //creates a petOwner user

// //creates a petOwner user //if not used remove this function

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

//validates email
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//returns a petOwner user searches by petOwner Email/Username
async function getPetOwnerByUserEmail(petOwnerEmail) {
  //check email


 
  try{
      if (petOwnerEmail === undefined || petOwnerEmail.trim() === ""){
        throw {
          status: 400,
          error: "Email must be provided. Generated by /data/petOwner/getPetOwnerByUserEmail",
        }
      }


       if (!validateEmail(petOwnerEmail)) {
        throw {
          status: 400,
          error:
            "E-Mail not in correct format. Generated by /data/petOwner/getPetOwnerByUserEmail",
        };
      }

      const petOwnerCollection = await petOwnerData();

      let petOwnerDetails = await petOwnerCollection.findOne({ email: petOwnerEmail });
    
      if (petOwnerDetails == null || !petOwnerDetails) throw {status:404, error: "petOwner/adopter User not found. Generated by /data/petOwner/getPetOwnerByUserEmail"};
    
      // return _id as string
      petOwnerDetails._id = petOwnerDetails._id.toString();
    
      return petOwnerDetails;
  }catch(e){
    throw { status: e.status, error:e.error}
  }
}

// return a petOwner searches by pet Owner id
async function getPetOwnerById(petOwnerId) {
   //checking petOwnerId
  try{
    if (!petOwnerId) {
      throw {
        status: 400,
        error: "Missing petOwner/adopter id. Generated by data/petOwner/getPetOwnerById",
      }
    }
    if (!ObjectId.isValid(petOwnerId)) {

      throw {
        status: 400,
        error: "Invalid petOwner/adopter id. Generated by data/petOwner/getPetOwnerById",
      }
    }



    const petOwnerDetails = await petOwnerCollection.findOne({
      _id: ObjectId(petOwnerId),
    });
  
    if (petOwnerDetails == null || !petOwnerDetails) throw {status:404, error: "petOwner/adopter not found. Generated by data/petOwner/getPetOwnerById"};
  
    return petOwnerDetails;
  }catch(e){
    throw { status: e.status, error: e.error}
  }
 
}

//returns updated petOwner data
async function updatePetOwner(updatedData) {
  try{
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
  
    const petOwnerCollection = await petOwnerData();
  
    const updateInfo = await petOwnerCollection.updateOne(
      { _id: ObjectId(existingUserData._id) },
      { $set: modifiedData }
    );
    if (updateInfo.matchedCount === 0 && updateInfo.modifiedCount === 0)
        throw {status : 500, error: "Could not update petOwner/Adopter. Generated by data/petOwner/updatePetOwner "}
  
    // console.log(await getPetOwnerById(existingUserData._id));
    return await getPetOwnerById(existingUserData._id);
  
  }catch(e){
    throw {status: e.status, error: e.error}
  }
  }

}

async function updatePetOwnerFeedbackById(req) {
  try{
    if (!req){
      throw {status:400, error: "req missing. Generated by /data/petOwner/updatePetOwnerFeedbackById"};
    }
    const petOwnerCollection = await petOwnerData();
    let petOwner = await this.getPetOwnerByUserEmail(req.session.user.email);

    const addFeedback = {
      date: new Date(),
      rating: req.body.rating,
      feedback: req.body.experience,
      feedbackGivenBy: petOwner._id
    };
    addFeedback._id = ObjectId();

    petOwner.websiteFeedbackGiven.push(addFeedback);

    petOwner._id = ObjectId(petOwner._id);

    const updateInfo = await petOwnerCollection.updateOne({ _id: ObjectId(petOwner._id) }, { $set: petOwner });
    if (updateInfo.modifiedCount === 0)
      throw {status:500, error: "Not able to update db.Generated by /data/petOwner/updatePetOwnerFeedbackById"};
  }catch(e){
      throw {status:e.status, error: e.error};
  }

}

async function updatePassword(userId, plainTextPassword) {
  try{
       //check for type of ID and password
        if (!userId) {
          throw {status: 400, error: "User id must be provided. Generated by data/petOwner/updatePassword" };
        }
        if (!ObjectId.isValid(userId)) {
          throw {
            status: 400,
            error: "Invalid petOwner/adopter id. Generated by Generated by data/petOwner/updatePassword",
          }
        }
        if (!plainTextPassword) {
          throw {status: 400, error: "password must be provided.Generated by data/petOwner/updatePassword" };
        }

        if (plainTextPassword.trim().length < 6) {
          throw {status: 400, error: "Password must contain at least 6 characters. Generated by data/petOwner/updatePassword" };
        }

        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        const petOwnerCollection = await petOwnerData();

        const updateInfo = await petOwnerCollection.updateOne(
          { _id: ObjectId(userId) },
          { $set: { "password": hashedPassword } }
        );

        if (updateInfo.matchedCount === 0 && updateInfo.modifiedCount === 0)
          throw {status: 500, error: "Could not update password.Generated by data/petOwner/updatePassword"};

        return await getPetOwnerById(userId);
  }catch(e){
      throw {status:e.status, error: e.error};
  }

}

//this function updates the profile picture
async function updateProfileImage(email, picture) {

  try{
    if (email === undefined || email.trim() === ""){
      throw {
        status: 400,
        error: "Email must be provided. Generated by /data/petOwner/updateProfileImage",
      }
    }

     if (!validateEmail(email)) {
      throw {
        status: 400,
        error:
          "E-Mail not in correct format. Generated by /data/petOwner/updateProfileImage",
      };
    }
    if (!picture) throw {
      status: 400,
      error:
        "profile picture must be provided. Generated by /data/petOwner/updateProfileImage",
    };

    const userDetails = await getPetOwnerByUserEmail(email);

    const petOwnerCollection = await petOwnerData();
    const updateInfo = await petOwnerCollection.updateOne(
      { _id: ObjectId(userDetails._id) },
      { $set: { "profilePicture": picture } }
    );
  
    if (updateInfo.matchedCount === 0 && updateInfo.modifiedCount === 0)
      throw {status:500, error:"Could not update profile picture.Generated by /data/petOwner/updateProfileImage "}
  
    return await getPetOwnerById(ObjectId(userDetails._id));

  }catch(e){
    throw{status:e.status, error:e.error};
  } 

}

//this function returns the data
async function getShelterReviews(shelterReviewsArray, userId) {

  try{
    let shelterReviewDetails = [];
      //console.log(typeof userId);
      if (!Array.isArray(shelterReviewsArray)) throw {status:400, error: "Shelter reviews must be an array. generated by data/petOwner/getShelterReviews"};



      for (let index = 0; index < shelterReviewsArray.length; index++) {
        const parsedId = ObjectId(shelterReviewsArray[index]);
        //console.log(parsedId);
        const reviewData = await shelterAndRescueCollection.findOne({ "reviews._id": parsedId }, { projection: { _id: 0, reviews: 1, name: 1 } });


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
  }catch(e){
    throw {status:e.status, error:e.error}
  }
}

async function getUserFavoritePets(favoritePetArray) {
  try{
    if (!Array.isArray(favoritePetArray)) throw {status:400, error:"favoritePets must be an array generated by data/petOwner/getUserFavoritePets"};
      const petCollection = await petData();
      let favoritePetsDetails = [];
      for (let i = 0; i < favoritePetArray.length; i++) {

        const petDetails = await petCollection.findOne({ _id: ObjectId(favoritePetArray[i]) });
        if (petDetails == null) throw {status:500, error:"pet not found. generated by data/petOwner/getUserFavoritePets"};
        favoritePetsDetails.push({
          id: petDetails._id,
          name: petDetails.petName,
          image: petDetails.petPictures[0]
        });
      }
      // for (let index = 0; index < favoritePetsDetails.length; index++)
      //   console.log(favoritePetsDetails[index]);
      return favoritePetsDetails;
  }catch(e){
    throw {status:e.status, error: e.error};
  } 
}

async function updateVolunteerStatus(userId, status) {

  try{  
    if (!userId) {
      throw {status: 400, error: "User id must be provided. Generated by data/petOwner/updateVolunteerStatus" };
    }
    if (!ObjectId.isValid(userId)) {
      throw {
        status: 400,
        error: "Invalid petOwner/adopter id. Generated by Generated by data/petOwner/updateVolunteerStatus",
      }
    }
    if (!status) {
      throw {status: 400, error: "status must be provided.Generated by data/petOwner/updateVolunteerStatus" };
    }

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
        throw {status: 500, error: " Could not update password. generated by /data/petOwner/updateVolunteerStatus"}

      return await getPetOwnerById(userId);
  }catch(e){
    throw{status:e.status, error:e.error};
  }
}

async function getPetCount() {


  try{
    const shelterAndRescueCollection = await shelterAndRescueData();

    const shelterData = await shelterAndRescueCollection.find({}).toArray();
  
    if (shelterData == null) throw { status:404, error: "shelter data does not exist. generated by /data/petOwner/getPetCount"};
    let total = 0
    for (let i = 0; i < shelterData.length; i++) {
      total += shelterData[i].adoptedPets.length;
    }
    return total;
  }catch(e){
    throw {status: e.status, error: e.error}

  }
}

async function getAllUsersWithFavoritePet(id) {
  try{
    if (!id) throw {status:400, error: "The input id is missing. generated by /data/petOwner/getAllUsersWithFavoritePet"};
    // If the id provided is not a string, or is an  empty string, the method should throw
    if (typeof id !== "string") throw {status:400, error: "The input must be a string. generated by /data/petOwner/getAllUsersWithFavoritePet"};
    if (id.trim().length === 0) throw {status:400, error: "The input must not be empty. generated by /data/petOwner/getAllUsersWithFavoritePet"};
    // If the id provided is not a valid ObjectId, the method should throw
    // if it cannot be converted to ObjectId, it will automatically throw an error
    let parsedId = ObjectId(id);

    const userCollection = await petOwnerData();
    let userResults = await userCollection.find({ favoritedPets: id }).toArray();
    let userIds = [];

    for (let user of userResults) {
      userIds.push(user._id.toString());
    }

    return userIds;
  }catch(e){
    throw {status:e.status, error:e.error}
  }
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

  checkVolunteer,
  updateVolunteerStatus,
  getPetCount,

  getAllUsersWithFavoritePet,

};
