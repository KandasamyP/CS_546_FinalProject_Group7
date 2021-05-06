const getAPetData = require("./getAPetData");
const petsData = require('./pets');
const sheltersData = require("./shelters");

module.exports = {
  getAPetData: getAPetData,
  pets: petsData,
  shelters: sheltersData
};
