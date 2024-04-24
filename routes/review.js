const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isOwner, isLoggedIn, isReviewAuther} = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/review.js");

//review route for post
router.post("/", isLoggedIn, validateReview ,wrapAsync(createReview));

//Delete review routre
router.delete("/:reviewId", isLoggedIn, isReviewAuther ,wrapAsync(destroyReview));

module.exports = router;