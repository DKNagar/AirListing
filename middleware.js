const { resolveInclude } = require("ejs");
const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn =((req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
});

module.exports.saveRedirectUrl = ((req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
});

module.exports.isOwner = (async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "YOU ARE NOT OWNER OF THIS LISTING");
        return res.redirect(`/listings/${id}`);
    }    
    next();
});

module.exports.validateListing = (req,res,next) => {
    const {error} = listingSchema.validate(req.body);    //also write {error} = result
    if(error){
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body.reviews);    //also write {error} = result
    if(error){
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

module.exports.isReviewAuther = (async(req,res,next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.auther.equals(res.locals.currUser._id)){
        req.flash("error", "you haven't created this review");
        return res.redirect(`/listings/${id}`);
    }    
    next();
});