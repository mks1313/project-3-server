const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment.model');
const Restaurant = require('../models/Restaurant.model');


// Ruta para obtener todos los comentarios
router.get('/', (req, res) => {
    Comment.find()
        .then(comments => {
            res.status(200).json(comments);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
});

// Ruta para crear un nuevo comentario
router.post('/', (req, res) => {
    const { author, content, restaurant } = req.body;
    const newComment = new Comment({
        author,
        content,
        restaurant
    });
    newComment.save()
        .then(savedComment => {
            Restaurant.findByIdAndUpdate(restaurant, { $push: { comments: savedComment._id } })
            .then(() => {
                res.status(201).json(savedComment);
            })
            .catch(error => {
                res.status(500).json({message: error.message})
            })
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
});

// Ruta para actualizar un comentario existente
router.put('/:commentId', (req, res) => {
    const { content, restaurantId } = req.body; 

    Comment.findByIdAndUpdate(req.params.commentId, { content }, { new: true })
        .then(updatedComment => {
            if (!updatedComment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            Restaurant.findByIdAndUpdate(restaurantId, { $set: { comments: [updatedComment._id] } })
                .then(() => {
                    res.status(200).json(updatedComment);
                })
                .catch(error => {
                    res.status(500).json({ message: error.message });
                });
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
});


// Ruta para eliminar un comentario existente
router.delete('/:commentId', (req, res) => {
    Comment.findByIdAndDelete(req.params.commentId)
        .then(deletedComment => {
            if (!deletedComment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            res.status(200).json({ message: 'Comment deleted successfully' });
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
});

module.exports = router;
