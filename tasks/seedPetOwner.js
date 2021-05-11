const dbConnection = require("../config/mongoConnection");
const petOwnerData = require("../data/petOwner");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const saltRounds = 16;

async function main() {
  const db = await dbConnection();
  //await db.dropDatabase();

  const hashedPassword1 = await bcrypt.hash("johnDoe", saltRounds);
  await petOwnerData.addPetOwner(
    "no_image.png",
    { firstName: "John", lastName: "Doe" },
    "johndoe@stevens.edu",
    hashedPassword1,
    2011234567,
    "07030",
    "I love animals and I’m searching for a dog or cat sibling for my current dog.",
    "02/23/1998",
    ["6063d472f5a17f32a5cbdc24"],
    [
      {
        _id: ObjectId(),
        description: "Adopting through this site is great!",
        date: "3/25/21",
        rating: 5,
      },
    ],
    ["6063d5103833261e97e0920b"],
    ["6063d536f6ab4b941689879d"],
    ["Food", "$10"],
    true
  );

  const hashedPassword2 = await bcrypt.hash("TheOffice", saltRounds);

  await petOwnerData.addPetOwner(
    "Steve.png",
    { firstName: "Steve", lastName: "Carell" },
    "stevecarell@dundermifflin.com",
    hashedPassword2,
    2011234568,
    "07307",
    "I love animals and I’m searching for a dog or cat sibling for my current dog.",
    "01/12/1997",
    ["6063d472f5a17f32a5cbdc24"],
    [
      {
        _id: ObjectId(),
        description: "This site is great resource to adopt a pet.",
        date: "4/20/21",
        rating: 4.2,
      },
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
