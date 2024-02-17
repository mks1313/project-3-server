const { Schema, model } = require("mongoose");

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: false
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  price: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  postcode: {
    type: String,
    required: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  ratings: [{
    type: Schema.Types.ObjectId,
    ref: 'Rating'
  }]
});
restaurantSchema.index({ location: '2dsphere' });
const Restaurant = model("Restaurant", restaurantSchema);
module.exports = Restaurant;