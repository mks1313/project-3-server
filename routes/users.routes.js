const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const fileUploader = require("../config/cloudinary.config.js");


router.get('/profile', (req, res, next) => {
    const userId = req.payload._id;

    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const profileImage = user.profileImage ? user.profileImage : defaultImageURL;

            res.status(200).json({ user: { ...user.toObject(), profileImage } });
        })
        .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});



router.post('/profile/update', fileUploader.single("image"), (req, res, next) => {
    const userId = req.payload._id; 
    const { name, email, newPassword, confirmPassword, birthday, isOwner, sex } = req.body;
    
    
    // if (newPassword && newPassword !== confirmPassword) {
    //     return res.status(400).json({ message: 'Passwords do not match' });
    // }
    
    const updateFields = {};
    if (req.hasOwnProperty('file') ) {
        updateFields.profileImage = req.file.path;
    }
    
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (birthday) updateFields.birthday = birthday;
    if (isOwner !== undefined) updateFields.isOwner = isOwner;
    if (sex) updateFields.sex = sex;
    if (newPassword) updateFields.password = newPassword;
    // if (!image) {
    //     updateFields.profileImage = User.schema.obj.profileImage.default; 
    // }

    console.log(updateFields);

    User.findByIdAndUpdate(userId, updateFields, { new: true }) 
        .then(updatedUser => {
            console.log(updatedUser);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'Profile updated successfully' });
        })
        .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});




router.delete('/profile/delete', (req, res, next) => {
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