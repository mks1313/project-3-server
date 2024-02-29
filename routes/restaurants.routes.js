const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant.model");
const defaultImage = Restaurant.defaultImage;
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model")

router.get("/read", (req, res) => {
  Restaurant.find()
    .then((restaurants) => {
      res.status(200).json(restaurants);
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get("/read/:id", (req, res) => {
  const restaurantId = req.params.id;
  Restaurant.findById(restaurantId)
    .then((restaurant) => {
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurante no encontrado" });
      }
      res.status(200).json(restaurant);
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});
// ruta final localhost:5005/restaurants/create, importante recordar la ruta!!!!!!!!!!!
router.post("/create", (req, res) => {
    const owner = req.payload._id;
    console.log(req.payload._id);
    const {
      name,
      capacity,
      location,
      address,
      price,
      description,
      category,
      image,
      city,
      postcode,
      phone,
      openingHours,
    } = req.body;
  
    Restaurant.create({
      name,
      capacity,
      location,
      address,
      price,
      description,
      category,
      city,
      postcode,
      image,
      phone,
      openingHours,
      owner,
    })
      .then((newRestaurant) => {
        const restaurantId = newRestaurant._id;
        // Asociar el nuevo restaurante con el usuario propietario
        User.findByIdAndUpdate(
          owner,
          { $push: { restaurants: restaurantId } }, // Agregar el ID del restaurante a la lista de restaurantes del usuario
          { new: true } // Devolver el documento actualizado del usuario
        )
          .then((updatedUser) => {
            if (!updatedUser) {
              return res.status(404).json({ message: 'User not found' });
            }
            res.status(201).json(newRestaurant);
          })
          .catch((error) => {
            res.status(500).json({ message: "Error updating user with new restaurant", error });
          });
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  });
router.delete("/delete/:id", (req, res) => {
  const restaurantId = req.params.id;
  Restaurant.findByIdAndDelete(restaurantId)
    .then((deletedRestaurant) => {
      if (!deletedRestaurant) {
        return res.status(404).json({ message: "Restaurante no encontrado" });
      }
      res.status(200).json({ message: "Restaurante eliminado exitosamente" });
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

module.exports = router;
