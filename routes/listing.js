const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const {ListingSchema}=require('../schema'); 
const Listing=require("../Models/listing");
const {isLoggedIn}=require("../middleware")
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
router.get("/new",isLoggedIn,(req,res)=>{
     res.render("listings/new.ejs")
});
function transformImageField(req, res, next) {
  if (req.body.listing && typeof req.body.listing.image === 'string') {
    req.body.listing.image = {
      filename: "",
      url: req.body.listing.image
    };
  }
  next();
}


router.post("/",transformImageField,isLoggedIn,validateListing,wrapAsync(async (req,res,next)=>{
     const newListing=new Listing(req.body.listing);
     await newListing.save();
     //we want to flash a msg after saving
     req.flash("success","New listing created!!"); 
     res.redirect("/listings");
     
}))





//show
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate('reviews');
    if(!listing){
        req.flash("error","No such listing");
        return res.redirect("/listings");  // Adding the return ensures the function exits early and does not attempt to render the show page for a non-existent listing.
    }
    res.render("listings/show.ejs",{listing});
 
}));



//Update
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    let id=req.params.id;
    const listing=await Listing.findById(id);
    res.render('listings/edit.ejs',{listing});
}));

router.put("/:id",isLoggedIn,validateListing,wrapAsync(async (req,res)=>{ 
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); 
    req.flash("success","Listing Updated "); 
    res.redirect(`/listings/${id}`);
}));


//Destroy
router.delete("/:id/delete",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is deleted");
    res.redirect("/listings");
}));

module.exports=router;