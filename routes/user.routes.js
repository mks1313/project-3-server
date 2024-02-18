const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware.js"); 


router.get('/profile', isAuthenticated, (req, res, next) => {
    res.status(200).json({ user: req.payload });
});

// PUT /profile: 
router.put('/profile', isAuthenticated, (req, res, next) => {
    const userId = req.payload._id; 
    const { name, newPassword } = req.body;

    User.findByIdAndUpdate(userId, { name, password: newPassword })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'Profile updated successfully' });
        })
        .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

// DELETE 
router.delete('/profile', isAuthenticated, (req, res, next) => {
    const userId = req.payload._id; 

    User.findByIdAndDelete(userId)
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'Profile deleted successfully' });
        })
        .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

module.exports = router;