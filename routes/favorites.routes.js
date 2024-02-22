const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const Restaurant = require("../models/Restaurant.model.js");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

router.post("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  const userId = req.payload._id;

  User.findByIdAndUpdate(
    userId,
    { $addToSet: { favorites: restaurantId } },
    { new: true }
  )
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return Restaurant.findByIdAndUpdate(
        restaurantId,
        { 
          $addToSet: { 
            favoritesByUsers: userId,
            favorites: userId 
          }, 
          
        },
        { new: true }
      );
    })
    .then(updatedRestaurant => {
      if (!updatedRestaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.status(200).json({ message: "Restaurant added to favorites successfully" });
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
});


router.delete("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  const userId = req.payload._id;

  User.findByIdAndUpdate(
    userId,
    { $pull: { favorites: restaurantId } },
    { new: true }
  )
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return Restaurant.findByIdAndUpdate(
        restaurantId,
        { $pull: { 
          favoritesByUsers: userId,
          favorites: userId 
        } }, 
        { new: true }
      );
    })
    .then(updatedRestaurant => {
      if (!updatedRestaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.status(200).json({ message: "Restaurant removed from favorites successfully" });
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
});


module.exports = router;
