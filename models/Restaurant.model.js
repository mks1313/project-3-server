const { Schema, model } = require("mongoose");

const defaultImage = "https://media.istockphoto.com/id/981368726/es/vector/restaurante-de-comida-y-bebidas-logotipo-tenedor-cuchillo-fondo-vector-imagen.webp?s=1024x1024&w=is&k=20&c=Bjj0FOP-mRYpC4LEfsUQkBal019IdmkKjqk2K3ihQJo=";

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: false,
    },
    image: [{
        type: String,
        default: defaultImage,
    }],
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
  
    commentedByUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    
    ratedByUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    
    favoritesByUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    menus: [{
        type: Schema.Types.ObjectId,
        ref: "Menu",
      }],
      openingHours: {
        type: [{
          day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
          open: { type: String }, 
          close: { type: String }, 
        }],
        required: false,
      },  
});

restaurantSchema.index({ location: "2dsphere" });

const Restaurant = model("Restaurant", restaurantSchema);
module.exports = Restaurant;
