const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const authRoutes = require('./routes/auth');
const swapRoutes = require('./routes/swap');
const historyRoutes = require('./routes/history');
const profileRoutes = require('./routes/profile');
const watchlistRoutes = require('./routes/watchlist');
const alertsRoutes = require('./routes/alerts');
const prisma = require('./db');

const app = express();
// CORS configuration - allow frontend URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://capstone-project-sem3-h2u5.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/swap', swapRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/alerts', alertsRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'BitPort API Server',
    version: '1.0.0',
      endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      swap: '/api/swap',
      history: '/api/history',
      profile: '/api/profile',
      watchlist: '/api/watchlist',
      alerts: '/api/alerts'
    }
  });
});

const port = process.env.PORT || 4000;
app.listen(port, async () => {
  console.log(`BitPort backend running on port ${port}`);
  try {
    // Test Prisma connection
    await prisma.$connect();
    console.log('Database connected via Prisma');
  } catch (err) {
    console.error('Database connection failed:', err.message || err);
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
