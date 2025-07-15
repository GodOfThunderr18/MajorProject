const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Listing=require("../MajorProject/Models/listing");
const path=require('path');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const methodOverride = require('method-override')
app.use(methodOverride('_method'));
const ejsMate=require("ejs-mate");
app.engine('ejs',ejsMate);


app.listen(8080,()=>{
    console.log("server is listening");
});

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});



//Index route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})


//create
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});
app.post("/listings",async (req,res)=>{
     const newListing=new Listing(req.body.listing);
     await newListing.save();
     res.redirect("/listings");
})





//show
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});

})



//Update
app.get("/listings/:id/edit",async (req,res)=>{
    let id=req.params.id;
    const listing=await Listing.findById(id);
    res.render('listings/edit.ejs',{listing});
});

app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); 
    res.redirect(`/listings/${id}`);
})


//Destroy
app.delete("/listings/:id/delete",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})






