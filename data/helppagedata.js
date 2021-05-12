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
        question: "What is this website about?",
        answer: "this website is about letting adopters adopt pets.",
        collapse: "collapse"
    },
    {
        question: "WHo is batman?",
        answer: "bruce wayne",
        collapse: "collapse"
    },
    {
        question: "who is Superman?",
        answer: "Clark Kent",
        collapse: "collapse"
    },
    {
        question: "who is Wonder Woman?",
        answer: "Diana Prince",
        collapse: "collapse"
    }
]
module.exports = {
    helpcarddata,
    helpfaqdata
}