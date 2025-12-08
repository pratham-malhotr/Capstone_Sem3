# New CRUD Operations - Watchlist & Price Alerts

## ✅ Created 2 New CRUD Operations

### 1. **Watchlist CRUD** (`/api/watchlist`)
- **CREATE**: POST `/api/watchlist` - Add coin to watchlist
- **READ**: GET `/api/watchlist` - Get all watchlist items (with pagination, filtering, sorting, searching)
- **READ**: GET `/api/watchlist/:id` - Get single watchlist item
- **UPDATE**: PUT `/api/watchlist/:id` - Update watchlist item (coinName, note)
- **DELETE**: DELETE `/api/watchlist/:id` - Remove coin from watchlist

### 2. **Price Alerts CRUD** (`/api/alerts`)
- **CREATE**: POST `/api/alerts` - Create price alert
- **READ**: GET `/api/alerts` - Get all alerts (with pagination, filtering, sorting, searching)
- **READ**: GET `/api/alerts/:id` - Get single alert
- **UPDATE**: PUT `/api/alerts/:id` - Update alert (coinName, targetPrice, condition, isActive)
- **DELETE**: DELETE `/api/alerts/:id` - Delete alert

---

## 🔍 Backend Features (All Implemented)

### Pagination
- Query parameters: `page`, `limit`
- Default: `page=1`, `limit=10`
- Maximum limit: 100 items
- Returns: `{ items: [...], meta: { page, limit, total, totalPages } }`

### Filtering
**Watchlist:**
- `symbol` - Filter by coin symbol
- `dateFrom` - Filter by start date
- `dateTo` - Filter by end date

**Alerts:**
- `symbol` - Filter by coin symbol
- `condition` - Filter by condition (above/below)
- `isActive` - Filter by active status (true/false)
- `dateFrom` - Filter by start date
- `dateTo` - Filter by end date

### Sorting
- Query parameters: `sortBy`, `sortOrder`
- Default: `sortBy=createdAt`, `sortOrder=desc`
- **Watchlist sortBy options**: `createdAt`, `symbol`, `coinName`
- **Alerts sortBy options**: `createdAt`, `symbol`, `coinName`, `targetPrice`, `isActive`, `triggeredAt`
- Sort order: `asc` or `desc`

### Searching
- Query parameter: `search`
- **Watchlist**: Searches in `symbol` and `coinName` fields
- **Alerts**: Searches in `symbol` and `coinName` fields
- Case-insensitive search using Prisma `contains`

---

## 🎨 Frontend Implementation (Simplified - No Frontend Filtering)

### Watchlist Page (`/watchlist`)
- ✅ Display watchlist items in table
- ✅ Add new coin to watchlist (form)
- ✅ Edit note inline
- ✅ Delete watchlist item
- ✅ Pagination controls (Previous/Next)
- ❌ **No frontend filtering** - All filtering handled by backend
- ❌ **No frontend sorting** - All sorting handled by backend
- ❌ **No frontend searching** - All searching handled by backend

### Alerts Page (`/alerts`)
- ✅ Display alerts in table
- ✅ Create new price alert (form)
- ✅ Toggle alert active/inactive status
- ✅ Delete alert
- ✅ Pagination controls (Previous/Next)
- ❌ **No frontend filtering** - All filtering handled by backend
- ❌ **No frontend sorting** - All sorting handled by backend
- ❌ **No frontend searching** - All searching handled by backend

---

## 📊 Database Schema

### Watchlist Table
```prisma
model Watchlist {
  id        Int       @id @default(autoincrement())
  userId    Int       @map("user_id")
  symbol    String
  coinName  String    @map("coin_name")
  note      String?   @db.Text
  createdAt DateTime  @default(now()) @map("created_at")
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, symbol])
  @@index([userId], name: "idx_watchlist_user_id")
  @@index([symbol], name: "idx_watchlist_symbol")
  @@index([createdAt], name: "idx_watchlist_created_at")
  @@map("watchlist")
}
```

### PriceAlerts Table
```prisma
model PriceAlert {
  id          Int       @id @default(autoincrement())
  userId      Int       @map("user_id")
  symbol      String
  coinName    String    @map("coin_name")
  targetPrice Decimal   @map("target_price") @db.Decimal(20, 8)
  condition   String    // "above" or "below"
  isActive    Boolean   @default(true) @map("is_active")
  triggeredAt DateTime? @map("triggered_at")
  createdAt   DateTime  @default(now()) @map("created_at")
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId], name: "idx_alert_user_id")
  @@index([symbol], name: "idx_alert_symbol")
  @@index([isActive], name: "idx_alert_is_active")
  @@index([createdAt], name: "idx_alert_created_at")
  @@map("price_alerts")
}
```

---

## 🔗 API Endpoints

### Watchlist Endpoints
- `GET /api/watchlist` - List all (with query params for pagination/filtering/sorting/searching)
- `GET /api/watchlist/:id` - Get single item
- `POST /api/watchlist` - Create new item
- `PUT /api/watchlist/:id` - Update item
- `DELETE /api/watchlist/:id` - Delete item

### Alerts Endpoints
- `GET /api/alerts` - List all (with query params for pagination/filtering/sorting/searching)
- `GET /api/alerts/:id` - Get single alert
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

---

## 📝 Example API Usage

### Watchlist - Get with Pagination & Filtering
```
GET /api/watchlist?page=1&limit=10&symbol=BTC&sortBy=createdAt&sortOrder=desc&search=bitcoin
```

### Alerts - Get with Pagination & Filtering
```
GET /api/alerts?page=1&limit=10&isActive=true&condition=above&sortBy=targetPrice&sortOrder=asc
```

---

## ✅ Summary

- ✅ **2 new CRUD operations** created (Watchlist & Price Alerts)
- ✅ **Pagination** implemented in backend
- ✅ **Filtering** implemented in backend
- ✅ **Sorting** implemented in backend
- ✅ **Searching** implemented in backend
- ✅ **Frontend simplified** - Only displays data, no frontend filtering/sorting/searching
- ✅ **Database tables created** via Prisma migration
- ✅ **Routes registered** in backend
- ✅ **Navigation links added** to frontend navbar

All advanced features (pagination, filtering, sorting, searching) are handled entirely by the backend. The frontend simply displays the data and sends query parameters to the backend.

