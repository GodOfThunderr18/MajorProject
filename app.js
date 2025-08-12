if(process.env.NODE_ENV != "production"){
    require('dotenv').config(); //to access env variables use process.env.varName
}


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
const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./Models/user');


const session=require("express-session");
const MongoStore=require('connect-mongo');

const flash=require("connect-flash");

const store=MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,//after refreshing we want no changes to occur,it will last till 1 day
})

store.on("error",()=>{
    console.log("ERROR in MONGO session store",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000, //from todays date to 1 week in milli secs -->weekdays*24hrs*60min*60sec*1000ms
        maxAge:7*24*60*60*1000,
        httpOnly:true,//security purpose
    }
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{ //res.locals sends info to all view files
    res.locals.success=req.flash("success"); //the success variable here is an array
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user; 
    next();
})




app.listen(8080,()=>{
    console.log("server is listening");
});

//const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'
const dbUrl=process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
}
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});



//Express router
const listingsRouter=require('./routes/listing');
const reviewsRouter=require('./routes/review');
const useRouter=require('./routes/user');

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",useRouter);








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






