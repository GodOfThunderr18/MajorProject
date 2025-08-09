const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review=require('./review'); 
const User=require('./user'); 

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  }, 
  image: {
    // filename: {
    //   type: String,
    //   default: "defaultimage.jpg",
    // },
    // url: {
    //   type: String,
    //   default: "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg",
    //   set: (v) =>
    //     v === ""
    //       ? "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"
    //       : v,
    // },
    url:String,
    filename:String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:'Review'
    }
  ],
   owner:{
    type:Schema.Types.ObjectId,
    ref:'User',
   },
   geometry:{
     type: {
      type: String, 
      enum: ['Point'], // 'geometry.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  
   }
});

listingSchema.post('findOneAndDelete',async(listing)=> {
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
