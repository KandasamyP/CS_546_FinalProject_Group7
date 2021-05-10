const homepage = require("./homepage");
const petOwnerRoute = require("./petOwner");
const petsRoute = require("./pets");
const shelterRoute = require("./sheltersAndRescue");
const feedbackRoutes = require('./feedback')
const helpPageRoutes = require('./helppage')

const constructorMethod = (app) => {
  app.use("/", homepage);
  app.use("/petOwner", petOwnerRoute);
  app.use("/pets", petsRoute);
  app.use("/sheltersAndRescue", shelterRoute);
  app.use('/helppage', helpPageRoutes);
  app.use('/feedback', feedbackRoutes);

  // All other URLs will return a 404 Error
  app.use("*", (req, res) => {
    // res.status(404).json({ error: "Not found" });
    res.redirect("/");
  });
};

module.exports = constructorMethod;
