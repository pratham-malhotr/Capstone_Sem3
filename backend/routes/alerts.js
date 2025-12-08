const express = require('express');
const router = express.Router();
const prisma = require('../db');
const auth = require('../middleware/auth');

// GET /api/alerts
// Query: page, limit, search, sortBy, sortOrder, symbol, condition, isActive, dateFrom, dateTo
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page || '1');
  const limit = Math.min(100, parseInt(req.query.limit || '10'));
  const offset = (page - 1) * limit;
  const { 
    search, 
    sortBy = 'createdAt', 
    sortOrder = 'desc', 
    symbol, 
    condition, 
    isActive,
    dateFrom, 
    dateTo 
  } = req.query;
  
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
    
    // Filter by condition (above/below)
    if (condition) {
      where.condition = condition.toLowerCase();
    }
    
    // Filter by active status
    if (isActive !== undefined) {
      where.isActive = isActive === 'true' || isActive === true;
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
                     sortBy === 'target_price' ? 'targetPrice' :
                     sortBy === 'is_active' ? 'isActive' :
                     sortBy === 'triggered_at' ? 'triggeredAt' :
                     sortBy;
    orderBy[sortField] = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';
    
    // Fetch data with pagination
    const [items, total] = await Promise.all([
      prisma.priceAlert.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit
      }),
      prisma.priceAlert.count({ where })
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
    console.error('Alerts fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/alerts/:id - Get single alert
router.get('/:id', auth, async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id);
  
  try {
    const item = await prisma.priceAlert.findFirst({
      where: {
        id: id,
        userId: userId
      }
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    res.json(item);
  } catch (err) {
    console.error('Alert fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/alerts - Create price alert
router.post('/', auth, async (req, res) => {
  const userId = req.user.id;
  const { symbol, coinName, targetPrice, condition } = req.body;
  
  if (!symbol || !coinName || !targetPrice || !condition) {
    return res.status(400).json({ 
      message: 'Symbol, coinName, targetPrice, and condition are required' 
    });
  }
  
  if (condition !== 'above' && condition !== 'below') {
    return res.status(400).json({ 
      message: 'Condition must be either "above" or "below"' 
    });
  }
  
  if (parseFloat(targetPrice) <= 0) {
    return res.status(400).json({ 
      message: 'Target price must be greater than 0' 
    });
  }
  
  try {
    const item = await prisma.priceAlert.create({
      data: {
        userId: userId,
        symbol: symbol.toUpperCase(),
        coinName: coinName,
        targetPrice: parseFloat(targetPrice),
        condition: condition.toLowerCase(),
        isActive: true
      }
    });
    
    res.status(201).json(item);
  } catch (err) {
    console.error('Alert create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/alerts/:id - Update price alert
router.put('/:id', auth, async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id);
  const { coinName, targetPrice, condition, isActive } = req.body;
  
  try {
    const updateData = {};
    
    if (coinName !== undefined) {
      updateData.coinName = coinName;
    }
    
    if (targetPrice !== undefined) {
      if (parseFloat(targetPrice) <= 0) {
        return res.status(400).json({ message: 'Target price must be greater than 0' });
      }
      updateData.targetPrice = parseFloat(targetPrice);
    }
    
    if (condition !== undefined) {
      if (condition !== 'above' && condition !== 'below') {
        return res.status(400).json({ message: 'Condition must be either "above" or "below"' });
      }
      updateData.condition = condition.toLowerCase();
    }
    
    if (isActive !== undefined) {
      updateData.isActive = isActive === true || isActive === 'true';
    }
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    const updated = await prisma.priceAlert.updateMany({
      where: {
        id: id,
        userId: userId
      },
      data: updateData
    });
    
    if (updated.count === 0) {
      return res.status(404).json({ message: 'Alert not found or permission denied' });
    }
    
    const item = await prisma.priceAlert.findFirst({
      where: { id: id, userId: userId }
    });
    
    res.json(item);
  } catch (err) {
    console.error('Alert update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/alerts/:id - Delete price alert
router.delete('/:id', auth, async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id);
  
  try {
    const deleted = await prisma.priceAlert.deleteMany({
      where: {
        id: id,
        userId: userId
      }
    });
    
    if (deleted.count === 0) {
      return res.status(404).json({ message: 'Alert not found or permission denied' });
    }
    
    res.json({ ok: true, message: 'Alert deleted successfully' });
  } catch (err) {
    console.error('Alert delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

