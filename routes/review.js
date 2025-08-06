const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const {reviewSchema}=require('../schema'); 
const Listing=require("../Models/listing");
const Review=require("../Models/review");
const { isLoggedIn, isRevAuthor } = require('../middleware');
const reviewController=require('../controllers/review')

//reviews
//post route
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

//delete review route 
router.delete("/:reviewId",isLoggedIn,isRevAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;