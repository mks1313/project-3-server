const { Schema, model } = require("mongoose");

const ratingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  }
});

const Rating = model("Rating", ratingSchema);

module.exports = Rating;
