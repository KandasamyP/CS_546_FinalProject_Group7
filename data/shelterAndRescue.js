
  
const mongoCollections = require("../config/mongoCollections");
let { ObjectId } = require("mongodb");
const shelterAndRescue = mongoCollections.shelterAndRescue;

const exportedMethods = {
  // This async function will return the newly created shelter object
  async addShelters(
    name,
    emailAddress,
    location,
    biography,
    phonenumber,
    website,
    socialmedia,
    availablePets,
    adoptedPets,
    reviews,
    websiteFeedbackGiven
  ) {
    // If any inputs are missing, the method should throw
    if (
      (!name,
      !emailAddress,
      !location,
      !biography,
      !phonenumber,
      !website,
      !socialmedia,
      !availablePets,
      !adoptedPets,
      !reviews,
      !websiteFeedbackGiven)
    )
      throw "There is at least one missing input argument.";

    const sheltersCollection = await shelterAndRescue();

    let newShelter = {
      name: name,
      emailAddress: emailAddress,
      location: location,
      biography: biography,
      phonenumber: phonenumber,
      website: website,
      socialmedia: socialmedia, //array
      availablePets: availablePets, //array
      adoptedPets: adoptedPets, // array
      reviews: reviews,
      websiteFeedbackGiven: websiteFeedbackGiven,
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


  
  async getAll() {
    const sheltersCollection = await shelterAndRescue();
    const getAllShelters = sheltersCollection.find({}).toArray();
    return getAllShelters;
  },
  
  async getPetShelterByEmail(shelterEmail) {
    const sheltersCollection = await shelterAndRescue();

    let shelterDetails = await sheltersCollection.findOne({ email: shelterEmail });

    if (shelterDetails == null || !shelterDetails) throw "Shelter not found";

    console.log(shelterDetails)
    // must return this as a string!
    shelterDetails._id = shelterDetails._id.toString();
    console.log(typeof shelterDetails._id)

    return shelterDetails;
  },

  async updateShelter(updatedData) {
    let modifiedData = {
      name: String,
      phoneNumber: String,
      profilePicture: String,
      biography: String,
      location: {
        streetAddress1: String,
        streetAddress2: String,
        city: String,
        stateCode: String,
        zipCode: String,
      },
      socialMedia: Array,
      availablePets: Array
    }
    let existingUserData = await this.getPetShelterByEmail(updatedData.email);

    if (updatedData.name) {
      modifiedData.name = updatedData.name;
    } else {
      modifiedData.name = existingUserData.name;
    }
    if (updatedData.phoneNumber) {
      modifiedData.phoneNumber = updatedData.phoneNumber;
    } else {
      modifiedData.phoneNumber = existingUserData.phoneNumber;
    }
    if (updatedData.profilePicture) {
      modifiedData.profilePicture = updatedData.profilePicture;
    } else {
      modifiedData.profilePicture = existingUserData.profilePicture;
    }
    if (updatedData.biography) {
      modifiedData.biography = updatedData.biography;
    } else {
      modifiedData.biography = existingUserData.biography;
    }

    if (updatedData.location) {
      if (
        updatedData.location.hasOwnProperty("streetAddress1") &&
        updatedData.location.streetAddress1.trim() != ""
      ) {


  // When given an id, this function will return a shelter from the database.
  async getShelterById(id) {
    if (!id) throw "The input argument 'id' is missing.";
    if (typeof id != "string") throw "The input 'id' must be a string.";
    if (id.trim().length === 0) throw "The input 'id' must not be empty.";

    let parsedId = ObjectId(id);

    const sheltersCollection = await shelterAndRescue();
    let shelter = await sheltersCollection.findOne({ _id: parsedId });

    // If the no shelter exists with that id, the method should throw
    if (shelter === null) throw "Shelter not found";


    shelter._id = shelter._id.toString();

    return await this.getShelterById(existingUserData._id);
  },
  async getShelterById(id) {
    if (!id) throw "Please provide a proper ID "
    if (typeof id != "string") throw "Please provide a String based ID"
    if (id.trim().length === 0) throw "Input ID cannot be blank"
    let parsedId = ObjectId(id);
    const sheltersCollection = await shelterAndRescue();
    let shelter = await sheltersCollection.findOne({ _id: parsedId })

    if (shelter === null) throw "shelter not found";
    shelter._id = shelter._id.toString();
    return shelter;
  },

  async updateShelterReviewById(req) {
    if (req && req.params.id) {
      let reviewBody = req.body.reviewBody;
      let rating = req.body.rating;
    }     

    const sheltersCollection = await shelterAndRescue();
    let shelter = await this.getShelterById(req.params.id);

    const addReview = {
      reviewDate: new Date().getTime(),
      rating: req.body.rating,
      reviewBody: req.body.reviewBody
    };
    addReview._id = ObjectId();

   shelter.reviews.push(addReview);

    shelter._id = ObjectId(shelter._id);

    const updateInfo = await sheltersCollection.updateOne({ _id: ObjectId(shelter._id) }, { $set: shelter});
    if (updateInfo.modifiedCount === 0)
      throw "Not able to update db";

    
    return await this.getShelterById(shelter._id.toString());


  },

  async updateShelterReviewById(req) {
    if (req && req.params.id) {
      let reviewBody = req.body.reviewBody;
      let rating = req.body.rating;
    }     

    const sheltersCollection = await shelterAndRescue();
    let shelter = await this.getShelterById(req.params.id);

    const addReview = {
      reviewDate: new Date(),
      rating: parseInt(req.body.rating),
      reviewBody: req.body.reviewBody
    };
    addReview._id = ObjectId();
   shelter.reviews.push(addReview);

    shelter._id = ObjectId(shelter._id);

    const updateInfo = await sheltersCollection.updateOne({ _id: ObjectId(shelter._id) }, { $set: shelter});
    if (updateInfo.modifiedCount === 0)
      throw "Not able to update db";
    
    return await this.getShelterById(shelter._id.toString());
  },
  
  async getUserByEmail(userEmail) {
    const sheltersCollection = await shelterAndRescue();
    let userDetails = await sheltersCollection.findOne({
      email: userEmail,
    });

    if (userDetails == null || !userDetails) throw "User not found.";

    userDetails._id = userDetails._id.toString();

    return userDetails

  },
  
  // SH - I adapted this from the function in petOwner.js
  //returns a petOwner user searches by petOwner Email/Username
  async getShelterAndRescueByUserEmail(srEmail) {
    //check email
    const sheltersCollection = await shelterAndRescue();


    let shelterDetails = await sheltersCollection.findOne({
      email: srEmail,
    });

    if (shelterDetails == null || !shelterDetails) throw "User not found.";

    // convert _id to string for return
    shelterDetails._id = shelterDetails._id.toString();

    return shelterDetails;
  },
        
  async updateShelter(updatedData) {
    let modifiedData = {
      name: String,
      phoneNumber: String,
      profilePicture: String,
      biography: String,
      location: {
        streetAddress1: String,
        streetAddress2: String,
        city: String,
        stateCode: String,
        zipCode: String,
      },
      socialMedia: Array,
      availablePets: Array
    }
    let existingUserData = await this.getPetShelterByEmail(updatedData.email);

    if (updatedData.name) {
      modifiedData.name = updatedData.name;
    } else {
      modifiedData.name = existingUserData.name;
    }
    if (updatedData.phoneNumber) {
      modifiedData.phoneNumber = updatedData.phoneNumber;
    } else {
      modifiedData.phoneNumber = existingUserData.phoneNumber;
    }
    if (updatedData.profilePicture) {
      modifiedData.profilePicture = updatedData.profilePicture;
    } else {
      modifiedData.profilePicture = existingUserData.profilePicture;
    }
    if (updatedData.biography) {
      modifiedData.biography = updatedData.biography;
    } else {
      modifiedData.biography = existingUserData.biography;
    }

    if (updatedData.location) {
      if (
        updatedData.location.hasOwnProperty("streetAddress1") &&
        updatedData.location.streetAddress1.trim() != ""
      ) {

        modifiedData.location["streetAddress1"] = updatedData.location.streetAddress1;
      } else {

        modifiedData.location["streetAddress1"] = existingUserData.location.streetAddress1;
      }
      if (
        updatedData.location.hasOwnProperty("streetAddress2") &&
        updatedData.location.streetAddress2.trim() != ""
      ) {

        modifiedData.location["streetAddress2"] = updatedData.location.streetAddress2;
      } else {

        modifiedData.location["streetAddress2"] = existingUserData.location.streetAddress2;
      }
      if (
        updatedData.location.hasOwnProperty("city") &&
        updatedData.location.city.trim() != ""
      ) {

        modifiedData.location["city"] = updatedData.location.city;
      } else {

        modifiedData.location["city"] = existingUserData.location.city;
      }
      if (
        updatedData.location.hasOwnProperty("stateCode") &&
        updatedData.location.stateCode.trim() != ""
      ) {

        modifiedData.location["stateCode"] = updatedData.location.stateCode;
      } else {

        modifiedData.location["stateCode"] = existingUserData.location.stateCode;
      }
      if (
        updatedData.location.hasOwnProperty("zipCode") &&
        updatedData.location.stateCode.trim() != ""
      ) {

        modifiedData.location["zipCode"] = updatedData.location.zipCode;
      } else {

        modifiedData.location["zipCode"] = existingUserData.location.zipCode;
      }


    } else {
      modifiedData.location = existingUserData.location;
    }
    const sheltersCollection = await shelterAndRescue();
    const updateInfo = await sheltersCollection.updateOne(
      { _id: existingUserData._id },
      { $set: modifiedData }
    );

    if (updateInfo.matchedCount === 0 && updateInfo.modifiedCount === 0)
      throw "Could not update user";

    return await this.getShelterById(existingUserData._id);
  },
}

};

module.exports = exportedMethods;

  

