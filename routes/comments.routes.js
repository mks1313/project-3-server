const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment.model");
const Restaurant = require("../models/Restaurant.model");
const User = require("../models/User.model");

router.get("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;

  Comment.find({ restaurant: restaurantId })
    .populate("author")
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// POST: Crea un nuevo comentario
router.post("/create", (req, res) => {
  const { content, restaurant } = req.body;
  const authorId = req.payload;

  Comment.findOne({ author: authorId, restaurant: restaurant }).then(
    (existingComment) => {
      if (existingComment) {
        return res
          .status(400)
          .json({ message: "Ya has comentado en este restaurante" });
      } else {
        Comment.create({ author: authorId, content, restaurant })
          .then((newComment) => {
            Promise.all([
              Restaurant.findByIdAndUpdate(restaurant, {
                $push: { comments: newComment._id },
                $addToSet: { commentedByUsers: authorId },
              }),
              User.findByIdAndUpdate(authorId, {
                $push: { comments: newComment._id },
              }),
            ])
              .then(() => {
                res.status(201).json(newComment);
              })
              .catch((error) => {
                res.status(500).json({ message: error.message });
              });
          })
          .catch((error) => {
            res.status(500).json({ message: error.message });
          });
      }
    }
  );
});

router.put("/:commentId", (req, res) => {
  const { content, restaurantId } = req.body;
  const { commentId } = req.params;

  Comment.findByIdAndUpdate(commentId, { content }, { new: true })
    .then((updatedComment) => {
      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      Restaurant.findByIdAndUpdate(restaurantId, {
        $set: { comments: [updatedComment._id] },
      })
        .then(() => {
          res.status(200).json(updatedComment);
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.delete("/:commentId", (req, res) => {
  Comment.findByIdAndDelete(req.params.commentId)
    .then((deletedComment) => {
      if (!deletedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      return Restaurant.updateOne({ $pull: { comments: deletedComment._id } })
        .then(() => {
          res.status(200).json({ message: "Comment deleted succesfully" });
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
