const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu.model.js");
const Restaurant = require("../models/Restaurant.model.js");

// Obtener todos los menús
router.get("/readall", (req, res) => {
  Menu.find()
    .then((menus) => res.json(menus))
    .catch((err) => res.status(500).json({ message: err.message }));
});

// Obtener un menú específico
router.get("/get/:id", (req, res) => {
  Menu.findById(req.params.id)
    .then((menu) => {
      if (!menu) {
        return res.status(404).json({ message: "Menu not found" });
      }
      res.json(menu);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

// Crear un nuevo menú
router.post("/create", (req, res) => {
  const { restaurant, description, name, price, category } = req.body;
  const menu = new Menu({
    restaurant,
    description,
    name,
    price,
    category,
  });

  menu
    .save()
    .then((newMenu) => {

      return Restaurant.findByIdAndUpdate(
        req.body.restaurant,
        { $addToSet: { menus: newMenu._id } },
        { new: true }
      );
    })
    .then((updatedRestaurant) => {
      res.status(201).json(updatedRestaurant);
    })
    .catch((err) => {
      console.error("Error al crear el menú:", err);
      res.status(500).json({ message: err.message });
    });
});

// Actualizar un menú existente
router.patch("/update/:id", (req, res) => {
  Menu.findById(req.params.id)
    .then((menu) => {
      if (!menu) {
        return res.status(404).json({ message: "Menu not found" });
      }

      if (req.body.name != null) {
        menu.name = req.body.name;
      }
      if (req.body.description != null) {
        menu.description = req.body.description;
      }
      if (req.body.price != null) {
        menu.price = req.body.price;
      }
      if (req.body.category != null) {
        menu.category = req.body.category;
      }

      return menu.save();
    })
    .then((updatedMenu) => res.json(updatedMenu))
    .catch((err) => res.status(400).json({ message: err.message }));
});

// Eliminar un menú
router.delete("/delete/:id", (req, res) => {
  Menu.findById(req.params.id)
    .then((menu) => {
      if (!menu) {
        return res.status(404).json({ message: "Menu not found" });
      }

      const restaurantId = menu.restaurant;

      menu
        .remove()
        .then(() => {
          // Después de eliminar el menú, eliminar su referencia del array de menús en el restaurante
          return Restaurant.findByIdAndUpdate(restaurantId, {
            $pull: { menus: req.params.id },
          })
            .then(() => res.json({ message: "Menu deleted" }))
            .catch((err) => res.status(500).json({ message: err.message }));
        })
        .catch((err) => res.status(500).json({ message: err.message }));
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

module.exports = router;
