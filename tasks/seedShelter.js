const dbConnection = require('../config/mongoConnection');
const data = require("../data");
const shelter = data.shelter
const ObjectId = require('mongodb').ObjectID;

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();

    const michealanimalrescue = await shelter.create("Micheal Scott Adoption Company",
        "littleanimallover@gmail.com",
        {
            streetAddress1: "126 Kellium Court",
            streetAddress2: "",
            city: "Scranton",
            stateCode: "PA",
            zipCode: '18510'
        },
        'This is the bio for the shelter owned by micheal.',
        '201 344 5446',
        "micehalscottanimalrescue.com",
        ["facebook.com/michealscottanimalrescue", "twitter.com/michealscottanimalrescue"],
        ["6063d472f5a17f32a5cbdc24", "6064a5d02f56e4da24413ab3"],
        ["6064a5f081004bcfbc33d6c5"],
        {
            _id: ObjectId("6063d5103833261e97e0920b"),
            reviewDate: Date("2021-02-29T06:01:17.171Z"),
            rating: 5,
            reviewBody: "They were very nice and helpful when I was looking for a new pet to adopt!",
            reviewer: ObjectId("6063d0e4be26b8a5128c59e1")
        },
        'http://michealscottanimalrescue.jpg',
        {
            _id: ObjectId("507f1f77bcf86cd799439011"),
            feedback: "This website is user friendly. Posting adoptable pets through this website was easy.",
            date: Date("2021-04-12T06:01:17.171Z"),
            rating: 5
        }

    );

    const dwightanimalrescue = await shelter.create("Dwight K shrute Adoption Company",
        "shrutefarmsadoption@gmail.com",
        {
            streetAddress1: "Rural Rt. 6",
            streetAddress2: "",
            city: "Honesdale",
            stateCode: "PA",
            zipCode: '18431'
        },
        'This is the bio for the shelter owned by dwight.',
        '201 344 5446',
        "dwightschruteanimalrescue.com",
        ["facebook.com/dwightschruteanimalrescue", "twitter.com/dwightschruteanimalrescue"],
        ["6063d472f5a17f32a5cbdc24", "6064a5d02f56e4da24413ab3"],
        ["6064a5f081004bcfbc33d6c5"],
        {
            _id: ObjectId("6063d5103833261e97e0920b"),
            reviewDate: Date("2020-04-01T06:01:17.171Z"),
            rating: 5,
            reviewBody: "They were very nice and helpful when I was looking for a new pet to adopt!",
            // reviewer: ObjectId("6063d0e4be26b8a5128c59e1")
        },
        'http://dwightschruteanimalrescue.jpg',
        {
            _id: ObjectId("507f1f77bcf86cd799439011"),
            feedback: "This website is user friendly. Posting adoptable pets through this website was easy.",
            date: Date("2021-03-12T06:01:17.171Z"),
            rating: 5
        }

    );

    const jimanimalrescue = await shelter.create("Jim Helpert Adoption Company",
        "jimhelpertadoption@gmail.com",
        {
            streetAddress1: "Calvert Street",
            streetAddress2: "",
            city: " Van Nuys",
            stateCode: "PA",
            zipCode: '13831'
        },
        'This is the bio for the shelter owned by jim.',
        '201 344 5446',
        "jimhelpertanimalrescue.com",
        ["facebook.com/jimhelpertanimalrescue", "twitter.com/jimhelpertanimalrescue"],
        ["6063d472f5a17f32a5cbdc24", "6064a5d02f56e4da24413ab3"],
        ["6064a5f081004bcfbc33d6c5"],
        {
            _id: ObjectId("6063d5103833261e97e0920b"),
            reviewDate: Date("2021-01-23T06:01:17.171Z"),
            rating: 5,
            reviewBody: "They were very nice and helpful when I was looking for a new pet to adopt!",
            reviewer: ObjectId("6063d0e4be26b8a5128c59e1")
        },
        'http://jimhelpertanimalrescue.jpg',
        {
            _id: ObjectId("507f1f77bcf86cd799439011"),
            feedback: "This website is user friendly. Posting adoptable pets through this website was easy.",
            date: Date("2020-05-02T06:01:17.171Z"),
            rating: 5
        }

    );
    const pamanimalrescue = await shelter.create("Pam beesly Adoption Company",
        "pambeeslyadoption@gmail.com",
        {
            streetAddress1: "Calvert Street",
            streetAddress2: "",
            city: " Van Nuys",
            stateCode: "PA",
            zipCode: '13831'
        },
        'This is the bio for the shelter owned by pam.',
        '201 344 5447',
        "pambeeslyanimalrescue.com",
        ["facebook.com/pambeeslyanimalrescue", "twitter.com/pambeeslyanimalrescue"],
        ["6063d472f5a17f32a5cbdc24", "6064a5d02f56e4da24413ab3"],
        ["6064a5f081004bcfbc33d6c5"],
        {
            _id: ObjectId("6063d5103833261e97e0920b"),
            reviewDate: Date("2021-02-2T06:01:17.171Z"),
            rating: 5,
            reviewBody: "They were very nice and helpful when I was looking for a new pet to adopt!",
            reviewer: ObjectId("6063d0e4be26b8a5128c59e1")
        },
        'http://pambeeslyanimalrescue.jpg',
        {
            _id: ObjectId("507f1f77bcf86cd799439011"),
            feedback: "This website is user friendly. Posting adoptable pets through this website was easy.",
            date: Date("2020-05-02T06:01:17.171Z"),
            rating: 5
        }

    );
    const kellyanimalrescue = await shelter.create("kelly kapoor Adoption Company",
        "kellykapooradoption@gmail.com",
        {
            streetAddress1: "Calvert Street",
            streetAddress2: "",
            city: " Van Nuys",
            stateCode: "PA",
            zipCode: '13831'
        },
        'This is the bio for the shelter owned by kelly.',
        '201 344 5447',
        "kellykapooranimalrescue.com",
        ["facebook.com/kellykapooranimalrescue", "twitter.com/kellykapooranimalrescue"],
        ["6063d472f5a17f32a5cbdc24", "6064a5d02f56e4da24413ab3"],
        ["6064a5f081004bcfbc33d6c5"],
        {
            _id: ObjectId("6063d5103833261e97e0920b"),
            reviewDate: Date("2021-03-21T06:01:17.171Z"),
            rating: 5,
            reviewBody: "They were very nice and helpful when I was looking for a new pet to adopt!",
            reviewer: ObjectId("6063d0e4be26b8a5128c59e1")
        },
        'http://kellykapooranimalrescue.jpg',
        {
            _id: ObjectId("507f1f77bcf86cd799439011"),
            feedback: "This website is user friendly. Posting adoptable pets through this website was easy.",
            date: Date("2020-05-02T06:01:17.171Z"),
            rating: 5
        }

    );
    const ryananimalrescue = await shelter.create("ryan howard Adoption Company",
        "ryanhowardadoption@gmail.com",
        {
            streetAddress1: "Calvert Street",
            streetAddress2: "",
            city: " Van Nuys",
            stateCode: "PA",
            zipCode: '13831'
        },
        'This is the bio for the shelter owned by kelly.',
        '201 344 5447',
        "ryanhowardanimalrescue.com",
        ["facebook.com/ryanhowardanimalrescue", "twitter.com/ryanhowardanimalrescue"],
        ["6063d472f5a17f32a5cbdc24", "6064a5d02f56e4da24413ab3"],
        ["6064a5f081004bcfbc33d6c5"],
        {
            _id: ObjectId("6063d5103833261e97e0920b"),
            reviewDate: Date("2021-04-21T06:01:17.171Z"),
            rating: 5,
            reviewBody: "They were very nice and helpful when I was looking for a new pet to adopt!",
            reviewer: ObjectId("6063d0e4be26b8a5128c59e1")
        },
        'http://ryanhowardanimalrescue.jpg',
        {
            _id: ObjectId("507f1f77bcf86cd799439011"),
            feedback: "This website is user friendly. Posting adoptable pets through this website was easy.",
            date: Date("2020-05-02T06:01:17.171Z"),
            rating: 5
        }

    );
    console.log('Done seeding database');

    await db.serverConfig.close();
}

main();
