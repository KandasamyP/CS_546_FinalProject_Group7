const dbConnection = require('../config/mongoConnection');
const data = require("../data");
const shelters = data.shelterAndRescueData
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");
const saltRounds = 16;

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    const hashedPassword1 = await bcrypt.hash("micheal123", saltRounds);
    const michealanimalrescue = await shelters.create("Micheal Scott Adoption Company",
        "littleanimallover@gmail.com",
        hashedPassword1,
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
        {
            facebook: "facebook.com/michealscottanimalrescue", instagram: "instagram.com/michealscottanimalrescue", twitter: "twitter.com/michealscottanimalrescue"
        },
        ["6063d472f5a17f32a5cbdc24", "6064a5d02f56e4da24413ab3"],
        ["6064a5f081004bcfbc33d6c5"],
        [{
            _id: ObjectId("6063d5103833261e97e0920b"),
            reviewDate: Date("2021-02-29T06:01:17.171Z"),
            rating: 5,
            reviewBody: "They were very nice and helpful when I was looking for a new pet to adopt!",
            reviewer: ObjectId("609ae47dd71757333c314314")
        },
        {
            _id: ObjectId("6063d536f6ab4b941689879f"),
            reviewDate: Date("2021-02-29T06:01:17.171Z"),
            rating: 5,
            reviewBody: "They were very nice and helpful when I was looking for a new pet to adopt!",
            reviewer: ObjectId("609ae47dd71757333c314314")
          
        }
        ],
        '/public/images/shelters/MSwithcat.png',
        [{
            _id: ObjectId("507f1f77bcf86cd799439011"),
            feedback: "This website is user friendly. Posting adoptable pets through this website was easy.",
            date: Date("2021-04-12T06:01:17.171Z"),
            rating: 5
        }]

    );
    const hashedPassword2 = await bcrypt.hash("dwight123", saltRounds);
    const dwightanimalrescue = await shelters.create("Dwight K shrute Adoption Company",
        "shrutefarmsadoption@gmail.com",
        hashedPassword2,
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
        { facebook: "facebook.com/dwightschruteanimalrescue", instagram: "instagram.dwightshruteanimalrescue", twitter: "twitter.com/dwightschruteanimalrescue" },
        ["6063d472f5a17f32a5cbdc24", "6064a5d02f56e4da24413ab3"],
        ["6064a5f081004bcfbc33d6c5"],
        [{
            _id: ObjectId("6063d5103833261e97e0920b"),
            reviewDate: Date("2020-04-01T06:01:17.171Z"),
            rating: 5,
            reviewBody: "They were very nice and helpful when I was looking for a new pet to adopt!",
            reviewer: ObjectId("6063d0e4be26b8a5128c59e1")
        }],
        '/public/images/shelters/DSwithcat.jpg',
        [{
            _id: ObjectId("507f1f77bcf86cd799439011"),
            feedback: "This website is user friendly. Posting adoptable pets through this website was easy.",
            date: Date("2021-03-12T06:01:17.171Z"),
            rating: 5
        }]

    );
    const hashedPassword3 = await bcrypt.hash("jim123", saltRounds);
    const jimanimalrescue = await shelters.create("Jim Helpert Adoption Company",
        "jimhelpertadoption@gmail.com",
        hashedPassword3,
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
        { facebook: "facebook.com/jimhelpertanimalrescue", instagram: "instagram/jimhelpertanimalrescue", twitter: "twitter.com/jimhelpertanimalrescue" },
        ["6063d472f5a17f32a5cbdc24", "6064a5d02f56e4da24413ab3"],
        ["6064a5f081004bcfbc33d6c5"],
        [{
            _id: ObjectId("6063d5103833261e97e0920b"),
            reviewDate: Date("2021-01-23T06:01:17.171Z"),
            rating: 5,
            reviewBody: "They were very nice and helpful when I was looking for a new pet to adopt!",
            reviewer: ObjectId("6063d0e4be26b8a5128c59e1")
        }],
        '/public/images/shelters/JHwithcat.png',
        [{
            _id: ObjectId("507f1f77bcf86cd799439011"),
            feedback: "This website is user friendly. Posting adoptable pets through this website was easy.",
            date: Date("2020-05-02T06:01:17.171Z"),
            rating: 5
        }]

    );
    const hashedPassword4 = await bcrypt.hash("pam123", saltRounds);
    const pamanimalrescue = await shelters.create("Pam beesly Adoption Company",
        "pambeeslyadoption@gmail.com",
        hashedPassword4,
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
        { facebook: "facebook.com/pambeeslyanimalrescue", instagram: "instagram.com/pambeeslyanimalrescue", twitter: "twitter.com/pambeeslyanimalrescue" },
        ["6063d472f5a17f32a5cbdc24", "6064a5d02f56e4da24413ab3"],
        ["6064a5f081004bcfbc33d6c5"],
        [{
            _id: ObjectId("6063d5103833261e97e0920b"),
            reviewDate: Date("2021-02-2T06:01:17.171Z"),
            rating: 5,
            reviewBody: "They were very nice and helpful when I was looking for a new pet to adopt!",
            reviewer: ObjectId("6063d0e4be26b8a5128c59e1")
        }],
        '/public/images/shelters/pamascat.jpg',
        [{
            _id: ObjectId("507f1f77bcf86cd799439011"),
            feedback: "This website is user friendly. Posting adoptable pets through this website was easy.",
            date: Date("2020-05-02T06:01:17.171Z"),
            rating: 5
        }]

    );
    const hashedPassword5 = await bcrypt.hash("kelly123", saltRounds);
    const kellyanimalrescue = await shelters.create("kelly kapoor Adoption Company",
        "kellykapooradoption@gmail.com",
        hashedPassword5,
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
        { facebook: "facebook.com/kellykapooranimalrescue", instagram: "instagram.com/kelyykapooranimalrescue", twitter: "twitter.com/kellykapooranimalrescue" },
        ["6063d472f5a17f32a5cbdc24", "6064a5d02f56e4da24413ab3"],
        ["6064a5f081004bcfbc33d6c5"],
        [{
            _id: ObjectId("6063d5103833261e97e0920b"),
            reviewDate: Date("2021-03-21T06:01:17.171Z"),
            rating: 5,
            reviewBody: "They were very nice and helpful when I was looking for a new pet to adopt!",
            reviewer: ObjectId("6063d0e4be26b8a5128c59e1")
        }],
        '/public/images/shelters/kellykappor.jpg',
        [{
            _id: ObjectId("507f1f77bcf86cd799439011"),
            feedback: "This website is user friendly. Posting adoptable pets through this website was easy.",
            date: Date("2020-05-02T06:01:17.171Z"),
            rating: 5
        }]

    );
    const hashedPassword6 = await bcrypt.hash("ryan123", saltRounds);
    const ryananimalrescue = await shelters.create("ryan howard Adoption Company",
        "ryanhowardadoption@gmail.com",
        hashedPassword6,
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
        { facebook: "facebook.com/ryanhowardanimalrescue", instagram: "instagram.com/ryanhowardanimalrescue", twitter: "twitter.com/ryanhowardanimalrescue" },
        ["6063d472f5a17f32a5cbdc24", "6064a5d02f56e4da24413ab3"],
        ["6064a5f081004bcfbc33d6c5"],
        [{
            _id: ObjectId("6063d5103833261e97e0920b"),
            reviewDate: Date("2021-04-21T06:01:17.171Z"),
            rating: 5,
            reviewBody: "They were very nice and helpful when I was looking for a new pet to adopt!",
            reviewer: ObjectId("6063d0e4be26b8a5128c59e1")
        }],
        '/public/images/shelters/ryanhorse.jpg',
        [{
            _id: ObjectId("507f1f77bcf86cd799439011"),
            feedback: "This website is user friendly. Posting adoptable pets through this website was easy.",
            date: Date("2020-05-02T06:01:17.171Z"),
            rating: 5
        }]

    );
    console.log('Done seeding database');

    await db.serverConfig.close();
}

main();
