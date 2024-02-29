const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const { isAuthenticated } = require("../middleware/jwt.middleware.js"); 
const fileUploader = require("../config/cloudinary.config.js");


router.get('/profile', isAuthenticated, (req, res, next) => {
    res.status(200).json({ user: req.payload });
});


router.put('/profile', isAuthenticated, (req, res, next) => {
    const userId = req.payload._id; 
    const { name, email, newPassword, confirmPassword, birthday,image, isOwner, sex } = req.body;

    // Verificar si newPassword y confirmPassword coinciden
    if (newPassword && newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const updateFields = {};
    
    // Agregar los campos que se proporcionaron en la solicitud
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (birthday) updateFields.birthday = birthday;
    if (isOwner !== undefined) updateFields.isOwner = isOwner;
    if (sex) updateFields.sex = sex;
    if (newPassword) updateFields.password = newPassword;
    // Actualizar la imagen de perfil si se proporciona
     else {
        // Si no se proporciona una nueva imagen, usar la imagen por defecto
        updateFields.profileImage = User.defaultImageURL; // Asigna la URL de la imagen por defecto
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