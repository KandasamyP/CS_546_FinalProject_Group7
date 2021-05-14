const MongoClient = require("mongodb").MongoClient;
const settings = require("./settings.json");

const mongoConfig = settings.mongoConfig;
mongoConfig.serverUrl = `mongodb+srv://admin:${process.env.DB_PASSWORD}@getapet.yu3ss.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
let _connection = undefined;
let _db = undefined;

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    });
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};
