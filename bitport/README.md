# BitPort - Crypto Swap Platform

A full-stack web application for swapping cryptocurrencies with live market prices. Built with React, Node.js, Express, MySQL, and JWT authentication.

## Features

- 🔐 **User Authentication**: Secure registration and login with JWT tokens
- 💱 **Crypto Swapping**: Swap cryptocurrencies with real-time prices from CoinGecko API
- 📊 **Swap History**: Full CRUD operations on swap history
- 🔍 **Advanced Filtering**: Search, sort, filter, and pagination for swap history
- 👤 **User Profile**: Update profile information and password
- 🎨 **Modern UI**: Beautiful, responsive design with gradient backgrounds

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios
- CSS3 (Gradient designs)

### Backend
- Node.js
- Express.js
- JWT (jsonwebtoken)
- bcryptjs
- MySQL2
- Axios
- CORS

## Project Structure

```
bitport/
├── backend/
│   ├── db.js                 # MySQL connection pool
│   ├── index.js              # Express server setup
│   ├── schema.sql            # Database schema
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── swap.js           # Swap routes
│   │   ├── history.js        # History CRUD routes
│   │   └── profile.js        # Profile routes
│   └── package.json
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation component
│   │   └── ProtectedRoute.jsx # Route protection
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication context
│   ├── pages/
│   │   ├── Home.jsx          # Home page
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Registration page
│   │   ├── Swap.jsx          # Swap page
│   │   ├── History.jsx       # History page
│   │   └── Profile.jsx       # Profile page
│   ├── utils/
│   │   └── api.js            # API utility
│   ├── App.jsx               # Main app component
│   └── main.jsx             # Entry point
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=bitport_db
JWT_SECRET=your_super_secret_jwt_key_here
COINGECKO_BASE=https://api.coingecko.com/api/v3
```

4. Create the database and tables:
```bash
mysql -u root -p < schema.sql
```

5. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to the root directory (or frontend if separated):
```bash
cd bitport
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:4000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port Vite assigns)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Swap
- `GET /api/swap/prices` - Get current cryptocurrency prices
- `POST /api/swap/execute` - Execute a swap (requires auth)

### History
- `GET /api/history` - Get swap history with filters (requires auth)
  - Query params: `page`, `limit`, `search`, `sortBy`, `sortOrder`, `from`, `to`, `dateFrom`, `dateTo`
- `PUT /api/history/:id` - Update swap note (requires auth)
- `DELETE /api/history/:id` - Delete swap (requires auth)

### Profile
- `GET /api/profile` - Get user profile (requires auth)
- `PUT /api/profile` - Update user profile (requires auth)

## Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Navigate to the frontend directory**:
```bash
cd bitport
```

4. **Deploy**:
```bash
vercel
```

5. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`

6. **Redeploy** after adding environment variables:
```bash
vercel --prod
```

**Alternative: Deploy via Vercel Dashboard**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set root directory to `bitport` (or wherever your frontend is)
5. Add environment variable: `VITE_API_URL`
6. Deploy

### Backend Deployment (Render)

1. **Push your code to GitHub**

2. **Go to Render Dashboard**:
   - Visit [render.com](https://render.com)
   - Sign up or log in

3. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

4. **Configure the Service**:
   - **Name**: bitport-backend (or your preferred name)
   - **Root Directory**: `bitport/backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **Set Environment Variables** in Render Dashboard:
   - Go to "Environment" tab
   - Add the following variables:
     ```
     PORT=10000
     DB_HOST=your_mysql_host
     DB_USER=your_mysql_user
     DB_PASSWORD=your_mysql_password
     DB_DATABASE=bitport_db
     JWT_SECRET=your_super_secret_jwt_key_here
     COINGECKO_BASE=https://api.coingecko.com/api/v3
     ```

6. **Create MySQL Database** (if not using external):
   - In Render Dashboard, click "New +" → "PostgreSQL" (or use external MySQL)
   - Or use an external MySQL service like PlanetScale, AWS RDS, etc.
   - Update `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` accordingly

7. **Run Database Schema**:
   - Connect to your MySQL database
   - Run the `schema.sql` file to create tables

8. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - Note the URL (e.g., `https://bitport-backend.onrender.com`)

9. **Update Frontend Environment Variable**:
   - Go back to Vercel
   - Update `VITE_API_URL` to your Render backend URL
   - Redeploy the frontend

### Database Setup on Render

If using Render's PostgreSQL (or external MySQL):

1. **Create Database**:
   - In Render, create a new PostgreSQL database
   - Note the connection details

2. **Update Connection**:
   - Update `backend/db.js` if needed for PostgreSQL
   - Or use the provided MySQL connection for external MySQL services

3. **Run Schema**:
   - Connect using a MySQL client
   - Execute `schema.sql`

## Environment Variables Reference

### Backend (.env)
```
PORT=4000                          # Server port
DB_HOST=localhost                  # MySQL host
DB_USER=root                       # MySQL username
DB_PASSWORD=your_password         # MySQL password
DB_DATABASE=bitport_db             # Database name
JWT_SECRET=your_secret_key         # JWT secret (use a strong random string)
COINGECKO_BASE=https://api.coingecko.com/api/v3  # CoinGecko API base URL
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:4000  # Backend API URL
```

## Development

### Running Locally

1. Start MySQL server
2. Run backend: `cd backend && npm start`
3. Run frontend: `npm run dev`
4. Open browser to `http://localhost:5173`

### Testing

- Register a new account
- Login with credentials
- Navigate to Swap page and execute swaps
- View history with filters and pagination
- Update profile information

## Security Notes

- Never commit `.env` files to version control
- Use strong, random JWT secrets in production
- Use HTTPS in production
- Implement rate limiting for production
- Validate and sanitize all user inputs
- Use environment variables for all sensitive data

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
