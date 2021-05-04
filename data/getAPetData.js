const mongoCollections = require("../config/mongoCollections");
const petAdopter = mongoCollections.petAdopter;
const shelterAndRescue = mongoCollections.shelterAndRescue;
var ObjectID = require("mongodb").ObjectID;

const exportedMethods = {
  async addSr(srData) {
    srData.availablePets = [];
    srData.adoptedPets = [];
    srData.reviews = [];
    srData.websiteFeedbackGiven = [];
    srData.location = {
      country: srData.country,
      state: srData.state,
      city: srData.city,
    };

    delete srData.country;
    delete srData.state;
    delete srData.city;

    try {
      const shelterAndRescueCollection = await shelterAndRescue();

      const newInsertInformation = await shelterAndRescueCollection.insertOne(
        srData
      );
      if (newInsertInformation.insertedCount === 0)
        throw {
          status: 500,
          error:
            "Failed to sign up user to DB - Generated by '/data/books.js'.",
        };

      return srData;
    } catch (e) {
      throw { status: e.status, error: e.error };
    }
  },

  async addPoPa(poPaData) {
    poPaData.fullName = {
      fname: poPaData.fname,
      lname: poPaData.lname,
    };
    poPaData.favoritedPets = [];
    poPaData.websiteFeedbackGiven = [];
    poPaData.shelterReviewsGiven = [];
    poPaData.reportedPosts = [];
    poPaData.donatedItems = [];
    poPaData.isVolunteerCandidate = false;

    delete poPaData.fname;
    delete poPaData.lname;

    try {
      const petOwnerCollection = await petAdopter();

      const newInsertInformation = await petOwnerCollection.insertOne(poPaData);
      if (newInsertInformation.insertedCount === 0)
        throw {
          status: 500,
          error:
            "Failed to sign up user to DB - Generated by '/data/books.js'.",
        };

      return poPaData;
    } catch (e) {
      throw { status: e.status, error: e.error };
    }
  },
};

module.exports = exportedMethods;
