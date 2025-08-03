const express=require('express');
const router=express.Router();
const User=require('../Models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport=require('passport');
const { saveRedirectUrl } = require('../middleware');

router.get("/signup",(req,res)=>{
    res.render("users/signup");
})

router.post("/signup",(async(req,res,next)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
           return next(err);
        }
         req.flash("success","Welcome to Wanderlust");
         res.redirect("/listings");

    })
    }catch(er){
        req.flash("error",er.message);
        res.redirect("/signup");
    }


}));


//login
router.get("/login",(req,res)=>{
    res.render("users/login");
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings"; //if we clicked on login then "/listings" else we went to login page via edit/delte non logged in page then the other one
    res.redirect(redirectUrl);


})

//logout
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Successfully logged out");
        res.redirect("/listings");
    })
})

module.exports=router;