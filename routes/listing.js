const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { indexListing, newListing, createListing, editListing, updateListing, showListing, destroyListing } = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfiq.js");
const upload = multer({ storage });


//index route
router.get("/", wrapAsync(indexListing));

//new route
router.get("/new", isLoggedIn ,wrapAsync(newListing));

//create new list
router.post("/",isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(createListing));

// router.post("/", upload.single('listing[image]'), (req,res) => {
//     res.send(req.file);
// });

//edit route
router.get("/:id/edit", isLoggedIn, isOwner ,wrapAsync(editListing));

//update route
router.put("/:id", isLoggedIn, isOwner , upload.single('listing[image]'), validateListing ,wrapAsync(updateListing));

//show route
router.get("/:id", wrapAsync(showListing));

//delete route
router.delete("/:id", isLoggedIn ,isOwner , wrapAsync(destroyListing));

module.exports = router;
