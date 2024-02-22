const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const { isAuthenticated } = require("../middleware/jwt.middleware.js"); 
const fileUploader = require("../config/cloudinary.config.js");


router.get('/profile', (req, res, next) => {
    res.status(200).json({ user: req.payload });
});


router.put('/profile', fileUploader.single('profileImage'), (req, res, next) => {
    const userId = req.payload._id; 
    const { name, newPassword } = req.body;

    const updateFields = { name, password: newPassword };
    if (req.file) {
        updateFields.profileImage = req.file.path;
    }

    User.findByIdAndUpdate(userId, updateFields)
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'Profile updated successfully' });
        })
        .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});


router.delete('/profile', (req, res, next) => {
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