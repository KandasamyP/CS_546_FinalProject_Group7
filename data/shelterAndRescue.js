const mongoCollections = require('../config/mongoCollections');
let { ObjectId } = require("mongodb");
const shelterAndRescue = mongoCollections.shelterAndRescue;
const users = mongoCollections.petAdopterAndOwner;
const userMethods = require("./petOwner");
const res = require('express/lib/response');


let exportedMethods = {
  async create(name, email, password, location, biography, phoneNumber, website, socialMedia, availablePets, adoptedPets, reviews, profilePicture, websiteFeedbackGiven) {
    if (!name || !email || !password || !location || !biography || !phoneNumber || !website || !socialMedia || !availablePets || !adoptedPets || !reviews || !profilePicture || !websiteFeedbackGiven) throw "One of the input paramertes are missing"
    const sheltersCollection = await shelterAndRescue();

    let newShelter = {
      name: name,
      email: email,
      password: password,
      location: location, //object
      biography: biography,
      phoneNumber: phoneNumber,
      website: website,
      socialMedia: socialMedia, //array changed it to object.
      availablePets: availablePets, //array
      adoptedPets: adoptedPets, //array
      reviews: reviews, //Subdoc
      profilePicture: profilePicture,
      websiteFeedbackGiven: websiteFeedbackGiven //Subdoc
    };

    const insertInfo = await sheltersCollection.insertOne(newShelter);
    if (insertInfo.insertedCount === 0) throw 'Could not add shelter';

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

    // must return this as a string!
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

  async updateShelterFeedbackById(req) {
    const sheltersColl = await shelterAndRescue();
    let shelter = await this.getPetShelterByEmail(req.session.user.email);
    //console.log(req)
    const addFeedback = {
      date: new Date(),
      rating: req.body.rating,
      feedback: req.body.experience,
      feedbackGivenBy: shelter._id
    };
    addFeedback._id = ObjectId();
    //console.log(req.session.user.userType)

    shelter.websiteFeedbackGiven.push(addFeedback);

    shelter._id = ObjectId(shelter._id);

    const updateInfo = await sheltersColl.updateOne({ _id: ObjectId(shelter._id) }, { $set: shelter });
    if (updateInfo.modifiedCount === 0)
      throw "Not able to update db";
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

    if (req.session.user) {
      var email = req.session.user.email;
      const petOwnerCollection = await users();
      const petOwner = await userMethods.getPetOwnerByUserEmail(email);

      addReview.reviewer = ObjectId(petOwner._id);
    }
    addReview._id = ObjectId();

   shelter.reviews.push(addReview);

    shelter._id = ObjectId(shelter._id);

    const updateInfo = await sheltersCollection.updateOne({ _id: ObjectId(shelter._id) }, { $set: shelter });
    if (updateInfo.modifiedCount === 0)
      throw "Not able to update db";

    return await this.getShelterById(shelter._id.toString());
  },

  async updateVolunteerById(req) {

    const sheltersCollection = await shelterAndRescue();
    let shelter = await this.getShelterById(req.params.id); 

    if (req.session.user) {
      var email = req.session.user.email;
      const petOwnerCollection = await users();
      const petOwner = await userMethods.getPetOwnerByUserEmail(email);
      if (shelter.volunteerUserId) {
          for(let i=0; i<shelter.volunteerUserId.length;++i) {
            if(shelter.volunteerUserId[i].toString() != petOwner._id) {
              shelter.volunteerUserId.push(ObjectId(petOwner._id));
            }
          }
      } else {
        shelter.volunteerUserId = [];
        shelter.volunteerUserId.push(ObjectId(petOwner._id));
      }
    }  
    shelter._id = ObjectId(shelter._id);

    const updateInfo = await sheltersCollection.updateOne({ _id: ObjectId(shelter._id) }, { $set: shelter });

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

  async getAll() {
    const sheltersCollection = await shelterAndRescue();
    const getAllShelters = sheltersCollection.find({}).toArray();
    return getAllShelters;
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
module.exports = exportedMethods;
