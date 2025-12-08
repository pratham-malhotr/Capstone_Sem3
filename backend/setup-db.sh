#!/bin/bash

# BitPort Database Setup Script
echo "=== BitPort Database Setup ==="
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

echo "This script will help you set up the BitPort database."
echo ""
read -p "Enter MySQL root password (press Enter if no password): " MYSQL_PASSWORD

if [ -z "$MYSQL_PASSWORD" ]; then
    MYSQL_CMD="mysql -u root"
else
    MYSQL_CMD="mysql -u root -p$MYSQL_PASSWORD"
fi

echo ""
echo "Creating database and tables..."

# Run the schema
$MYSQL_CMD < schema.sql 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "You can now start the backend server with: npm start"
else
    echo "❌ Database setup failed. Please check your MySQL credentials."
    echo ""
    echo "You can also manually run: mysql -u root -p < schema.sql"
fi

