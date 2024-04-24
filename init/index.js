const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust3';

main() .then(()=> {
    console.log("Connected to DATABASE");
}).catch((err) =>{
    console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);  
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "661e0a02eb9134162f9659d3"}));
    await Listing.insertMany(initData.data);
    console.log("data was saved");
};

initDB();
