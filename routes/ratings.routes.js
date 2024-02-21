const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating.model");
const Restaurant = require("../models/Restaurant.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

router.get("/:restaurantId", isAuthenticated, (req, res) => {
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

router.post("/", isAuthenticated, (req, res) => {
    const { author, value, restaurant } = req.body;
  
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
              Promise.all([
                Restaurant.findByIdAndUpdate(restaurant, {
                  $push: { ratings: newRating._id },
                  $addToSet: { ratedByUsers: author },
                }),
                Rating.findByIdAndUpdate(newRating._id, {
                  $addToSet: { ratedByUsers: author },
                }),
                Rating.aggregate([
                  { $match: { restaurant: newRating.restaurant } },
                  {
                    $group: {
                      _id: null,
                      average: { $avg: "$value" },
                    },
                  },
                ]),
              ])
                .then(([_, __, result]) => {
                  const averageRating = result.length > 0 ? result[0].average : 0;
            
                  Restaurant.findByIdAndUpdate(restaurant, { averageRating })
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
  
  router.put("/:ratingId", isAuthenticated, (req, res) => {
    const { value } = req.body;
    const { ratingId } = req.params;
  
    Rating.findByIdAndUpdate(ratingId, { value }, { new: true })
      .then((updatedRating) => {
        if (!updatedRating) {
          return res.status(404).json({ message: "Rating not found" });
        }
        Rating.findByIdAndUpdate(ratingId, {
          $addToSet: { ratedByUsers: req.payload._id },
        })
          .then(() => {
            res.status(200).json(updatedRating);
          })
          .catch((error) => {
            res.status(500).json({ message: error.message });
          });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  });
  
  router.delete("/:ratingId", isAuthenticated, (req, res) => {
    const { ratingId } = req.params;
  
    Rating.findByIdAndDelete(ratingId)
      .then((deletedRating) => {
        if (!deletedRating) {
          return res.status(404).json({ message: "Rating not found" });
        }
        Rating.findByIdAndUpdate(ratingId, {
          $pull: { ratedByUsers: req.payload._id },
        })
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
  });
  
module.exports = router;

