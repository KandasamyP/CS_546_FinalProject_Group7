const mongoCollections = require("../config/mongoCollections");
let { ObjectId } = require("mongodb");
const messages = mongoCollections.messages;

const exportedMethods = {
    // This async function will return the newly created message thread
    async addNewThread(participants, sender, messageText) {
        const messageCollection = await messages();
        let currentTime = new Date();

        let newThread = {
            participants: participants,
            messages: [
                {
                    sender: sender,
                    timestamp: currentTime,
                    messageText: messageText
                }
            ]
        };

        const insertInfo = await messageCollection.insertOne(newThread);

        // If the message thread cannot be created, the method should throw
        if (insertInfo.insertedCount === 0) throw "The message thread could not be created.";

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
        
        let parsedId = ObjectId(threadId);
        let currentTime = new Date();

        const messageCollection = await messages();

        let newMessage = {
            sender: sender,
            timestamp: currentTime,
            messageText: messageText
        }; 

        const insertInfo = await messageCollection.updateOne({ _id: parsedId }, { $push: { messages: newMessage } });

        if (insertInfo.insertedCount === 0) throw "The message could not be created.";

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
        //let parsedId = ObjectId(id);

        const messageCollection = await messages();
        let threadList = await messageCollection.find({ participants: {$in: [id]} }).toArray();

        // reorder participants arrays so that user's id is always first
        if (threadList.length > 0) {
            for (let thread of threadList) {
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

    // When given an id, this function will return a message thread from the database.
    async getThreadByParticipants(array) {
        const messageCollection = await messages();
        let thread = await messageCollection.findOne({ participants: {$all: array} });

        return thread._id.toString();
    }
};

module.exports = exportedMethods;