# BitPort Backend Setup Guide

## Prisma + Neon Database Setup

This project uses Prisma ORM with Neon (PostgreSQL) for the database.

### Step 1: Set Up Neon Database

1. Go to [https://neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string (it will look like: `postgresql://user:password@host/database?sslmode=require`)

### Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Neon database connection string:
```env
PORT=4000
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
JWT_SECRET=bitport_super_secret_jwt_key_change_in_production
COINGECKO_BASE=https://api.coingecko.com/api/v3
```

**Important**: 
- Replace the `DATABASE_URL` with your actual Neon connection string
- Change `JWT_SECRET` to a secure random string in production

### Step 3: Install Dependencies

```bash
cd backend
npm install
```

This will automatically run `prisma generate` after installation (via postinstall script).

### Step 4: Run Database Migrations

```bash
npm run prisma:migrate
```

This will:
- Create the database tables (users and history)
- Set up all relationships and indexes
- Create a migration file for version control

### Step 5: Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply migrations (development)
- `npm run prisma:deploy` - Apply migrations (production)
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Database Schema

The database includes two main tables:

- **users**: User accounts with email, password (hashed), and name
- **history**: Swap transaction history linked to users

## Common Error Messages and Solutions

### "Database connection failed"
- **Solution**: 
  1. Check your `DATABASE_URL` in `.env` file
  2. Verify the connection string from Neon dashboard
  3. Make sure SSL mode is enabled (`?sslmode=require`)

### "JWT_SECRET is not set"
- **Solution**: Make sure `JWT_SECRET` is in your `.env` file

### "P1001: Can't reach database server"
- **Solution**: 
  1. Check your internet connection
  2. Verify the Neon database is active (check Neon dashboard)
  3. Ensure the connection string is correct

### "P2002: Unique constraint failed"
- **Solution**: This means you're trying to create a user with an email that already exists

## Quick Test

After setup, test the database connection:

```bash
npm run prisma:studio
```

This opens a web interface where you can view and edit your database.

## Production Deployment

For production:

1. Set up a production Neon database
2. Update `DATABASE_URL` with production connection string
3. Set a strong `JWT_SECRET`
4. Run migrations: `npm run prisma:deploy`
5. Start the server: `npm start`
