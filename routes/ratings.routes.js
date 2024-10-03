const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating.model");
const Restaurant = require("../models/Restaurant.model");
const User = require("../models/User.model");
const mongoose = require("mongoose");

// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
  const { restaurantId, ratingId } = req.params;
  if (restaurantId && !mongoose.Types.ObjectId.isValid(restaurantId)) {
    return res.status(400).json({ message: "ID de restaurante inválido" });
  }
  if (ratingId && !mongoose.Types.ObjectId.isValid(ratingId)) {
    return res.status(400).json({ message: "ID de valoración inválido" });
  }
  next();
}

// Middleware to validate and sanitize the rating value
function validateRatingValue(req, res, next) {
  const { value } = req.body;
  
  if (value === undefined || typeof value !== 'number' || value < 1 || value > 5) {
    return res.status(400).json({ message: "El valor de la valoración debe ser un número entre 1 y 5" });
  }
  
  next();
}

// Middleware to sanitize user inputs
function sanitizeInputs(req, res, next) {
  const { user, city, restaurant, ratingId } = req.body;

  if (user) req.body.user = String(user).trim();
  if (city) req.body.city = String(city).trim();
  if (restaurant) req.body.restaurant = mongoose.Types.ObjectId.isValid(restaurant) ? restaurant : null;
  if (ratingId) req.body.ratingId = mongoose.Types.ObjectId.isValid(ratingId) ? ratingId : null;
  
  next();
}

router.use(validateObjectId);

// GET: Obtener valoraciones de un restaurante
router.get("/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const ratings = await Rating.find({ restaurant: restaurantId });

    if (!ratings || ratings.length === 0) {
      return res.status(404).json({ message: "No se encontraron valoraciones para este restaurante" });
    }

    const totalRatings = ratings.length;
    const totalScore = ratings.reduce((acc, rating) => acc + rating.value, 0);
    const averageRating = totalRatings > 0 ? totalScore / totalRatings : null;

    res.status(200).json({
      ratings,
      totalRatings,
      averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Crea una nueva valoración
router.post("/rate", validateRatingValue, sanitizeInputs, async (req, res) => {
  const { value, restaurant } = req.body;
  const authorId = req.payload; // Asegúrate de que esto viene de un token o sesión validada

  try {
    const existingRating = await Rating.findOne({ author: authorId, restaurant: restaurant });

    if (existingRating) {
      return res.status(400).json({ message: "El usuario ya ha valorado este restaurante" });
    }

    const newRating = await Rating.create({ author: authorId, value, restaurant });

    // Agregar el nuevo rating al restaurante y al usuario
    await Promise.all([
      Restaurant.findByIdAndUpdate(
        restaurant,
        { $push: { ratings: newRating._id }, $addToSet: { ratedByUsers: authorId } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        authorId,
        { $push: { ratings: newRating._id } },
        { new: true }
      ),
    ]);

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: Actualiza una valoración existente
router.put("/update/:ratingId", validateRatingValue, sanitizeInputs, async (req, res) => {
  const { value } = req.body;
  const { ratingId } = req.params;

  try {
    const updatedRating = await Rating.findByIdAndUpdate(ratingId, { value }, { new: true });

    if (!updatedRating) {
      return res.status(404).json({ message: "Valoración no encontrada" });
    }

    res.status(200).json(updatedRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Elimina una valoración existente
router.delete("/delete/:ratingId", async (req, res) => {
  const { ratingId } = req.params;

  try {
    const deletedRating = await Rating.findByIdAndDelete(ratingId);

    if (!deletedRating) {
      return res.status(404).json({ message: "Valoración no encontrada" });
    }

    await Promise.all([
      Restaurant.findByIdAndUpdate(
        deletedRating.restaurant,
        { $pull: { ratings: ratingId } }
      ),
      User.findByIdAndUpdate(
        deletedRating.author,
        { $pull: { ratings: ratingId } }
      ),
    ]);

    res.status(200).json({ message: "Valoración eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;





