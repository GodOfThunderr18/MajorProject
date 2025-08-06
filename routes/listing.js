const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const {ListingSchema}=require('../schema'); 
const Listing=require("../Models/listing");
const {isLoggedIn, isOwner}=require("../middleware")

const listingController=require("../controllers/listing");

const multer=require('multer');
const upload=multer({dest:'uploads/'});
 
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
router.get("/",wrapAsync(listingController.index));


//create new listing
router.get("/new",isLoggedIn,listingController.renderForm);

function transformImageField(req, res, next) {
  if (req.body.listing && typeof req.body.listing.image === 'string') {
    req.body.listing.image = {
      filename: "",
      url: req.body.listing.image
    };
  }
  next();
}


router.post("/",transformImageField,isLoggedIn,validateListing,wrapAsync(listingController.newListing));





//show
router.get("/:id",wrapAsync(listingController.showListing));



//Update
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderUpdateForm));

router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));


//Destroy
router.delete("/:id/delete",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports=router;