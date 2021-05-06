const pets = require('./data/pets');
const connection = require('./config/mongoConnection');

async function main() {
    try {
        let pet = await pets.searchPetsByDistance("48104", 5);
        console.log(pet);
    } catch (e) {
        console.log(e);
    }

    const db = await connection();
    await db.serverConfig.close();
}

main();

/*var csv = require('fast-csv');
let breedInfo = csv.parseFile('data/petInformation/dogBreeds.csv').on('data', function(breeds) {
    //console.log(data);
    //console.log(breedsAndCharacteristics[1]);
    //breedInfo = breeds;
});
console.log(breedInfo)*/

/*var csvsync = require('csvsync');
var fs = require('fs');
 
var csv = fs.readFileSync('data/petInformation/dogBreeds.csv');
var data = csvsync.parse(csv);
console.log(data)*/
