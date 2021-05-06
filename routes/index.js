const getAPetRoutes = require("./getAPetApi");
const petsRoute = require("./pets");
const shelterRoute = require("./shelters");

const constructorMethod = (app) => {
  app.use("/", getAPetRoutes);
  app.use("/pets", petsRoute);
	app.use("/shelters", shelterRoute);
// All other URLS should return a 404
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;