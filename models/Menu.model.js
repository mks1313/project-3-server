const { Schema, model } = require("mongoose");

const menuSchema = new Schema({
  restaurant: {
    type: Schema.Types.ObjectId,
      ref: "Restaurant",
      require: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  category: {
    type: String,
    enum: ["main course", "entree", "dessert", "starter", "beverage", "others"],
    required: true,
  }
});

const Menu = model("Menu", menuSchema);

module.exports = Menu;
