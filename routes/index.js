const shelterRoutes = require('./shelter')
const feedbackRoutes = require('./feedback')
const volunteer = require('./volunteer')
const helpPageRoutes = require('./helppage')

const constructorMethod = (app) => {
  //app.use("/", shelterRoutes);
  app.use('/shelter', shelterRoutes);
  app.use('/helppage', helpPageRoutes);
  app.use('/feedback', feedbackRoutes);
  app.use('/volunteer', volunteer);
  app.use("*", (req, res) => {
    // res.status(404).json({ error: "Not found" });
    res.redirect("/");
  });
};

module.exports = constructorMethod;
