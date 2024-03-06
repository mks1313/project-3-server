const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating.model");
const Restaurant = require("../models/Restaurant.model");
const User = require("../models/User.model");


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
      const averageRating = totalRatings > 0 ? totalScore / totalRatings : null;
      console.log(averageRating);
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
router.post("/rate", (req, res) => {
  const { value, restaurant } = req.body;
  const authorId = req.payload;

  Rating.findOne({ author: authorId, restaurant: restaurant })
    .then((existingRating) => {
      if (existingRating) {
        return res.status(400).json({ message: "El usuario ya ha valorado este restaurante" });
      } else {
        Rating.create({ author: authorId, value, restaurant })
          .then((newRating) => {
            // Agregar el nuevo rating al restaurante
            Promise.all([
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
            ])
              .then(() => {
                res.status(201).json(newRating);
              })
              .catch((error) => {
                res.status(500).json({ message: error.message });
              });
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



// PUT: Actualiza una valoración existente
router.put("/update/:ratingId", (req, res) => {
  const { value } = req.body;
  const { ratingId } = req.params;

  Rating.findByIdAndUpdate(ratingId, { value }, { new: true })
    .then((updatedRating) => {
      if (!updatedRating) {
        return res.status(404).json({ message: "Rating not found" });
      }
      res.status(200).json(updatedRating);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// DELETE: Elimina una valoración existente
router.delete("/delete/:ratingId", (req, res) => {
  const { ratingId } = req.params;

  Rating.findByIdAndDelete(ratingId)
    .then((deletedRating) => {
      if (!deletedRating) {
        return res.status(404).json({ message: "Rating not found" });
      }
      Restaurant.findByIdAndUpdate(
        deletedRating.restaurant,
        { $pull: { ratings: ratingId } }
      )
        .then(() => {
          User.findByIdAndUpdate(
            deletedRating.author,
            { $pull: { ratings: ratingId } }
          )
            .then(() => {
              res.status(200).json({ message: "Rating deleted successfully" });
            })
            .catch((error) => {
              res.status(500).json({ message: error.message });
            });
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;



