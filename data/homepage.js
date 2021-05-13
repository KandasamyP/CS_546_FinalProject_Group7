const mongoCollections = require("../config/mongoCollections");
const petAdopterAndOwner = mongoCollections.petAdopterAndOwner;
const shelterAndRescue = mongoCollections.shelterAndRescue;
var ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const exportedMethods = {
  async logInUser(loginData) {
    try {
      function validateEmail(email) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }

      if (loginData.email === undefined || loginData.email.trim() === "") {
        throw {
          status: 400,
          error: "E-Mail not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (!validateEmail(loginData.email)) {
        throw {
          status: 400,
          error:
            "E-Mail not in correct format - Generated by '/data/homepageData.js'.",
        };
      }

      if (
        loginData.password === undefined ||
        loginData.password.trim() === ""
      ) {
        throw {
          status: 400,
          error: "Password not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (
        loginData.userType === "undefined" ||
        (loginData.userType !== "srUser" && loginData.userType !== "popaUser")
      ) {
        throw {
          status: 400,
          error: "User type not passed - Generated by '/routes/getAPetApi.js'.",
        };
      }
    } catch (e) {
      throw { status: e.status, error: e.error };
    }

    loginData.email = loginData.email.toLowerCase();
    loginData.email = loginData.email.trim();

    try {
      var collection =
        loginData.userType === "srUser"
          ? await shelterAndRescue()
          : await petAdopterAndOwner();

      const alreadyRegistered = await collection.findOne({
        email: loginData.email,
      });

      if (alreadyRegistered === null) {
        return false;
      } else {
        const match = await bcrypt.compare(
          loginData.password,
          alreadyRegistered.password
        );
        if (match) {
          return true;
        } else {
          return false;
        }
      }
    } catch (e) {
      throw { status: 500, message: e };
    }
  },

  async addSr(srData) {
    try {
      function validateEmail(email) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }

      if (srData.email === undefined || srData.email.trim() === "") {
        throw {
          status: 400,
          error: "E-Mail not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (!validateEmail(srData.email)) {
        throw {
          status: 400,
          error:
            "E-Mail not in correct format - Generated by '/data/homepageData.js'.",
        };
      }

      if (srData.password === undefined || srData.password.trim() === "") {
        throw {
          status: 400,
          error: "Password not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (srData.name === undefined || srData.name.trim() === "") {
        throw {
          status: 400,
          error:
            "Shelter/Rescue name not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (
        srData.profilePicture === undefined ||
        srData.profilePicture.trim() === ""
      ) {
        throw {
          status: 400,
          error:
            "Profile Picture public not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (srData.state === undefined || srData.state.trim() === "") {
        throw {
          status: 400,
          error:
            "Location State not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (srData.city === undefined || srData.city.trim() === "") {
        throw {
          status: 400,
          error:
            "Location City not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (
        srData.streetAddress1 === undefined ||
        srData.streetAddress1.trim() === ""
      ) {
        throw {
          status: 400,
          error:
            "Location Street not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (srData.zipCode === undefined || srData.zipCode.trim() === "") {
        throw {
          status: 400,
          error: "Zip Code not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (srData.biography === undefined || srData.biography === "") {
        throw {
          status: 400,
          error: "Biography not passed - Generated by '/data/homepageData.js'.",
        };
      }

      function validatePhoneNumber(phoneNumber) {
        const re =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return re.test(String(phoneNumber));
      }

      if (srData.phoneNumber === undefined) {
        throw {
          status: 400,
          error:
            "Phone Number not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (!validatePhoneNumber(srData.phoneNumber)) {
        throw {
          status: 400,
          error:
            "Phone Number not passed in correct format - Generated by '/data/homepageData.js'.",
        };
      }
    } catch (e) {
      res.status(e.status).send({ title: "Error", error: e.error });
      return;
    }

    srData.availablePets = [];
    srData.adoptedPets = [];
    srData.reviews = [];
    srData.websiteFeedbackGiven = [];
    srData.location = {
      country: srData.country,
      state: srData.state,
      city: srData.city,
      streetAddress1: srData.streetAddress1,
      streetAddress2: srData.streetAddress2,
      zipCode: srData.zipCode,
    };
    srData.socialMedia = {
      facebook: srData.facebook,
      instagram: srData.instagram,
      twitter: srData.twitter,
    };

    srData.email = srData.email.toLowerCase();

    delete srData.country;
    delete srData.state;
    delete srData.city;
    delete srData.streetAddress1;
    delete srData.streetAddress2;
    delete srData.zipCode;
    delete srData.facebook;
    delete srData.instagram;
    delete srData.twitter;

    try {
      const shelterAndRescueCollection = await shelterAndRescue();

      const alreadyRegistered = await shelterAndRescueCollection.findOne({
        email: srData.email,
      });

      if (alreadyRegistered === null) {
        await bcrypt.hash(
          srData.password,
          saltRounds,
          async function (err, hash) {
            if (!err) {
              srData.password = hash;
              const newInsertInformation =
                await shelterAndRescueCollection.insertOne(srData);
              if (newInsertInformation.insertedCount === 0) {
                throw {
                  status: 500,
                  error:
                    "Failed to sign up user to DB - Generated by '/data/homepageData.js'.",
                };
              }
            } else {
              throw {
                status: 500,
                error:
                  "Cannot encrypt User Data - Generated by '/data/homepageData.js'.",
              };
            }
          }
        );
        return true;
      } else {
        return false;
      }
    } catch (e) {
      throw { status: e.status, error: e.error };
    }
  },

  async addPoPa(poPaData) {
    try {
      function validateEmail(email) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }

      if (poPaData.email === undefined || poPaData.email.trim() === "") {
        throw {
          status: 400,
          error: "E-Mail not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (!validateEmail(poPaData.email)) {
        throw {
          status: 400,
          error:
            "E-Mail not in correct format - Generated by '/data/homepageData.js'.",
        };
      }

      if (poPaData.password === undefined || poPaData.password.trim() === "") {
        throw {
          status: 400,
          error: "Password not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (poPaData.fname === undefined || poPaData.fname.trim() === "") {
        throw {
          status: 400,
          error:
            "First name not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (poPaData.lname === undefined || poPaData.lname.trim() === "") {
        throw {
          status: 400,
          error: "Last name not passed - Generated by '/data/homepageData.js'.",
        };
      }

      if (
        poPaData.dateOfBirth === undefined ||
        poPaData.dateOfBirth.trim() === ""
      ) {
        throw {
          status: 400,
          error: "DOB not passed - Generated by '/data/homepageData.js'.",
        };
      }

      //Phone Number
      function validatePhoneNumber(phoneNumber) {
        const re =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return re.test(String(phoneNumber));
      }
      if (poPaData.phoneNumber) {
        if (!validatePhoneNumber(poPaData.phoneNumber)) {
          throw {
            status: 400,
            error:
              "Phone Number not in correct format - Generated by '/data/homepageData.js'.",
          };
        }
      }

      function validateZipCode(zipCode) {
        const re = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
        return re.test(String(zipCode));
      }
      if (poPaData.zipCode) {
        if (!validateZipCode(poPaData.zipCode)) {
          throw {
            status: 400,
            error:
              "Zip Code not in correct format - Generated by '/data/homepageData.js'.",
          };
        }
      }
    } catch (e) {
      throw { status: e.status, error: e.error };
    }

    poPaData.fullName = {
      firstName: poPaData.fname,
      lastName: poPaData.lname,
    };
    poPaData.favoritedPets = [];
    poPaData.websiteFeedbackGiven = [];
    poPaData.shelterReviewsGiven = [];
    poPaData.reportedPosts = [];
    poPaData.donatedItems = [];
    poPaData.isVolunteerCandidate = false;

    poPaData.email = poPaData.email.toLowerCase();

    delete poPaData.fname;
    delete poPaData.lname;

    try {
      const petOwnerCollection = await petAdopterAndOwner();

      const alreadyRegistered = await petOwnerCollection.findOne({
        email: poPaData.email,
      });

      if (alreadyRegistered === null) {
        await bcrypt.hash(
          poPaData.password,
          saltRounds,
          async function (err, hash) {
            if (!err) {
              poPaData.password = hash;
              const newInsertInformation = await petOwnerCollection.insertOne(
                poPaData
              );
              if (newInsertInformation.insertedCount === 0) {
                throw {
                  status: 500,
                  error:
                    "Failed to sign up user to DB - Generated by '/data/homepageData.js'.",
                };
              }
            } else {
              throw {
                status: 500,
                error:
                  "Cannot encrypt User Data - Generated by '/data/homepageData.js'.",
              };
            }
          }
        );
        return true;
      } else {
        return false;
      }
    } catch (e) {
      throw { status: e.status, error: e.error };
    }
  },
};

module.exports = exportedMethods;
