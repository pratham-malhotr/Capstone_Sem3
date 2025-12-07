# Quick Fix for Server Error When Creating Account

## The Problem
You're getting a "Server error" because MySQL requires a password, but the `.env` file has an empty password.

## Quick Solution (Choose One)

### Option 1: Automated Fix (Easiest)

```bash
cd bitport/backend
./fix-db-setup.sh
```

This script will:
1. Ask for your MySQL root password
2. Create the database and tables
3. Update your `.env` file automatically

### Option 2: Manual Fix

**Step 1: Update the .env file**

Edit `bitport/backend/.env` and add your MySQL password:

```env
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE  ← Add your password here
DB_DATABASE=bitport_db
JWT_SECRET=bitport_super_secret_jwt_key_change_in_production
COINGECKO_BASE=https://api.coingecko.com/api/v3
```

**Step 2: Create the database**

```bash
cd bitport/backend
mysql -u root -p < schema.sql
```

(Enter your MySQL password when prompted)

**Step 3: Restart the backend server**

```bash
# Kill the current server (if running)
ps aux | grep "node index.js" | grep -v grep | awk '{print $2}' | xargs kill

# Start it again
cd bitport/backend
npm start
```

### Option 3: If You Don't Have a MySQL Password

If your MySQL root user doesn't have a password, you can:

1. Set a password for MySQL root:
```bash
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
FLUSH PRIVILEGES;
```

2. Then update `.env` with that password

OR

1. Create a new MySQL user without password:
```bash
mysql -u root
CREATE USER 'bitport_user'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON bitport_db.* TO 'bitport_user'@'localhost';
FLUSH PRIVILEGES;
```

2. Update `.env`:
```env
DB_USER=bitport_user
DB_PASSWORD=
```

## Test the Fix

After fixing, test the database connection:

```bash
cd bitport/backend
node test-db.js
```

You should see:
- ✅ Database connection successful!
- ✅ Users table exists
- ✅ History table exists

## Still Not Working?

1. **Check MySQL is running:**
   ```bash
   brew services list | grep mysql  # macOS
   # Or
   ps aux | grep mysql
   ```

2. **Start MySQL if needed:**
   ```bash
   brew services start mysql  # macOS
   ```

3. **Test MySQL connection directly:**
   ```bash
   mysql -u root -p
   ```

If you can't connect to MySQL, you may need to install or configure MySQL first.

