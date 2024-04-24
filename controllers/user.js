
const User = require("../models/user");


module.exports.renderSignUpForm =async(req,res) => {
    res.render("users/signup.ejs");   
};

module.exports.singUpNewUser = async(req,res) => {
    try{
        let {username, password, email} =req.body;
        const newUser = new User ({email, username});
        const regUser = await User.register(newUser, password);
        console.log(regUser);   
        req.login(regUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust3");
            res.redirect("/listings");
        })         
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }   
};

module.exports.renderLoginForm = async(req,res) => {
    res.render("users/login.ejs");   
};

module.exports.loginUser = async(req,res) => {    
    req.flash("success", "you are loghged in");    
    let reDirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(reDirectUrl);
};

module.exports.logoutUser = (req,res,next) => {
    req.logout((err) => {
        if(err) {
            next();
        } 
        req.flash("success", " you are successfully logged out !");
        res.redirect("/listings");
    })
};