const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment.model");
const Restaurant = require("../models/Restaurant.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js"); 


router.get("/:restaurantId", isAuthenticated, (req, res) => {
  const { restaurantId } = req.params;

  Comment.find({ restaurant: restaurantId })
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post("/", isAuthenticated, (req, res) => {
  const { author, content, restaurant } = req.body;

  Comment.findOne({ author, restaurant })
    .then(existingComment => {
      if (existingComment) {
        return Comment.findByIdAndUpdate(
          existingComment._id,
          { content },
          { new: true }
        )
          .then(updatedComment => {
            res.status(200).json(updatedComment);
          })
          .catch((error) => {
            res.status(500).json({ message: error.message });
          });
      } else {
        Comment.create({ author, content, restaurant })
        .then((newComment) => {
          Promise.all([
            Restaurant.findByIdAndUpdate(restaurant, {
              $push: { comments: newComment._id }, 
              $addToSet: { commentedByUsers: author }, 
            }),
            Comment.findByIdAndUpdate(author, {
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
  });
});


router.put("/:commentId", isAuthenticated, (req, res) => {
  const { content, restaurantId } = req.body;
  const { commentId } = req.params;

  Comment.findByIdAndUpdate(commentId, { content }, { new: true })
    .then(updatedComment => {
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

router.delete("/:commentId", isAuthenticated, (req, res) => {
  Comment.findByIdAndDelete(req.params.commentId)
    .then(deletedComment => {
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
