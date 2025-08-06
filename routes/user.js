const express=require('express');
const router=express.Router();
const User=require('../Models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport=require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController=require('../controllers/users');

router.get("/signup",userController.rendersignupForm);

router.post("/signup",(userController.signup));


//login
router.get("/login",userController.renderLoginForm);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login)

//logout
router.get("/logout",userController.logout);

module.exports=router;