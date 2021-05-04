const petsRoute = require("./pets");
const shelterRoute = require("./shelters");

const constructorMethod = (app) => {
	app.use("/pets", petsRoute);
	app.use("/shelters", shelterRoute);

	// All other URLS should return a 404
	app.use("*", (req, res) => {
		//res.status(404).render("error", {title: "404 Error", number: 404, error: "That page does not exist."});
		res.redirect("/");
	});
};

module.exports = constructorMethod;