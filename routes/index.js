const getAPetRoutes = require("./getAPetApi");

const constructorMethod = (app) => {
  app.use("/", getAPetRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
