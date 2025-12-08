# Prisma + Neon Setup Guide

## Quick Start

1. **Get your Neon database connection string:**
   - Sign up at [https://neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string (format: `postgresql://user:password@host/database?sslmode=require`)

2. **Create `.env` file in the backend directory:**
   ```env
   PORT=4000
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   JWT_SECRET=your_secret_key_here
   COINGECKO_BASE=https://api.coingecko.com/api/v3
   ```

3. **Run migrations to create database tables:**
   ```bash
   npm run prisma:migrate
   ```
   When prompted, name your migration (e.g., "init")

4. **Start the server:**
   ```bash
   npm start
   ```

## Available Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply migrations (development)
- `npm run prisma:deploy` - Apply migrations (production)
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## What Changed

- ✅ Migrated from MySQL to PostgreSQL (Neon)
- ✅ Replaced raw SQL queries with Prisma ORM
- ✅ Updated all routes (auth, swap, history, profile) to use Prisma
- ✅ Added Prisma migrations for database schema management

## Database Schema

- **User**: id, name, email, password, createdAt
- **History**: id, userId, fromSymbol, toSymbol, amountFrom, amountTo, priceUsd, note, createdAt

