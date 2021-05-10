const mongoCollections = require("../config/mongoCollections");
const petAdopterAndOwner = mongoCollections.petAdopterAndOwner;
const shelterAndRescue = mongoCollections.shelterAndRescue;
var ObjectID = require("mongodb").ObjectID;

const exportedMethods = {
  async getShelterById(id) {
    if (!id) throw "The input argument 'id' is missing.";
    if (typeof id != "string") throw "The input 'id' must be a string.";
    if (id.trim().length === 0) throw "The input 'id' must not be empty.";

    let parsedId = ObjectID(id);

    const sheltersCollection = await shelterAndRescue();
    let shelter = await sheltersCollection.findOne({ _id: parsedId });

    // If the no shelter exists with that id, the method should throw
    if (shelter === null) throw "Shelter not found";

    shelter._id = shelter._id.toString();

    return shelter;
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
  }
};

module.exports = exportedMethods;
