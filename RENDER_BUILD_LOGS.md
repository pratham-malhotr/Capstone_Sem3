# Render Build Logs - Complete Reference

## 🔧 Backend Build Process

### Step-by-Step Build Logs

#### 1. Repository Clone
```
==> Cloning from https://github.com/yourusername/bitport.git
==> Checking out commit abc123def456...
✓ Repository cloned successfully
```

#### 2. Installing Dependencies
```
==> Installing dependencies
npm WARN deprecated some-package@1.0.0
added 240 packages, and audited 240 packages in 15s

32 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

#### 3. Generating Prisma Client
```
==> Generating Prisma Client
Loaded Prisma config from prisma.config.ts.
Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (v7.1.0) to ./node_modules/@prisma/client in 34ms
```

#### 4. Running Database Migrations
```
==> Running database migrations
Loaded Prisma config from prisma.config.ts.
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-gentle-sun-ah0u00x4-pooler.c-3.us-east-1.aws.neon.tech"

Applying migration `20251207144729_add_watchlist_and_alerts`
The following migration(s) have been created and applied from new schema changes:

Your database is now in sync with your schema.
```

#### 5. Starting Server
```
==> Starting service
BitPort backend running on port 4000
Database connected via Prisma
✓ Service is live at https://bitport-backend.onrender.com
```

---

## 🎨 Frontend Build Process

### Step-by-Step Build Logs

#### 1. Repository Clone
```
==> Cloning from https://github.com/yourusername/bitport.git
==> Checking out commit abc123def456...
✓ Repository cloned successfully
```

#### 2. Installing Dependencies
```
==> Installing dependencies
added 150 packages, and audited 150 packages in 12s

found 0 vulnerabilities
```

#### 3. Building for Production
```
==> Building for production
vite v7.0.4 building for production...
transforming (150) node_modules/react
transforming (150) node_modules/react-dom
transforming (150) node_modules/react-router-dom
✓ 150 modules transformed.

dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-abc123.js       245.67 kB │ gzip: 78.23 kB
dist/assets/index-def456.css      12.34 kB │ gzip:  3.45 kB
dist/assets/react-xyz789.svg       1.23 kB

✓ built in 3.45s
```

#### 4. Deploying Static Files
```
==> Publishing static files
✓ Published 4 files to CDN
✓ Site is live at https://bitport-frontend.onrender.com
```

---

## ⚠️ Common Build Errors & Solutions

### Backend Build Errors

#### Error: DATABASE_URL not found
```
Error: Environment variable not found: DATABASE_URL
  at getConfig (prisma/config.ts:12:5)
```

**Solution:**
1. Go to Render Dashboard → Your Service → Environment
2. Add `DATABASE_URL` with your Neon connection string
3. Redeploy the service

---

#### Error: Prisma Client not generated
```
Error: Cannot find module '@prisma/client'
```

**Solution:**
Ensure build command includes `npx prisma generate`:
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

---

#### Error: Migration failed
```
Error: P1001: Can't reach database server
```

**Solution:**
1. Check `DATABASE_URL` is correct
2. Verify Neon database is active
3. Ensure connection string includes `?sslmode=require`
4. Check network connectivity

---

#### Error: Port already in use
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution:**
Your code should use `process.env.PORT || 4000` (already correct in your code)

---

### Frontend Build Errors

#### Error: VITE_API_URL is undefined
```
Error: Failed to fetch from undefined/api/auth/login
```

**Solution:**
1. Add `VITE_API_URL` environment variable in Render
2. Must start with `VITE_` prefix
3. Rebuild after adding

---

#### Error: Module not found
```
Error: Cannot find module 'react-router-dom'
```

**Solution:**
1. Ensure all dependencies are in `package.json`
2. Run `npm install` locally to verify
3. Check for typos in package names

---

#### Error: Build timeout
```
Error: Build exceeded maximum time limit
```

**Solution:**
1. Upgrade to paid plan for longer build times
2. Optimize build process
3. Remove unnecessary dependencies

---

## ✅ Successful Build Indicators

### Backend Success Indicators
- ✅ `✔ Generated Prisma Client` appears in logs
- ✅ `Your database is now in sync with your schema` appears
- ✅ `Database connected via Prisma` appears
- ✅ `BitPort backend running on port 4000` appears
- ✅ Service shows "Live" status in dashboard
- ✅ Health endpoint returns `{ "ok": true }`

### Frontend Success Indicators
- ✅ `✓ built in X seconds` appears
- ✅ `dist/` folder contains built files
- ✅ Site shows "Live" status in dashboard
- ✅ Frontend loads without console errors
- ✅ API calls work correctly

---

## 📊 Build Time Estimates

### Backend (Free Plan)
- **Dependencies**: ~15-30 seconds
- **Prisma Generate**: ~5-10 seconds
- **Migrations**: ~5-15 seconds
- **Total**: ~25-55 seconds

### Frontend (Free Plan)
- **Dependencies**: ~10-20 seconds
- **Build**: ~5-15 seconds
- **Total**: ~15-35 seconds

---

## 🔍 Debugging Build Issues

### View Detailed Logs
1. Go to Render Dashboard
2. Click on your service
3. Click "Logs" tab
4. Scroll to see full build output

### Test Locally First
```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm start

# Frontend
npm install
npm run build
npm run preview
```

### Common Issues Checklist
- [ ] All environment variables set?
- [ ] Database accessible?
- [ ] Dependencies in package.json?
- [ ] Build commands correct?
- [ ] Node.js version compatible?
- [ ] No syntax errors in code?

---

## 🚀 Deployment Commands Summary

### Backend
```bash
# Build Command
cd backend && npm install && npx prisma generate && npx prisma migrate deploy

# Start Command
cd backend && npm start
```

### Frontend
```bash
# Build Command
npm install && npm run build

# Start Command (if Web Service)
npm run preview

# OR use Static Site with Publish Directory: dist
```

---

## 📝 Environment Variables Checklist

### Backend Required
- [ ] `NODE_ENV=production`
- [ ] `PORT=4000`
- [ ] `DATABASE_URL` (Neon PostgreSQL connection string)
- [ ] `JWT_SECRET` (strong random string, 32+ characters)

### Backend Optional
- [ ] `COINGECKO_BASE=https://api.coingecko.com/api/v3`

### Frontend Required
- [ ] `VITE_API_URL` (your backend URL, e.g., `https://bitport-backend.onrender.com`)

---

## 🎯 Quick Test After Deployment

### Test Backend
```bash
# Health check
curl https://bitport-backend.onrender.com/api/health

# Should return: { "ok": true }
```

### Test Frontend
1. Open `https://bitport-frontend.onrender.com`
2. Check browser console for errors
3. Try logging in
4. Verify API calls work

---

**For detailed deployment instructions, see `RENDER_DEPLOYMENT.md`**



