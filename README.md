# CS_546_FinalProject_Group7 (Work in progress)

# Pet Adoption (GetAPet)

[Live App Demo](https://get-a-pet.herokuapp.com/)

## Instructions to run App:

- [x] git clone repo to system
- [x] Configure `mongoConnection.js` file
- [x] run `npm install`
- [x] run npm start
- [x] ENJOY!

## Team Members (Group 7)

- Kandasamy Parthasarathy
- Mrunal Salunke
- Prashant Mall
- Preet Dabhi
- Samantha Himmelreich

### Introduction

This website is a place for animal shelters and rescues to showcase their adoptable pets, in a way that makes it easier for people to find pets that fit their lifestyle. Every animal is different, so it could be very difficult for someone to find their perfect match.<br><br>
The website will allow two types of users to sign up—shelter/rescue administrators and potential pet owners. Administrators will be able to create a profile page for their shelter/rescue and post individual profiles for their adoptable pets; the pet profiles will show a picture and basic information about the pet, such as breed and age. People searching for pets can create their own user profile and use it to message shelters/rescues when they find animals they are interested in adopting. Our goal is to provide an easier way to find pets by allowing all users to add filters to a pet profile if they see one missing. For example, an administrator may post a new adoptable pet and write in its “about” section that it requires a yard, but forget to add the “yard required” filter to the posting; another user who comes across this can effectively tag the post with that filter so that when people use the search feature, that profile will show up in the appropriate filters.<br><br>
When COVID-19 caused communities to shut down, sending many people to work or learn from home, pet adoptions soared; some rescues saw over a 30% increase in adoptions over the previous year1. Now, with more companies willing to allow their employees to work from home at least part time even after the pandemic is over, pet adoptions are likely to stay at a relatively high level. This website will aid in matching animals to their forever homes.

### Core Features

#### 1. Landing/home page<br>

This page has a search box to do a basic pet search (animal and location) or an advanced pet search (animal, location, and various filters), a login button, a shelter/rescue signup button, a pet owner signup button, a profile button with a notification bubble for signed-in users, and a link to a list of shelters/rescues.<br>

#### 2. Pet search<br>

This page shows the results of a pet search. Adopters can use filters (breed, age, etc.) to narrow down their search.Landing<br>

#### 3. Pet page<br>

This is a page for an individual pet, showing a picture of the pet, name, age, location/rescue, breed, and other information. An “Adopt/Inquire” button will also be present on the pet page so that a potential adopter can ask about the animal.<br>

#### 4. Shelter/rescue list page<br>

This page shows the list of shelters/rescues that have posted adoptable pets on the website. Anyone viewing the site can click on a link to view the shelter’s/rescue’s profile.<br>

#### 5. Individual shelter/rescue page<br>

This page shows the details for a specific shelter or rescue, such as location, phone number, history, and available pets. Users can also leave reviews about their experiences with the organization that will show on the profile.<br>

#### 6. User profile page<br>

This page shows the user’s profile with information such as name, preferred form of contact, general location, and a short user-written about me.<br>

#### 7. Favorite a pet<br>

This is a button the user clicks to add a certain pet to their “favorites” list on their own profile to easily find it later.<br>

#### 8. Add tags/keywords<br>

A user can suggest filters that may be missing from a pet post or suggest corrections for inaccurate filters. For example, a cat post may have a “kitten” filter attached to it while the biography states that the cat is in fact fifteen years old; a user can then suggest removing “kitten” and replacing it with “senior.” This suggestion would notify the shelter/rescue to update the pet’s page.<br>

#### 9. Messaging<br>

When people click on the “Adopt/Inquire” button on the pet page, they can start a message thread with the shelter/rescue. All users will have an inbox to view their messages.<br>

#### 10. Give your feedback<br>

This is a page where people who have adopted pets through this website can leave feedback about their experience of the process of adopting a pet through the website.<br>

### Extra Features

#### - Donation feature<br>

This allows the user to donate to a shelter/rescue. Donations can either be monetary or supplies such as food or toys. The shelter/rescue will be notified of the donation, and if the donation is something other than money, the donator will be given a shipping/drop-off location.<br>

#### - Report feature<br>

This allows users to report possible fraudulent/incorrect postings, such as a pet they recognize as stolen or a cat that is incorrectly listed as a dog.<br>

#### - Pet adoption counter<br>

Every time there is a successful confirmed adoption through the website, an adoption counter on the home page will update.<br>

#### - Help page<br>

This page will list local resources for new pet owners, such as veterinarians, dog parks, and pet stores.<br>

#### - Volunteer Page<br>

This page will allow users to apply to volunteer at shelters/rescues.<br>

### GitHub Repository

[Project Repository](https://github.com/KandasamyP/CS_546_FinalProject_Group7)
