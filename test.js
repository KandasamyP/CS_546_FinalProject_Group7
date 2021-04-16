const pets = require('./data/pets');
const connection = require('./config/mongoConnection');

async function main() {
    try {
        let pet = await pets.searchPetsByFilters(["blue"]);
        console.log(pet);
    } catch (e) {
        console.log(e);
    }

    const db = await connection();
    await db.serverConfig.close();
}

main();