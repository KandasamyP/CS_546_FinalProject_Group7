const dbConnection = require('../config/mongoConnection');
const data = require("../data/");
const pets = data.pets;

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();

    const max = await pets.addPet("Max",
        "Dog",
        ["Australian Cattle Dog", "Welsh Cardigan Corgi"],
        "max.jpg",
        "Male",
        "07002",
        true,
        "Puppy",
        "Max's mom was brought into the shelter when she was pregnant. His litter was born on 1/5/21 and consists of three females and one other male. He is the most playful of his siblings and loves car rides. Adoption fee is $300 and includes neutering.",
        "6064a4c2b98e4f3708e0ddb9",
        300.00,
        ["dog-friendly", "cat-friendly", "child-friendly", "yard required", "tricolor", "black", "white", "tan", "medium-sized", "medium-length hair"]
    );

    console.log(max)

    console.log('Done seeding database');

    await db.serverConfig.close();
}

main();
