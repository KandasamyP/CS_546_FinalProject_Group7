const helpcarddata = [
    {
        _id: "1",
        name: "Stevens Park",
        bio: "Community park offering a dog run",
        address: {
            addressline1: "Hudson St",
            addressline2: "apt 1",
            city: "Hoboken",
            state: "NJ",
            zipcode: "07030"
        },
        image: "/public/images/helppage/dogpark.jfif",

    },
    {
        _id: "2",
        name: "Animal Infirmary of Hoboken",
        bio: "Bio/description for Animal Infirmary of Hoboken",
        address: {
            addressline1: "600 Adams St",
            addressline2: "apt 1",
            city: "Hoboken",
            state: "NJ",
            zipcode: "07030"
        },
        image: "/public/images/helppage/vetimage.jpg",

    },
    {
        _id: "3",
        name: "Hoboken Pet",
        bio: "Hoboken pet offers great products for you beloved pets.",
        address: {
            addressline1: "524 Washington St",
            addressline2: "apt 1",
            city: "Hoboken",
            state: "NJ",
            zipcode: "07030"
        },
        image: "/public/images/helppage/petstore.png"
    }
]

const helpfaqdata = [
    {
        question: "Why adopt from Get-A-Pet",
        answer: "When you adopt an animal from Get-A-Pet, you save a life and a space opens up which will welcome another great dog or cat and save its life. In addition, besides the obvious advantage of saving a life you also get a chance to find a companion who is a good match for your personality and lifestyle.",
        collapse: "collapse"
    },
    {
        question: "Is it difficult to adopt?",
        answer: "Get-A-Pet has policies for approving adoptions. They are designed to ensure that each animal is placed with a responsible person prepared to make a lifelong commitment, and to avoid the kinds of problems that may have caused the animal to be brought to the shelter in the first place. An important part of the process is to match the lifestyle and needs of the adopter with the individual dog or cat. If the screening process occasionally seems overly strict, try to remember that the shelter’s first priority is to protect the animal’s best interests.",
        collapse: "collapse"
    },
    {
        question: "Will The Animal Be Healthy?",
        answer: "All of our animals are vet checked, spayed or neutered (or soon will be), current on all vaccinations, microchipped, tested for worms and parasites and treated as needed, and dogs are tested for heartworm and are on preventative. We will tell you if an animal has a health problem and together evaluate whether or not an animal with medical needs is a good choice for you.",
        collapse: "collapse"
    },
    {
        question: "Are there requirements following the adoption?",
        answer: "Having a companion animal brings rewards and responsibilities. Following your pet’s adoption, you will be responsible for making sure your pet is safe and for providing regular veterinary care. Be sure your dog has appropriate identification. Provide nutritious food and fresh water for your pet. Make time for exercise, training, and play. Finally, enjoy your new life with your new loving companion.",
        collapse: "collapse"
    }
]
module.exports = {
    helpcarddata,
    helpfaqdata
}
