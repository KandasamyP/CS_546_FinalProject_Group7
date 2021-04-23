const shelterRoutes = require('./shelter')

const constructorMethod = (app) => {
  //app.use("/", shelterRoutes);
  app.use('/shelter', shelterRoutes);
  app.use("*", (req, res) => {
    // res.status(404).json({ error: "Not found" });
    res.redirect("/");
  });
};

module.exports = constructorMethod;
