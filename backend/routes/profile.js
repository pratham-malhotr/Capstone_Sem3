const express = require('express');
const router = express.Router();
const prisma = require('../db');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// GET /api/profile - Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/profile - Update user profile
router.put('/', auth, async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const updateData = {};
    
    if (name !== undefined) {
      updateData.name = name;
    }
    
    if (email !== undefined) {
      // Check if email is already taken by another user
      const existing = await prisma.user.findFirst({
        where: {
          email: email,
          id: { not: req.user.id }
        }
      });
      
      if (existing) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      updateData.email = email;
    }
    
    if (password !== undefined) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
