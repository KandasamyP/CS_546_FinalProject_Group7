const mongoCollections = require("../config/mongoCollections");
let { ObjectId } = require("mongodb");
const messages = mongoCollections.messages;
const petOwners = require("./petOwner");
const sheltersRescues = require("./shelterAndRescue");

const exportedMethods = {
  // This async function will return the newly created message thread
  // Note: ONLY pet owner users can start threads!! So by default the sender is petOwner
  async addNewThread(petOwner, shelterRescue, messageText) {
    // If petOwnder id is provided, the method should throw
    if (!petOwner || !shelterRescue || !messageText)
      throw "An input is missing.";
    // If the inputs provided are not strings, or are empty strings, the method should throw
    if (typeof petOwner != "string")
      throw "The input 'petOwner' must be a string.";
    if (petOwner.trim().length === 0)
      throw "The input 'petOwner' must not be empty.";
    if (typeof shelterRescue != "string")
      throw "The input 'shelterRescue' must be a string.";
    if (shelterRescue.trim().length === 0)
      throw "The input 'shelterRescue' must not be empty.";
    if (typeof messageText != "string")
      throw "The input 'messageText' must be a string.";
    if (messageText.trim().length === 0)
      throw "The input 'messageText' must not be empty.";
    // If the ids provided are not valid ObjectIds, the method should throw
    let parsedPetOwnerId = ObjectId(petOwner);
    let parsedShelterRescueId = ObjectId(shelterRescue);
    // Make sure petOwner and shelterRescue exist in their respective databases
    await petOwners.getPetOwnerById(petOwner);
    await sheltersRescues.getShelterById(shelterRescue);

    const messageCollection = await messages();
    let currentTime = new Date();

    let newThread = {
      // for ease, participants will have the pet owner id first and shelter id second
      participants: [petOwner, shelterRescue],
      messages: [
        {
          sender: petOwner,
          timestamp: currentTime,
          messageText: messageText,
        },
      ],
    };

    const insertInfo = await messageCollection.insertOne(newThread);

    // If the message thread cannot be created, the method should throw
    if (insertInfo.insertedCount === 0)
      throw "The message thread could not be created.";

    const newId = insertInfo.insertedId;
    let thread = await this.getThreadById(newId.toString());
    thread._id = thread._id.toString();

    return thread;
  },

  // When given an id, this function will return a message thread from the database.
  async getThreadById(id) {
    // If no id is provided, the method should throw
    if (!id) throw "The input argument 'id' is missing.";
    // If the id provided is not a string, or is an  empty string, the method should throw
    if (typeof id != "string") throw "The input 'id' must be a string.";
    if (id.trim().length === 0) throw "The input 'id' must not be empty.";
    // If the id provided is not a valid ObjectId, the method should throw
    // if it cannot be converted to ObjectId, it will automatically throw an error
    let parsedId = ObjectId(id);

    const messageCollection = await messages();
    let thread = await messageCollection.findOne({ _id: parsedId });

    // If the no thread exists with that id, the method should throw
    if (thread === null) throw "Thread not found";

    thread._id = thread._id.toString();
    return thread;
  },

  async addMessage(threadId, sender, messageText) {
    // If threadId, sender, or messageText are not provided, the method should throw
    if (!threadId || !sender || !messageText)
      throw "There is at least one missing input argument.";
    // If the inputs provided are not strings, or are empty strings, the method should throw
    if (typeof threadId != "string")
      throw "The input 'threadId' must be a string.";
    if (threadId.trim().length === 0)
      throw "The input 'threadId' must not be empty.";
    if (typeof sender != "string") throw "The input 'sender' must be a string.";
    if (sender.trim().length === 0)
      throw "The input 'sender' must not be empty.";
    if (typeof messageText != "string")
      throw "The input 'messageText' must be a string.";
    if (messageText.trim().length === 0)
      throw "The input 'messageText' must not be empty.";
    // If the ids provided are not valid ObjectIds, the method should throw
    let parsedThreadId = ObjectId(threadId);
    let parsedSenderId = ObjectId(sender);

    let currentTime = new Date();

    const messageCollection = await messages();

    let newMessage = {
      sender: sender,
      timestamp: currentTime,
      messageText: messageText,
    };

    const insertInfo = await messageCollection.updateOne(
      { _id: parsedThreadId },
      { $push: { messages: newMessage } }
    );

    if (insertInfo.insertedCount === 0)
      throw "The message could not be created.";

    return await this.getThreadById(threadId);
  },

  // When given an id, this function will return a list of message threads from the database.
  async getThreadsByParticipant(id) {
    // If no id is provided, the method should throw
    if (!id) throw "The input argument 'id' is missing.";
    // If the id provided is not a string, or is an  empty string, the method should throw
    if (typeof id != "string") throw "The input 'id' must be a string.";
    if (id.trim().length === 0) throw "The input 'id' must not be empty.";
    // If the id provided is not a valid ObjectId, the method should throw
    // if it cannot be converted to ObjectId, it will automatically throw an error
    let parsedId = ObjectId(id);

    const messageCollection = await messages();
    let threadList = await messageCollection
      .find({ participants: { $in: [id] } })
      .toArray();

    // reorder participants arrays so that user's id is always first
    // and while in the loop, grab the second participant's name
    if (threadList.length > 0) {
      for (let thread of threadList) {
        // first participant should be pet owner
        // second participant should be shelter/rescue
        let petOwner = await petOwners.getPetOwnerById(thread.participants[0]);
        let shelter = await sheltersRescues.getShelterById(
          thread.participants[1]
        );
        thread.petOwnerName =
          petOwner.fullName.firstName + " " + petOwner.fullName.lastName;
        thread.shelterName = shelter.name;

        if (thread.participants[0] !== id) {
          let x = thread.participants[0];
          thread.participants[0] = thread.participants[1];
          thread.participants[1] = x;
        }

        thread._id = thread._id.toString();
      }
    }

    return threadList;
  },

  // When given an array of ids, this function will return a message thread from the database if it exists
  async getThreadByParticipants(array) {
    // Input must be an array
    if (!array) throw "The input participants array is missing.";
    if (!Array.isArray(array)) throw "The participants must be in an array.";
    if (array.length !== 2)
      throw "The participants array must have two entries.";
    if (typeof array[0] !== "string" || typeof array[1] !== "string")
      throw "The two participants must be strings.";
    if (array[0].trim().length === 0 || array[1].trim().length === 0)
      throw "The strings in the array cannot be empty.";
    // The participants must be ObjectIds
    let parsedId1 = ObjectId(array[0]);
    let parsedId2 = ObjectId(array[1]);

    const messageCollection = await messages();
    let thread = await messageCollection.findOne({
      participants: { $all: array },
    });

    // Do NOT throw error if there's no thread; just return null
    if (thread === null) {
      return null;
    } else {
      thread._id = thread._id.toString();
      return thread;
    }
  },
};

module.exports = exportedMethods;
