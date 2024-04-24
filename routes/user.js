const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const { renderSignUpForm, singUpNewUser, renderLoginForm, loginUser, logoutUser } = require("../controllers/user.js");


router.get("/signup", renderSignUpForm);

router.post("/signup", wrapAsync(singUpNewUser));

router.get("/login", renderLoginForm)

router.post(
    "/login", 
    saveRedirectUrl,
    passport.authenticate('local', { 
        failureRedirect: '/login',
        failureFlash: true,
     }), loginUser);

router.get("/logout", logoutUser)

module.exports = router;