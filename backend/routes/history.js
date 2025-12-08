const express = require('express');
const router = express.Router();
const prisma = require('../db');
const auth = require('../middleware/auth');

// GET /api/history
// Query: page, limit, search, sortBy, sortOrder, from, to, dateFrom, dateTo
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page || '1');
  const limit = Math.min(100, parseInt(req.query.limit || '10'));
  const offset = (page - 1) * limit;
  const { search, sortBy = 'createdAt', sortOrder = 'desc', from, to, dateFrom, dateTo } = req.query;
  
  try {
    const where = {
      userId: userId
    };
    
    if (search) {
      where.OR = [
        { fromSymbol: { contains: search.toUpperCase() } },
        { toSymbol: { contains: search.toUpperCase() } }
      ];
    }
    
    if (from) {
      where.fromSymbol = from.toUpperCase();
    }
    
    if (to) {
      where.toSymbol = to.toUpperCase();
    }
    
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }
    
    const orderBy = {};
    const sortField = sortBy === 'created_at' ? 'createdAt' : sortBy;
    orderBy[sortField] = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';
    
    const [items, total] = await Promise.all([
      prisma.history.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit
      }),
      prisma.history.count({ where })
    ]);
    
    res.json({ items, meta: { page, limit, total } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/history/:id
router.put('/:id', auth, async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id);
  const { note } = req.body;
  
  try {
    // Only allow updating note column for safety
    const updated = await prisma.history.updateMany({
      where: {
        id: id,
        userId: userId
      },
      data: {
        note: note || ''
      }
    });
    
    if (updated.count === 0) {
      return res.status(404).json({ message: 'Not found or permission denied' });
    }
    
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/history/:id
router.delete('/:id', auth, async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id);
  
  try {
    const deleted = await prisma.history.deleteMany({
      where: {
        id: id,
        userId: userId
      }
    });
    
    if (deleted.count === 0) {
      return res.status(404).json({ message: 'Not found or permission denied' });
    }
    
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
