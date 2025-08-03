const Listing=require('./Models/listing');
const Review=require('./Models/review')

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
       // console.log(req);
       req.session.redirectUrl=req.originalUrl; // but after logged in,passport sets a new session and this wont be available to us
        //so,to save this in our login route,we use saveRedirectUrl mw and snd it to that login route as mw,its work is to save this orgianlurl to local files
        req.flash("error","You must be logged in to perform an action");
        return res.redirect("/login");
        
       
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{ //send this as mw in login route before passport authenticate
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
}

module.exports.isRevAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
}