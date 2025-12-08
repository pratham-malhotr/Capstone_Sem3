# Render Deployment - Quick Reference

## 🚀 Backend Build Commands

```bash
# Build Command (in Render Dashboard)
cd backend && npm install && npx prisma generate && npx prisma migrate deploy

# Start Command
cd backend && npm start
```

## 🎨 Frontend Build Commands

```bash
# Build Command (in Render Dashboard)
npm install && npm run build

# Start Command (if using Web Service)
npm run preview

# OR use Static Site with Publish Directory: dist
```

---

## 🔐 Environment Variables

### Backend (Set in Render Dashboard)

| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `PORT` | `4000` | `4000` |
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | Strong random string (32+ chars) | Generate with: `openssl rand -base64 32` |
| `COINGECKO_BASE` | CoinGecko API URL | `https://api.coingecko.com/api/v3` |

### Frontend (Set in Render Dashboard)

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | Your backend URL | `https://bitport-backend.onrender.com` |

---

## 📋 Expected Build Logs

### Backend Build Logs (Success)

```
==> Cloning from https://github.com/yourusername/bitport.git
==> Checking out commit abc123...
==> Installing dependencies
npm WARN deprecated ...
added 240 packages in 15s
==> Generating Prisma Client
✔ Generated Prisma Client (v7.1.0) to ./node_modules/@prisma/client
==> Running migrations
Loaded Prisma config from prisma.config.ts
Datasource "db": PostgreSQL database "neondb"
Applying migration `20251207144729_add_watchlist_and_alerts`
Your database is now in sync with your schema.
==> Starting service
BitPort backend running on port 4000
Database connected via Prisma
```

### Frontend Build Logs (Success)

```
==> Cloning from https://github.com/yourusername/bitport.git
==> Installing dependencies
added 150 packages in 12s
==> Building for production
vite v7.0.4 building for production...
✓ 150 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-abc123.js       245.67 kB
dist/assets/index-def456.css      12.34 kB
✓ built in 3.45s
==> Build successful
```

---

## ⚠️ Common Build Errors & Solutions

### Backend Errors

**Error: `DATABASE_URL` is not set**
```
Solution: Add DATABASE_URL environment variable in Render dashboard
```

**Error: Prisma migration failed**
```
Solution: 
1. Check DATABASE_URL is correct
2. Ensure database is accessible
3. Try: npx prisma migrate deploy
```

**Error: Cannot find module '@prisma/client'**
```
Solution: Ensure build command includes: npx prisma generate
```

**Error: Port 4000 already in use**
```
Solution: Render sets PORT automatically, code should use: process.env.PORT || 4000
```

### Frontend Errors

**Error: `VITE_API_URL` is undefined**
```
Solution: 
1. Add VITE_API_URL environment variable
2. Must start with VITE_ prefix
3. Rebuild after adding
```

**Error: Failed to fetch from API**
```
Solution:
1. Check VITE_API_URL is correct (include https://)
2. Verify backend is running
3. Check CORS settings in backend
```

**Error: Build failed - Module not found**
```
Solution:
1. Ensure all dependencies are in package.json
2. Check for TypeScript errors
3. Verify Node.js version compatibility
```

---

## 🔍 Health Check

### Test Backend Health
```bash
curl https://bitport-backend.onrender.com/api/health
```

Expected response:
```json
{ "ok": true }
```

### Test Backend Root
```bash
curl https://bitport-backend.onrender.com/
```

Expected response:
```json
{
  "message": "BitPort API Server",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

---

## 📝 Render Dashboard Settings

### Backend Service Settings

```
Name: bitport-backend
Type: Web Service
Region: Oregon (or closest to you)
Branch: main
Root Directory: backend
Build Command: npm install && npx prisma generate && npx prisma migrate deploy
Start Command: npm start
Plan: Free
Auto-Deploy: Yes
```

### Frontend Service Settings

**Option 1: Static Site (Recommended)**
```
Name: bitport-frontend
Type: Static Site
Branch: main
Build Command: npm install && npm run build
Publish Directory: dist
```

**Option 2: Web Service**
```
Name: bitport-frontend
Type: Web Service
Branch: main
Build Command: npm install && npm run build
Start Command: npm run preview
```

---

## 🔄 Deployment Workflow

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Render auto-deploys** (if enabled)
   - Builds backend
   - Runs migrations
   - Starts services

3. **Check logs** in Render dashboard
   - Verify build success
   - Check for errors

4. **Test endpoints**
   - Backend: `https://bitport-backend.onrender.com/api/health`
   - Frontend: `https://bitport-frontend.onrender.com`

---

## 🎯 Quick Checklist

- [ ] Backend service created
- [ ] Frontend service created
- [ ] All environment variables set
- [ ] Build commands configured
- [ ] Database migrations successful
- [ ] Health endpoint responding
- [ ] Frontend can connect to backend
- [ ] CORS configured correctly

---

## 📞 Need Help?

1. Check Render logs in dashboard
2. Verify environment variables
3. Test health endpoint
4. Review full guide: `RENDER_DEPLOYMENT.md`



