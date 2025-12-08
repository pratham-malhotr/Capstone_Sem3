#!/bin/bash
echo "=== BitPort Database Setup Fix ==="
echo ""
echo "This script will help you set up your MySQL database."
echo ""
read -p "Enter your MySQL root password: " -s MYSQL_PASSWORD
echo ""

if [ -z "$MYSQL_PASSWORD" ]; then
    echo "⚠️  No password provided. Trying without password..."
    MYSQL_CMD="mysql -u root"
else
    MYSQL_CMD="mysql -u root -p$MYSQL_PASSWORD"
fi

echo ""
echo "Step 1: Creating database and tables..."
$MYSQL_CMD < schema.sql 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully!"
    echo ""
    echo "Step 2: Updating .env file..."
    
    # Update .env file with password
    if [ -f .env ]; then
        if [ -n "$MYSQL_PASSWORD" ]; then
            # Use sed to update DB_PASSWORD, or add it if it doesn't exist
            if grep -q "DB_PASSWORD=" .env; then
                sed -i '' "s/^DB_PASSWORD=.*/DB_PASSWORD=$MYSQL_PASSWORD/" .env
            else
                echo "DB_PASSWORD=$MYSQL_PASSWORD" >> .env
            fi
            echo "✅ Updated .env file with MySQL password"
        fi
    else
        echo "⚠️  .env file not found, creating it..."
        cat > .env << ENVEOF
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=$MYSQL_PASSWORD
DB_DATABASE=bitport_db
JWT_SECRET=bitport_super_secret_jwt_key_change_in_production
COINGECKO_BASE=https://api.coingecko.com/api/v3
ENVEOF
        echo "✅ Created .env file"
    fi
    
    echo ""
    echo "✅ Setup complete! You can now restart your backend server."
    echo "   Run: npm start"
else
    echo "❌ Database setup failed. Please check your MySQL credentials."
    echo ""
    echo "Manual steps:"
    echo "1. Update backend/.env file with your MySQL password:"
    echo "   DB_PASSWORD=your_password_here"
    echo ""
    echo "2. Run the schema manually:"
    echo "   mysql -u root -p < schema.sql"
fi
