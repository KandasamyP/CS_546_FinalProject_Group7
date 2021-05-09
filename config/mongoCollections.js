const dbConnection = require("./mongoConnection");

/* This will allow you to have one reference to each collection per app */


const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};


/*list collections here: */

// Collection list to export
module.exports = {
  petAdopterAndOwner: getCollectionFn("petAdopterAndOwner"),
  petOwner: getCollectionFn("petAdopterAndOwner"),
  shelterAndRescue: getCollectionFn("shelterAndRescue"),
  pets: getCollectionFn("pets"),
  messages: getCollectionFn("messages"),
};
