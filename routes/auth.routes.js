const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const saltRounds = 10;
const User = require("../models/User.model");

 

// POST  /auth/signup
router.post('/signup', (req, res, next) => {
    const { email, password, name } = req.body;
   
    // Check if the email or password or name is provided as an empty string 
    if (email === '' || password === '' || name === '') {
      res.status(400).json({ message: "Provide email, password and name" });
      return;
    }
   
    // Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Provide a valid email address.' });
      return;
    }
    
    // Use regex to validate the password format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }
   
   
    // Check the users collection if a user with the same email already exists
    User.findOne({ email })
      .then((foundUser) => {
        // If the user with the same email already exists, send an error response
        if (foundUser) {
          res.status(400).json({ message: "User already exists." });
          return;
        }
   
        // If the email is unique, proceed to hash the password
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
   
        // Create a new user in the database
        // We return a pending promise, which allows us to chain another `then` 
        return User.create({ email, password: hashedPassword, name });
      })
      .then((createdUser) => {
        // Deconstruct the newly created user object to omit the password
        // We should never expose passwords publicly
        const { email, name, _id } = createdUser;
      
        // Create a new object that doesn't expose the password
        const user = { email, name, _id };
   
        // Send a json response containing the user object
        res.status(201).json({ user: user });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
      });
  });

// POST  /auth/login

// ...

 

 

// GET  /auth/verify

// ...

// logout!!!!!!!!!!








module.exports = router;