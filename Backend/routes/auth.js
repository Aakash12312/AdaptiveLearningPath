const express = require('express');
const router = express.Router();
const Child = require('../models/childuser'); // Import the Child model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { Name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await Child.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword); // Debugging

    // Create a new user
    const newUser = new Child({ Name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration Error:', err); // Debugging
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login Request Body:', { email, password }); // Debugging

    // Find user by email
    const user = await Child.findOne({ email });
    console.log('User from DB:', user); // Debugging

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password Match:', isMatch); // Debugging

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, Name: user.Name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error('Login Error:', err); // Debugging
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;