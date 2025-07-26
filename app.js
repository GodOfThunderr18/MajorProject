const express=require('express');
const app=express();
const mongoose=require('mongoose');
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

const ExpressError=require('./utils/ExpressError');


app.listen(8080,()=>{
    console.log("server is listening");
});



//Express router
const listings=require('./routes/listing');
const reviews=require('./routes/review');

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


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





//all the routes except the above should give page not found error
app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})




//err handling mw

app.use((err,req,res,next)=>{
    console.log("---ERROR---");
    let {status=500,message="Something went wrong"}=err;
   // res.status(status).send(message);
   res.status(status).render("error.ejs",{message});
})






