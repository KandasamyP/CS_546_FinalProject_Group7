const shelterRoutes = require('./shelters')
const feedbackRoutes = require('./feedback')
const helpPageRoutes = require('./helppage')

const constructorMethod = (app) => {
  //app.use("/", shelterRoutes);
  app.use('/shelters', shelterRoutes);
  app.use('/helppage', helpPageRoutes);
  app.use('/feedback', feedbackRoutes);
  app.use("*", (req, res) => {
    // res.status(404).json({ error: "Not found" });
    res.redirect("/");
  });
};

module.exports = constructorMethod;
