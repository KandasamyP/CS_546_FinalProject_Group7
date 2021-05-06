const dbConnection = require("./mongoConnection");

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

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
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

/* Now, you can list your collections here: */
module.exports = {
  petAdopter: getCollectionFn("petAdopter"),
  shelterAndRescue: getCollectionFn("shelterAndRescue"),
  pets: getCollectionFn("pets"),
  messages: getCollectionFn("messages"),
  feedback: getCollectionFn("feedback"),
  reviews: getCollectionFn("reviews"),
  
  pets: getCollectionFn("pets"),
  shelters: getCollectionFn("shelters")
};

