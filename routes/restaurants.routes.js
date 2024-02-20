const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Restaurant = require("../models/Restaurant.model");
const defaultImage = Restaurant.defaultImage;
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("./../middleware/jwt.middleware.js"); 

router.get('/read', (req, res) => {
    Restaurant.find()
    .then(restaurants => {
        res.status(200).json(restaurants);
    })
    .catch(error => {
        res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get('/read/:id', (req, res) => {
    const restaurantId = req.params.id;
    Restaurant.findById(restaurantId)
    .then(restaurant => {
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }
        res.status(200).json(restaurant);
    })
    .catch(error => {
        res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post('/create', isAuthenticated, fileUploader.single('image'), (req, res) => {
    const { name, capacity, location, price, description, category, city, postcode, owner } = req.body;
    const image = req.file ? req.file.path : defaultImage;
    Restaurant.create({
      name,
      capacity,
      location,
      price,
      description,
      category,
      city,
      postcode,
      owner,
      image
    })
    .then(newRestaurant => {
      res.status(201).json(newRestaurant);
    })
    .catch(error => {
      res.status(400).json({ message: error.message });
    });
  });

  router.put('/update/:id', isAuthenticated, fileUploader.single('image'), (req, res) => {
    const restaurantId = req.params.id;
    const { name, capacity, location, price, description, category, city, postcode } = req.body;
    const image = req.file ? req.file.path : undefined;
    Restaurant.findByIdAndUpdate(restaurantId, {
        name,
        capacity,
        location,
        price,
        description,
        category,
        city,
        postcode,
        image
    }, { new: true })
    .then(updatedRestaurant => {
        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }
        res.status(200).json(updatedRestaurant);
    })
    .catch(error => {
        res.status(500).json({ message: "Internal Server Error" });
    });
});

router.delete('/delete/:id', isAuthenticated, (req, res) => {
    const restaurantId = req.params.id;
    Restaurant.findByIdAndDelete(restaurantId)
    .then(deletedRestaurant => {
        if (!deletedRestaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }
        res.status(200).json({ message: 'Restaurante eliminado exitosamente' });
    })
    .catch(error => {
        res.status(500).json({ message: "Internal Server Error" });
    });
});





module.exports = router;