const petsRoute = require("./pets");
const path = require("path");

const constructorMethod = (app) => {
	app.use("/pets", petsRoute);

	/*app.get("/", (req, res) => {
		res.sendFile(path.resolve("static/index.html")); 
	});*/

	// All other URLS should return a 404
	app.use("*", (req, res) => {
		//res.status(404).render("error", {title: "404 Error", number: 404, error: "That page does not exist."});
		res.redirect("/");
	});
};

module.exports = constructorMethod;