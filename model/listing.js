const mongoose = require('mongoose');
const Review = require('./review');
const { string } = require('joi');
const {Schema} = mongoose;

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: {
      url : String,
      filename : String
  },
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type: Schema.Types.ObjectId,
      ref : "Review"
    }
  ],
  author : {
    type : Schema.Types.ObjectId,
    ref : "User"
  }
});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing) {
    await Review.deleteMany({_id : {$in : listing.reviews}})
  }
});

const listing = mongoose.model('listing', listingSchema);
module.exports = listing;

