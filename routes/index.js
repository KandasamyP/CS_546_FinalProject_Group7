
  const petOwnerRoute = require("./petOwner");
const getAPetRoutes = require("./getAPetApi");
const petsRoute = require("./pets");
const shelterRoute = require("./shelters");

const constructorMethod = (app) => {
  app.use("/", getAPetRoutes);
  app.use("/pets", petsRoute);
  app.use("/shelters", shelterRoute);
   app.use("/petOwner",petOwnerRoute);
    app.use("/addUser",petOwnerRoute);

  // All other URLs will return a 404 Error
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });

};

module.exports = constructorMethod;
