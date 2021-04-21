const express = require("express");
const router = express.Router();
const petOwnerData = require("../data/petOwner");

router.get("/:id", async(req, res)=>{
    try{
        const petOwner = await petOwnerData.getPetOwnerById(req.params.id);
        //res.status(200).json(petOwner);   
        res.status(200).render('users/petOwner',{title: petOwner.fullName.firstName, petOwner});  
    }catch(e){
        res.status(404).json({error: "User not found."});
    }
});

router.post("/", async(req, res)=>{
    const petOwnerInfo = req.body;
    console.log(petOwnerInfo);
    console.log(req);
    // try{
    //     const petOwnerAddInfo = await petOwnerData.addPetOwner();
    // }catch(e){
    //     res.status(500).json({error: e});
    // }
});

module.exports = router;