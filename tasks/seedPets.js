const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
let { ObjectId } = require("mongodb");

const pets = data.pets;
const shelters = data.homepageData;
const sheltersAndRescue = data.shelterAndRescueData;

async function main() {
  const db = await dbConnection();
  // await db.dropDatabase();
  const fur1_shelter = await sheltersAndRescue.addShelters(
    "Fur-iends Animal Rescue",
    "staff@furiendsanimalrescue.com",
    {
      streetAddress1: "9999 4th Street",
      streetAddress2: "",
      city: "Hoboken",
      stateCode: "NJ",
      zipCode: "07030",
    },
    "Fur-iends Animal Rescue opened in Hoboken, NJ in April 2020 in the midst of the coronavirus pandemic. It is our mission to find the perfect match for our animals.",
    "2015551234",
    "furiendsanimalrescue.com",
    [
      "facebook.com/furiendsanimalrescuehoboken",
      "twitter.com/furiendsanimalrescuehoboken",
    ],
    ["6063d472f5a17f32a5cbdc24", "6064a5d02f56e4da24413ab3"],
    ["6064a5f081004bcfbc33d6c5"],
    [
      {
        reviewDate: new Date("3/26/21"),
        rating: "5",
        reviewBody:
          "They were very nice and helpful when I was looking for a new pet to adopt!",
        reviewer: ObjectId("6063d0e4be26b8a5128c59e1"),
      },
    ],
    [
      {
        feedback:
          "This website is user friendly. Posting adoptable pets through this website was easy.",
        date: new Date("3/26/21"),
        rating: 5,
      },
    ]
  );

  const max = await pets.addPet(
    "Max",
    "Dog",
    ["Cardigan Welsh Corgi"],
    ["max1.jpg", "max2.jpg", "max3.jpg"],
    "Male",
    "07002",
    true,
    "Puppy",
    "Max's mom was brought into the shelter when she was pregnant. His litter was born on 1/5/21 and consists of three females and one other male. He is the most playful of his siblings and loves car rides. Adoption fee is $300 and includes neutering.",
    ObjectId("6097269d5bb9920470554198").toString(),
    300.0,
    [
      "dog-friendly",
      "cat-friendly",
      "child-friendly",
      "yard required",
      "tricolor",
      "black",
      "white",
      "tan",
      "medium-sized",
      "medium-hair",
    ]
  );

  const butterscotch = await pets.addPet(
    "Butterscotch",
    "Cat",
    ["Domestic Short Hair"],
    ["butterscotch.jpg"],
    "Female",
    "07047",
    true,
    "Adult",
    "Butterscotch is a sweet girl found wandering in an alley. We estimate she is about 6 years old. She reacts well to children but has not been tested near other animals.",
    ObjectId("6097269d5bb9920470554198").toString(),
    90.0,
    [
      "child-friendly",
      "calico",
      "black",
      "white",
      "orange",
      "small-sized",
      "short-hair",
      "clawed",
      "house-trained",
    ]
  );

  const lily = await pets.addPet(
    "Lily",
    "Dog",
    ["Golden Retriever"],
    ["lily1.jpg", "lily2.jpg"],
    "Female",
    "48104",
    true,
    "Senior",
    "Lily came to us via owner surrender as her previous owner could no longer provide care for her. She's still a robust gal and will alter her activity level to suit your lifestyle, but will absolutely do nothing but cuddle all day if given the option. She loves everyone she meets -- especially if they have treats!",
    "607ce6776c12c177c03ffa4c",
    125.0,
    [
      "dog-friendly",
      "child-friendly",
      "tan",
      "gold",
      "yellow",
      "large-sized",
      "medium-hair",
      "active",
      "calm",
      "apartment-friendly",
      "house-trained",
    ]
  );

  console.log(max);
  console.log(butterscotch);
  console.log(lily);

  console.log("Done seeding database");

  await db.serverConfig.close();
}

main();
