const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name || '',
        email,
        password: hashed
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    console.error('Registration error:', err);
    
    // Provide more specific error messages
    if (err.code === 'P2002') {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (err.code === 'P1001' || err.code === 'P1000') {
      return res.status(500).json({ message: 'Database connection failed. Please check your database configuration.' });
    }
    
    res.status(500).json({ message: err.message || 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        name: true,
        email: true
      }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    
    // Provide more specific error messages
    if (err.code === 'P1001' || err.code === 'P1000') {
      return res.status(500).json({ message: 'Database connection failed. Please check your database configuration.' });
    }
    
    res.status(500).json({ message: err.message || 'Server error during login' });
  }
});

module.exports = router;
