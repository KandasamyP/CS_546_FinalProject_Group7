
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

  // When given an id, this function will return a shelter from the database.
  async getShelterById(id) {
    if (!id) throw "The input argument 'id' is missing.";
    if (typeof id != "string") throw "The input 'id' must be a string.";
    if (id.trim().length === 0) throw "The input 'id' must not be empty.";

    let parsedId = ObjectId(id);


    };

    const insertInfo = await sheltersCollection.insertOne(newShelter);
    if (insertInfo.insertedCount === 0) throw 'Could not add shelter';

    const newId = insertInfo.insertedId;
    let shelter = await this.getShelterByID(newId.toString());
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