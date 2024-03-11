const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant.model");
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { default: mongoose } = require("mongoose");

router.get("/read", (req, res) => {
  const { q } = req.query; // Obtener el parámetro de consulta "q" para la búsqueda
  const query = q ? { name: { $regex: new RegExp(q, "i") } } : {}; // Crear la consulta dinámica

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

router.post("/upload", fileUploader.single("image"), (req, res) => {
  // if (!req.file) {
  //   next(new Error("No file uploaded!"));
  //   return;
  // }

  // const { projectId } = req.params;
  const newRestaurant = { ...req.body };

  // if (!mongoose.Types.ObjectId.isValid(projectId)) {
  //   res.status(400).json({ message: "Specified id is not valid" });
  //   return;
  // }

  if (req.hasOwnProperty("file")) {
    newRestaurant.image = req.file.path;
    res.json({ fileURlImage: req.file.path });
  }
  
  return;
});

// ruta final localhost:5005/restaurants/create, importante recordar la ruta!!!!!!!!!!!
router.post("/create", isAuthenticated, (req, res) => {
  console.log(req.body); // Verifica los datos del formulario
  console.log(req.file);
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
  } = req.body;


  // Crear el restaurante
  Restaurant.create({
    name: req.body.name,
    capacity: req.body.capacity,
    address: { ...address },
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image,
    phone: req.body.phone,
    owner: owner._id,
  })
    .then((newRestaurant) => {
      const restaurantId = newRestaurant._id;
      console.log(newRestaurant);
      // Asociar el nuevo restaurante con el usuario propietario y actualizar el usuario
      User.findByIdAndUpdate(
        owner,
        {
          $addToSet: { restaurant: restaurantId }, // Agregar el ID del restaurante a la lista de restaurantes del usuario
          $set: { isOwner: true }, // Actualizar el campo isOwner a true si no lo era antes
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

router.put("/update/:id",  isAuthenticated, (req, res) => {
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
