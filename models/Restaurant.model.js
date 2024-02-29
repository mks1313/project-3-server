const { Schema, model } = require("mongoose");

const defaultImage =
  "https://www.creativefabrica.com/wp-content/uploads/2020/03/09/Simple-Fork-Plate-Icon-Restaurant-Logo-Graphics-3446203-1-1-580x348.jpg";

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: false,
  },
  image: 
    {
      type: String,
      default: defaultImage,
    },
  
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postcode: {
      type: String,
      required: false,
    },
  },
  phone: {
    type: Number,
    require: false,
  },
  price: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    enum: [
      "italian",
      "mexican",
      "chinese",
      "turkish",
      "russian",
      "french",
      "japanese",
      "american",
      "vegetarian",
      "vegan",
      "fast food",
      "sushi",
      "bbq",
      "indian",
      "thai",
      "mediterranean",
      "brazilian",
      "african",
      "fusion",
      "other",
      "spanish",
      "german",
      "greek",
    ],
    default: "other",
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  ratings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  commentedByUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  ratedByUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  favoritesByUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  menus: [
    {
      type: Schema.Types.ObjectId,
      ref: "Menu",
    },
  ],
  openingHours: {
    type: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        open: { type: String },
        close: { type: String },
      },
    ],
    required: false,
  },
});

restaurantSchema.index({ location: "2dsphere" });

const Restaurant = model("Restaurant", restaurantSchema);
module.exports = Restaurant;
