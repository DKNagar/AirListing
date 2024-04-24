const Listing = require("../models/listing.js");
// const mbxTilesets = require('@mapbox/mapbox-sdk/services/tilesets');
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxTilesets({ accessToken: mapToken });
require('events').EventEmitter.defaultMaxListeners = 15;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding.js")
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.indexListing = async(req,res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
};

module.exports.newListing = async(req,res) => {  
    res.render("listings/new.ejs");
};

module.exports.createListing = async(req,res) => {    
        let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
       .send()     

    let url = req.file.path;                //after set of cloudinary
    let filename = req.file.filename;       //after set of cloudinary
    let newListing = req.body.listing;
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;

    await new Listing(newListing).save();    
    
    req.flash("success", "New Listing created successfully");
    res.redirect("/listings");
};

module.exports.editListing = async(req,res) => {
    let {id} = req.params;  
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you are requested does not exist");
        res.redirect("/listings");
    } else {
        let originalImageUrl =listing.image.url;
        console.log(originalImageUrl);
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250");
        console.log(originalImageUrl);
        res.render("listings/edit.ejs", {listing, originalImageUrl});
    }    
};

module.exports.updateListing = async(req,res) => {   
    let {id} = req.params;  
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});    

    if(typeof req.file !== "undefined"){
        let url = req.file.path;                //after set of cloudinary
        let filename = req.file.filename;       //after set of cloudinary
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Updated successfully");
    res.redirect(`/listings/${id}`); 
};

module.exports.showListing = async(req,res) => {
    let {id} = req.params;    
    const listing = await Listing.findById(id)
                                  .populate({path: "reviews", populate: {path: "auther"}})
                                  .populate("owner");
    if(!listing){
        req.flash("error", "Listing you are requested does not exist");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", {listing});
    }    
};

module.exports.destroyListing = async(req,res) => {
    let {id} = req.params;    
    const listing = await Listing.findByIdAndDelete(id);   
    req.flash("success", "Deleted successfully");
    res.redirect("/listings");
};