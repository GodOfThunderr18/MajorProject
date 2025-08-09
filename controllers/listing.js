const Listing = require("../Models/listing")
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });


module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderForm=(req,res)=>{
     res.render("listings/new.ejs")
};

module.exports.newListing=async (req,res,next)=>{
   let response=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1 
  })
  .send()
  
    let url=req.file.path;
    let filename=req.file.filename;
     const newListing=new Listing(req.body.listing);
     newListing.owner=req.user._id;
     newListing.image={url,filename};
     newListing.geometry=response.body.features[0].geometry;
     await newListing.save();
     //we want to flash a msg after saving
     req.flash("success","New listing created!!"); 
     res.redirect("/listings");
     
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:'reviews',populate:{path:'author',},})
    .populate('owner');
    if(!listing){
        req.flash("error","No such listing");
        return res.redirect("/listings");  // Adding the return ensures the function exits early and does not attempt to render the show page for a non-existent listing.
    }
    res.render("listings/show.ejs",{listing});
 
};


module.exports.renderUpdateForm=async (req,res)=>{
    let id=req.params.id;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");

    
    
    }
    let orgImage=listing.image.url;
    orgImage=orgImage.replace("/upload","/upload/h_300,w_250");
    res.render('listings/edit.ejs',{listing,orgImage});
};


module.exports.updateListing=async (req,res)=>{ 
    let {id}=req.params;
     
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing}); 
   if(typeof req.file !== "undefined"){
     let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
   }
    req.flash("success","Listing Updated "); 
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is deleted");
    res.redirect("/listings");
};