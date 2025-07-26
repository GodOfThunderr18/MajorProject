const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const {ListingSchema}=require('../schema'); 
const Listing=require("../Models/listing");

//validation mw
const validateListing=(req,res,next)=>{
    let {error}=ListingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}

//index
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));


//create
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
});

router.post("/",validateListing,wrapAsync(async (req,res,next)=>{


     const newListing=new Listing(req.body.listing);
     await newListing.save();
     res.redirect("/listings");
     
}))





//show
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate('reviews');
    res.render("listings/show.ejs",{listing});
 
}));



//Update
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let id=req.params.id;
    const listing=await Listing.findById(id);
    res.render('listings/edit.ejs',{listing});
}));

router.put("/:id",validateListing,wrapAsync(async (req,res)=>{ 
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); 
    res.redirect(`/listings/${id}`);
}));


//Destroy
router.delete("/:id/delete",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports=router;