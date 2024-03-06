const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant.model");
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

router.get("/read", (req, res) => {
  const { q } = req.query; 
  const query = q ? { name: { $regex: new RegExp(q, "i") } } : {}; 

  Restaurant.find(query)
    .then((restaurants) => {
      res.status(200).json(restaurants);
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get("/read/:id", (req, res, next) => {
  const restaurantId = req.params.id;

  Restaurant.findById(restaurantId)
    .populate("owner", "_id")
    // .populate("comments")
    // .populate("ratings")
    
    .then((restaurant) => {
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurante no encontrado" });
      }
      const restaurantWithOwner = {
        ...restaurant.toObject(),
        owner: restaurant.owner._id,
      };

      res.status(200).json(restaurantWithOwner);
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// ruta final localhost:5005/restaurants/create, importante recordar la ruta!!!!!!!!!!!
router.post("/create", fileUploader.single("image"), (req, res) => {
  const owner = req.payload;
  const {
    name,
    capacity,
    address,
    price,
    description,
    category,
    image,
    city,
    street,
    number,
    postcode,
    phone,
    openingHours,
  } = req.body;

  console.log(req.body);

  // Crear el restaurante
  Restaurant.create({
    name: req.body.name,
    capacity: req.body.capacity,
    address: { street, number, city, postcode },
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    city: req.body.city,
    postcode: req.body.postcode,
    image: req.file ? req.file.path : undefined,
    phone: req.body.phone,
    openingHours: req.body.openingHours,
    owner: owner,
  })
    .then((newRestaurant) => {
      const restaurantId = newRestaurant._id;
 
      User.findByIdAndUpdate(
        owner,
        {
          $addToSet: { restaurant: restaurantId },
          $set: { isOwner: true }, 
        },
        { new: true }
      )
        .then((updatedUser) => {
          if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
          }
          res.status(201).json(newRestaurant);
        })
        .catch((error) => {
          res.status(500).json({
            message: "Error updating user with new restaurant",
            error,
          });
        });
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
});

router.put("/update/:id", isAuthenticated, (req, res) => {
  const restaurantId = req.params.id;
  const {
    name,
    capacity,
    price,
    description,
    category,
    city,
    postcode,
    image,
  } = req.body;
  Restaurant.findByIdAndUpdate(
    restaurantId,
    {
      name,
      capacity,
      price,
      description,
      category,
      city,
      postcode,
      image,
    },
    { new: true }
  )
    .then((updatedRestaurant) => {
      if (!updatedRestaurant) {
        return res.status(404).json({ message: "Restaurante no encontrado" });
      }
      res.status(200).json(updatedRestaurant);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error al actualizar el restaurante", error });
    });
});
router.put("/update/:id", (req, res) => {
  const restaurantId = req.params.id;
  const {
    name,
    capacity,
    price,
    description,
    category,
    city,
    postcode,
    image,
  } = req.body;
  Restaurant.findByIdAndUpdate(
    restaurantId,
    {
      name,
      capacity,
      price,
      description,
      category,
      city,
      postcode,
      image,
    },
    { new: true }
  )
    .then((updatedRestaurant) => {
      if (!updatedRestaurant) {
        return res.status(404).json({ message: "Restaurante no encontrado" });
      }
      res.status(200).json(updatedRestaurant);
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.delete("/delete/:id", isAuthenticated, (req, res) => {
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
