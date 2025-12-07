const express = require('express');
const router = express.Router();
const prisma = require('../db');
const auth = require('../middleware/auth');

// GET /api/watchlist
// Query: page, limit, search, sortBy, sortOrder, symbol, dateFrom, dateTo
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page || '1');
  const limit = Math.min(100, parseInt(req.query.limit || '10'));
  const offset = (page - 1) * limit;
  const { search, sortBy = 'createdAt', sortOrder = 'desc', symbol, dateFrom, dateTo } = req.query;
  
  try {
    const where = {
      userId: userId
    };
    
    // Search functionality
    if (search) {
      where.OR = [
        { symbol: { contains: search.toUpperCase() } },
        { coinName: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Filter by symbol
    if (symbol) {
      where.symbol = symbol.toUpperCase();
    }
    
    // Filter by date range
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }
    
    // Sorting
    const orderBy = {};
    const sortField = sortBy === 'created_at' ? 'createdAt' : 
                     sortBy === 'coin_name' ? 'coinName' : 
                     sortBy;
    orderBy[sortField] = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';
    
    // Fetch data with pagination
    const [items, total] = await Promise.all([
      prisma.watchlist.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit
      }),
      prisma.watchlist.count({ where })
    ]);
    
    res.json({ 
      items, 
      meta: { 
        page, 
        limit, 
        total,
        totalPages: Math.ceil(total / limit)
      } 
    });
  } catch (err) {
    console.error('Watchlist fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/watchlist/:id - Get single watchlist item
router.get('/:id', auth, async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id);
  
  try {
    const item = await prisma.watchlist.findFirst({
      where: {
        id: id,
        userId: userId
      }
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }
    
    res.json(item);
  } catch (err) {
    console.error('Watchlist fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/watchlist - Create watchlist item
router.post('/', auth, async (req, res) => {
  const userId = req.user.id;
  const { symbol, coinName, note } = req.body;
  
  if (!symbol || !coinName) {
    return res.status(400).json({ message: 'Symbol and coinName are required' });
  }
  
  try {
    // Check if already exists
    const existing = await prisma.watchlist.findFirst({
      where: {
        userId: userId,
        symbol: symbol.toUpperCase()
      }
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Coin already in watchlist' });
    }
    
    const item = await prisma.watchlist.create({
      data: {
        userId: userId,
        symbol: symbol.toUpperCase(),
        coinName: coinName,
        note: note || null
      }
    });
    
    res.status(201).json(item);
  } catch (err) {
    console.error('Watchlist create error:', err);
    if (err.code === 'P2002') {
      return res.status(400).json({ message: 'Coin already in watchlist' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/watchlist/:id - Update watchlist item
router.put('/:id', auth, async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id);
  const { coinName, note } = req.body;
  
  try {
    const updateData = {};
    
    if (coinName !== undefined) {
      updateData.coinName = coinName;
    }
    
    if (note !== undefined) {
      updateData.note = note || null;
    }
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    const updated = await prisma.watchlist.updateMany({
      where: {
        id: id,
        userId: userId
      },
      data: updateData
    });
    
    if (updated.count === 0) {
      return res.status(404).json({ message: 'Watchlist item not found or permission denied' });
    }
    
    const item = await prisma.watchlist.findFirst({
      where: { id: id, userId: userId }
    });
    
    res.json(item);
  } catch (err) {
    console.error('Watchlist update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/watchlist/:id - Delete watchlist item
router.delete('/:id', auth, async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id);
  
  try {
    const deleted = await prisma.watchlist.deleteMany({
      where: {
        id: id,
        userId: userId
      }
    });
    
    if (deleted.count === 0) {
      return res.status(404).json({ message: 'Watchlist item not found or permission denied' });
    }
    
    res.json({ ok: true, message: 'Watchlist item deleted successfully' });
  } catch (err) {
    console.error('Watchlist delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

