const express = require('express');
const router = express.Router();
const axios = require('axios');
const prisma = require('../db');
const auth = require('../middleware/auth');
require('dotenv').config();

// GET /api/swap/prices - Get current prices
router.get('/prices', async (req, res) => {
  try {
    const url = `${process.env.COINGECKO_BASE || 'https://api.coingecko.com/api/v3'}/simple/price`;
    const ids = 'bitcoin,ethereum,binancecoin,cardano,solana,polkadot,dogecoin,matic-network,avalanche-2,chainlink';
    const resp = await axios.get(url, { 
      params: { ids, vs_currencies: 'usd' },
      timeout: 10000
    });
    res.json(resp.data);
  } catch (err) {
    console.error('Price fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch prices' });
  }
});

// POST /api/swap/execute - Execute a swap
router.post('/execute', auth, async (req, res) => {
  const { from, to, amount } = req.body;
  if (!from || !to || !amount) {
    return res.status(400).json({ message: 'from, to and amount required' });
  }
  
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const url = `${process.env.COINGECKO_BASE || 'https://api.coingecko.com/api/v3'}/simple/price`;
    const fromId = from.toLowerCase();
    const toId = to.toLowerCase();
    const ids = `${fromId},${toId}`;
    
    const resp = await axios.get(url, { 
      params: { ids, vs_currencies: 'usd' },
      timeout: 10000
    });
    
    const data = resp.data;
    if (!data[fromId] || !data[toId]) {
      return res.status(400).json({ message: 'Price not available for one of the symbols' });
    }
    
    const priceFromUSD = data[fromId].usd;
    const priceToUSD = data[toId].usd;
    const amountTo = (numAmount * priceFromUSD) / priceToUSD;
    const exchangeRate = priceFromUSD / priceToUSD;
    
    // Save swap to history
    const swapRecord = await prisma.history.create({
      data: {
        userId: req.user.id,
        fromSymbol: from.toUpperCase(),
        toSymbol: to.toUpperCase(),
        amountFrom: numAmount,
        amountTo: amountTo,
        priceUsd: priceFromUSD
      }
    });
    
    res.json({ 
      success: true, 
      from: from.toUpperCase(), 
      to: to.toUpperCase(), 
      amountFrom: numAmount, 
      amountTo: parseFloat(amountTo.toFixed(8)), 
      exchangeRate: parseFloat(exchangeRate.toFixed(8)),
      priceUSD: priceFromUSD,
      swapId: swapRecord.id
    });
  } catch (err) {
    console.error('Swap error:', err.message);
    if (err.response) {
      return res.status(500).json({ message: 'Failed to fetch prices from exchange' });
    }
    res.status(500).json({ message: 'Swap failed' });
  }
});

module.exports = router;
