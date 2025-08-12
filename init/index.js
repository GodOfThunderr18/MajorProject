const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing=require('../Models/listing.js');

require("dotenv").config();


const MONGO_URL=process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})  

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'689a209934b532b8a7f074db'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");


};

initDB();