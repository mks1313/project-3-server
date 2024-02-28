const express = require("express");
const router = express.Router();
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
// ruta final localhost:5005/restaurants/create, importante recordar la ruta!!!!!!!!!!!
router.post('/create', (req, res) => {
    const owner = req.payload._id;
    console.log(req.payload._id);
    const { name, capacity, location, address, price, description, category, city, postcode, phone, image, openingHours } = req.body;
    // const image = req.file ? req.file.path : defaultImage;
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
    .then(newRestaurant => {
     // TODO implementar la logica de asosiacion de nuevo id de rest a usuario, para guardar los datos en el ususario!!!!!!!!!!
      res.status(201).json(newRestaurant);
    })

    .catch(error => {
      res.status(400).json({ message: error.message });
    });
  });
//   fileUploader.single('image') para cloudinary en la ruta!!!
  router.put('/update/:id', (req, res) => {
    const restaurantId = req.params.id;
    const { name, capacity, location, address, price, description, category, city, postcode, phone, image, openingHours } = req.body;

    Restaurant.findByIdAndUpdate(restaurantId, {
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
        openingHours
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

router.delete('/delete/:id', (req, res) => {
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