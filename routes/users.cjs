const express = require("express");
const router = express.Router();
const User = require("../models/User.cjs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();
const key = process.env.JWT_KEY;

// GET request to fetch user by username
router.get('/:username', async (req, res) => {
   const { username } = req.params;
   try {
      const user = await User.findOne({ username });
      if (user) {
         res.json(user);
      } else {
         res.status(404).json({ message: "User not found" });
      }
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

// POST request to authenticate user
router.post('/prijava', async (req, res) => {
   const { username, password } = req.body;

   try {
      const user = await User.findOne({ username });
      if (!user) {
         return res.status(401).json({ message: "Netačno korisničko ime ili lozinka" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
         return res.status(401).json({ message: "Netačno korisničko ime ili lozinka" });
      }

      const token = jwt.sign({ username, isLoggedIn: true }, key, {
         expiresIn: '60d',
      });

      res.status(200).json({ token });
   } catch (error) {
      res.status(500).json({ message: "Server error" });
   }
});

// POST request to create a new user
router.post('/napravi_nalog', async (req, res) => {
   const { username, password, posts } = req.body;

   try {
      // Check if the username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
         return res.status(409).json({ error: "Korisničko ime je zauzeto" });
      }

      // Hash the password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the new user
      const user = await User.create({
         username,
         password: hashedPassword, // Store the hashed password
         posts
      });

      const token = jwt.sign({ username, isLoggedIn: true }, key, {
         expiresIn: '60d',
      });

      res.status(200).json({ user, token });  // Include the token in the response
   } catch (error) {
      res.status(400).json({ error: error.message });
      console.log("User account creation failed");
   }
});

module.exports = router;
