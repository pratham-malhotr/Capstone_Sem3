# Render Deployment Guide for BitPort

## 📋 Overview

This guide covers deploying both the **Backend API** and **Frontend** to Render.

---

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Ensure your repository is public or connected to Render**

---

## 🔧 Backend Deployment

### Create Backend Web Service

1. **Go to Render Dashboard** → **New +** → **Web Service**

2. **Connect Repository**
   - Connect your GitHub/GitLab repository
   - Select the repository

3. **Configure Service Settings**

   **Basic Settings:**
   - **Name**: `bitport-backend`
   - **Region**: Choose closest region (e.g., Oregon)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npx prisma generate && npx prisma migrate deploy
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```

4. **Environment Variables** (Set in Render Dashboard)

   | Key | Value | Required |
   |-----|-------|----------|
   | `NODE_ENV` | `production` | ✅ Yes |
   | `PORT` | `4000` | ✅ Yes |
   | `DATABASE_URL` | Your Neon PostgreSQL connection string | ✅ Yes |
   | `JWT_SECRET` | A strong random string (generate with: `openssl rand -base64 32`) | ✅ Yes |
   | `COINGECKO_BASE` | `https://api.coingecko.com/api/v3` | ❌ Optional |

   **Example DATABASE_URL:**
   ```
   postgresql://user:password@host/database?sslmode=require&channel_binding=require
   ```

5. **Advanced Settings**
   - **Auto-Deploy**: `Yes` (deploys on every push to main branch)
   - **Plan**: `Free` (or upgrade for better performance)

6. **Click "Create Web Service"**

7. **Wait for Build**
   - Render will install dependencies
   - Generate Prisma Client
   - Run database migrations
   - Start the server

8. **Note Your Backend URL**
   - Example: `https://bitport-backend.onrender.com`
   - You'll need this for the frontend

---

## 🎨 Frontend Deployment

### Create Frontend Web Service

1. **Go to Render Dashboard** → **New +** → **Static Site** (or Web Service)

2. **Configure Service Settings**

   **If using Static Site:**
   - **Name**: `bitport-frontend`
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or `bitport` if your frontend is in a subdirectory)
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `dist`

   **If using Web Service:**
   - **Name**: `bitport-frontend`
   - **Root Directory**: Leave empty
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm run preview
     ```

3. **Environment Variables**

   | Key | Value | Required |
   |-----|-------|----------|
   | `VITE_API_URL` | Your backend URL (e.g., `https://bitport-backend.onrender.com`) | ✅ Yes |

   ⚠️ **Important**: For Vite, environment variables must start with `VITE_` to be accessible in the frontend.

4. **Click "Create Static Site"** (or "Create Web Service")

---

## 🔐 Environment Variables Reference

### Backend Environment Variables

```env
# Server Configuration
NODE_ENV=production
PORT=4000

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require&channel_binding=require

# JWT Secret (Generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters

# CoinGecko API (Optional)
COINGECKO_BASE=https://api.coingecko.com/api/v3
```

### Frontend Environment Variables

```env
# Backend API URL
VITE_API_URL=https://bitport-backend.onrender.com
```

---

## 📝 Build Logs Reference

### Backend Build Process

```
Step 1: Installing dependencies
npm install

Step 2: Generating Prisma Client
npx prisma generate

Step 3: Running database migrations
npx prisma migrate deploy

Step 4: Starting server
npm start
```

**Expected Build Logs:**
```
✓ Installing dependencies...
✓ Generating Prisma Client...
✓ Running migrations...
✓ Database connected via Prisma
✓ BitPort backend running on port 4000
```

### Frontend Build Process

```
Step 1: Installing dependencies
npm install

Step 2: Building for production
npm run build

Step 3: (If Web Service) Starting preview server
npm run preview
```

**Expected Build Logs:**
```
✓ Installing dependencies...
✓ Building for production...
✓ Built in X seconds
```

---

## 🐛 Troubleshooting

### Backend Issues

**Issue: Database connection failed**
- ✅ Check `DATABASE_URL` is correct
- ✅ Ensure Neon database is active
- ✅ Verify SSL mode is enabled in connection string

**Issue: Prisma migration failed**
- ✅ Check database permissions
- ✅ Ensure `DATABASE_URL` is set correctly
- ✅ Try running migrations manually: `npx prisma migrate deploy`

**Issue: JWT_SECRET not set**
- ✅ Add `JWT_SECRET` environment variable
- ✅ Use a strong random string (minimum 32 characters)

**Issue: Port already in use**
- ✅ Render automatically sets PORT, but ensure it's not hardcoded
- ✅ Use `process.env.PORT || 4000` in your code

### Frontend Issues

**Issue: API calls failing**
- ✅ Check `VITE_API_URL` is set correctly
- ✅ Ensure backend URL includes `https://`
- ✅ Verify backend is running and accessible
- ✅ Check CORS settings in backend

**Issue: Environment variables not working**
- ✅ Vite requires `VITE_` prefix for env vars
- ✅ Rebuild after changing environment variables
- ✅ Check browser console for errors

**Issue: Build fails**
- ✅ Check Node.js version compatibility
- ✅ Ensure all dependencies are in `package.json`
- ✅ Check for TypeScript/ESLint errors

---

## 🔄 Auto-Deploy Setup

### Enable Auto-Deploy

1. **In Render Dashboard** → **Your Service** → **Settings**
2. **Auto-Deploy**: Enable
3. **Branch**: `main` (or your default branch)

Now, every push to `main` will automatically trigger a new deployment.

---

## 📊 Monitoring

### Health Check Endpoint

Your backend includes a health check endpoint:
```
GET https://bitport-backend.onrender.com/api/health
```

Expected response:
```json
{ "ok": true }
```

### View Logs

1. **In Render Dashboard** → **Your Service** → **Logs**
2. View real-time logs
3. Download logs for debugging

---

## 🔒 Security Checklist

- [ ] Use strong `JWT_SECRET` (minimum 32 characters)
- [ ] Keep `DATABASE_URL` secret (never commit to git)
- [ ] Enable HTTPS (Render does this automatically)
- [ ] Set `NODE_ENV=production`
- [ ] Review CORS settings for production
- [ ] Use environment variables for all secrets

---

## 🚀 Quick Deploy Commands

### Using Render CLI (Optional)

```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Deploy backend
cd backend
render deploy

# Deploy frontend
cd ..
render deploy
```

---

## 📞 Support

If you encounter issues:
1. Check Render logs in dashboard
2. Verify all environment variables are set
3. Test backend health endpoint
4. Check database connection
5. Review Render documentation: https://render.com/docs

---

## ✅ Deployment Checklist

### Backend
- [ ] Repository pushed to GitHub/GitLab
- [ ] Render service created
- [ ] Environment variables set
- [ ] Build command configured
- [ ] Start command configured
- [ ] Database migrations run successfully
- [ ] Health endpoint responding

### Frontend
- [ ] Repository connected
- [ ] Build command configured
- [ ] `VITE_API_URL` set to backend URL
- [ ] Build completes successfully
- [ ] Frontend accessible

---

## 🎯 Example Render Configuration

### Backend Service
```
Name: bitport-backend
Type: Web Service
Region: Oregon
Branch: main
Root Directory: backend
Build Command: npm install && npx prisma generate && npx prisma migrate deploy
Start Command: npm start
```

### Frontend Service
```
Name: bitport-frontend
Type: Static Site
Branch: main
Build Command: npm install && npm run build
Publish Directory: dist
```

---

**Your app should now be live on Render! 🎉**



