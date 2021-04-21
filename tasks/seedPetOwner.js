const dbConnection = require("../config/mongoConnection");
const petOwnerData = require("../data/petOwner");
const { ObjectId } = require('mongodb');

async function main(){
    const db = await dbConnection();
    await db.dropDatabase();

    await petOwnerData.addPetOwner(
    "john.jpg",
    {firstName: "John", lastName: "Doe"},
    "johndoe@stevens.edu",
    "5F4DCC3B5AA765D61D8327DEB882CF99",
    2011234567,
    "07030",
    "I love animals and I’m searching for a dog or cat sibling for my current dog.",
    "02/23/1998",
    ["6063d472f5a17f32a5cbdc24"],
    [
            {
                _id: ObjectId(),
                feedback: "Adopting through this site is great!",
                date: "3/25/21",
                rating: 5
            }
    ],
    ["6063d5103833261e97e0920b"],
    ["6063d536f6ab4b941689879d"],
    ["Food", "$10"],
    true
    );

    await petOwnerData.addPetOwner(
        "Steve.jpg",
        {firstName: "Steve", lastName: "Carell"},
        "stevecarell@dundermifflin.com",
        "5F4DCC3B5AA765D61D8327DEB882CF98",
        2011234568,
        "07307",
        "I love animals and I’m searching for a dog or cat sibling for my current dog.",
        "01/12/1997",
        ["6063d472f5a17f32a5cbdc24"],
        [
                {
                    _id: ObjectId(),
                    feedback: "This site is great resource to adopt a pet.",
                    date: "4/20/21",
                    rating: 5
                }
        ],
        ["6063d5103833261e97e0920b"],
        ["6063d536f6ab4b941689879d"],
        ["Clothes", "Toys"],
        false
    );

    console.log("Done seeding");
    await db.serverConfig.close();
}

main();