const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating.model");
const Restaurant = require("../models/Restaurant.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET: Obtiene todas las valoraciones de un restaurante específico
router.get("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;

  Rating.find({ restaurant: restaurantId })
    .then((ratings) => {
      if (!ratings || ratings.length === 0) {
        return res
          .status(404)
          .json({ message: "No ratings found for this restaurant" });
      }

      const totalRatings = ratings.length;
      const totalScore = ratings.reduce((acc, rating) => acc + rating.value, 0);
      const averageRating = totalScore / totalRatings;

      res.status(200).json({
        ratings,
        totalRatings,
        averageRating,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// POST: Crea una nueva valoración
router.post("/", isAuthenticated, (req, res) => {
  const { value, restaurant } = req.body;
  const author = req.payload.userId; // Accediendo al ID del usuario autenticado

  Rating.findOne({ author, restaurant })
    .then((existingRating) => {
      if (existingRating) {
        return Rating.findByIdAndUpdate(
          existingRating._id,
          { value },
          { new: true }
        )
          .then((updatedRating) => {
            res.status(200).json(updatedRating);
          })
          .catch((error) => {
            res.status(500).json({ message: error.message });
          });
      } else {
        Rating.create({ author, value, restaurant })
          .then((newRating) => {
            // Lógica adicional aquí si es necesario
            res.status(201).json(newRating);
          })
          .catch((error) => {
            res.status(500).json({ message: error.message });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});
//TODO terminar con la logica de ratings
// PUT: Actualiza una valoración existente
router.put("/:ratingId", isAuthenticated, (req, res) => {
  const { value } = req.body;
  const { ratingId } = req.params;

  Rating.findByIdAndUpdate(ratingId, { value }, { new: true })
    .then((updatedRating) => {
      if (!updatedRating) {
        return res.status(404).json({ message: "Rating not found" });
      }
      // Lógica adicional aquí si es necesario
      res.status(200).json(updatedRating);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// DELETE: Elimina una valoración existente
router.delete("/:ratingId", isAuthenticated, (req, res) => {
  const { ratingId } = req.params;

  Rating.findByIdAndDelete(ratingId)
    .then((deletedRating) => {
      if (!deletedRating) {
        return res.status(404).json({ message: "Rating not found" });
      }
      // Lógica adicional aquí si es necesario
      res.status(200).json({ message: "Rating deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;


