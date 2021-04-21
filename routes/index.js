const petOwnerRoute = require("./petOwner");

const constructorMethod = (app)=>{
    app.use("/petOwner",petOwnerRoute);
    app.use("/",petOwnerRoute);
    app.use("*", (request, response)=>{
        response.status(404).json({error: "The requested resource is not found."});
    });
};

module.exports = constructorMethod;
