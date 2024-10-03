const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant.model");
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { body, param, query, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const escapeStringRegexp = import("escape-string-regexp"); // Importar la librería para escapar expresiones regulares

// Middleware de validación de errores
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Middleware para escapar caracteres especiales y evitar inyecciones de regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapa caracteres especiales
}

// GET: Lista de restaurantes con búsqueda y promedio de ratings
router.get("/read", [
  query('q').optional().isString().isLength({ max: 100 }).withMessage('El término de búsqueda no puede exceder 100 caracteres.')
], handleValidationErrors, async (req, res) => {
  try {
    const { q } = req.query;

    // Validación de entrada para evitar caracteres no permitidos
    if (q && /[^a-zA-Z0-9 ]/g.test(q)) {
      return res.status(400).json({ message: "El término de búsqueda contiene caracteres no permitidos." });
    }

    // Usar escapeStringRegexp para evitar inyecciones de regex
    const query = q ? { name: { $regex: new RegExp(escapeStringRegexp(q), "i") } } : {};

    const restaurants = await Restaurant.find(query).populate("ratings");

    const updatedRestaurants = restaurants.map((restaurant) => {
      const totalRatings = restaurant.ratings.length;
      const totalScore = restaurant.ratings.reduce((acc, rating) => acc + rating.value, 0);
      restaurant.averageRating = totalRatings > 0 ? totalScore / totalRatings : null;
      return restaurant;
    });

    res.status(200).json(updatedRestaurants);
  } catch (error) {
    console.error("Error al obtener restaurantes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET: Detalle de un restaurante por ID
router.get("/read/:id", [
  param('id').isMongoId().withMessage('ID no válido.')
], handleValidationErrors, async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const restaurant = await Restaurant.findById(restaurantId).populate("owner", "_id");

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    res.status(200).json({
      ...restaurant.toObject(),
      owner: restaurant.owner._id,
    });
  } catch (error) {
    console.error("Error al obtener el restaurante:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST: Subir imagen (Simplificado y seguro)
router.post("/upload", fileUploader.single("image"), (req, res) => {
  if (req.file) {
    res.status(200).json({ fileURL: req.file.path });
  } else {
    res.status(400).json({ message: "No se ha subido ningún archivo." });
  }
});

// POST: Crear nuevo restaurante
router.post("/create", [
  isAuthenticated,
  body('name').isString().isLength({ max: 50 }).withMessage('El nombre no puede exceder 50 caracteres.'),
  body('capacity').isInt({ min: 1 }).withMessage('La capacidad debe ser un número mayor que 0.'),
  body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo.'),
  body('phone').isString().isLength({ max: 15 }).withMessage('El teléfono no puede exceder 15 caracteres.')
], handleValidationErrors, fileUploader.single("image"), async (req, res) => {
  try {
    const owner = req.payload;
    const { name, capacity, address, price, description, category, phone } = req.body;

    // Validación de datos antes de la creación
    if (!name || !capacity || !price || !phone) {
      return res.status(400).json({ message: "Faltan datos obligatorios para crear el restaurante" });
    }

    const newRestaurant = await Restaurant.create({
      name,
      capacity,
      address,
      price,
      description,
      category,
      image: req.file ? req.file.path : undefined,
      phone,
      owner: owner._id,
    });

    // Actualizar el usuario con el nuevo restaurante
    await User.findByIdAndUpdate(
      owner._id,
      { $addToSet: { restaurant: newRestaurant._id }, $set: { isOwner: true } },
      { new: true }
    );

    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error("Error al crear restaurante:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT: Actualizar un restaurante
router.put("/update/:id", [
  isAuthenticated,
  param('id').isMongoId().withMessage('ID no válido.'),
  body('name').optional().isString().isLength({ max: 50 }).withMessage('El nombre no puede exceder 50 caracteres.')
], handleValidationErrors, fileUploader.single("image"), async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const updates = req.body; // Los datos generales del restaurante
    const image = req.file ? req.file.path : null; // Si se proporciona una nueva imagen

    // Si la imagen está presente, actualizamos la propiedad de la imagen
    if (image) {
      updates.image = image;
    }

    // Actualizar el restaurante con los datos proporcionados, incluidos los datos de la imagen
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, updates, { new: true });

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error("Error al actualizar restaurante:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE: Eliminar un restaurante
router.delete("/delete/:id", [
  isAuthenticated,
  param('id').isMongoId().withMessage('ID no válido.')
], handleValidationErrors, async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);

    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    res.status(200).json({ message: "Restaurante eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar restaurante:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;


