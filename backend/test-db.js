// Quick database connection test
const pool = require('./db');
require('dotenv').config();

async function testConnection() {
  console.log('Testing database connection...');
  console.log('DB Config:', {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_DATABASE || 'bitport_db',
    hasPassword: !!process.env.DB_PASSWORD
  });
  console.log('');

  try {
    // Test basic connection
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    console.log('');

    // Check if database exists
    try {
      const [dbCheck] = await pool.query('SELECT DATABASE() as current_db');
      console.log('✅ Current database:', dbCheck[0].current_db);
    } catch (err) {
      console.log('⚠️  Database check failed:', err.message);
    }

    // Check if users table exists
    try {
      const [tables] = await pool.query('SHOW TABLES LIKE "users"');
      if (tables.length > 0) {
        console.log('✅ Users table exists');
        
        // Check table structure
        const [columns] = await pool.query('DESCRIBE users');
        console.log('   Columns:', columns.map(c => c.Field).join(', '));
      } else {
        console.log('❌ Users table does NOT exist');
        console.log('   Run: mysql -u root -p < schema.sql');
      }
    } catch (err) {
      console.log('❌ Error checking users table:', err.message);
      console.log('   This usually means the database or table doesn\'t exist');
      console.log('   Run: mysql -u root -p < schema.sql');
    }

    // Check if history table exists
    try {
      const [tables] = await pool.query('SHOW TABLES LIKE "history"');
      if (tables.length > 0) {
        console.log('✅ History table exists');
      } else {
        console.log('❌ History table does NOT exist');
      }
    } catch (err) {
      console.log('❌ Error checking history table:', err.message);
    }

  } catch (err) {
    console.log('❌ Database connection FAILED!');
    console.log('Error:', err.message);
    console.log('Error code:', err.code);
    console.log('');
    
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Solution: Check your MySQL password in .env file');
      console.log('   Update DB_PASSWORD in backend/.env');
    } else if (err.code === 'ECONNREFUSED') {
      console.log('💡 Solution: MySQL server is not running');
      console.log('   Start MySQL: brew services start mysql (macOS)');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Solution: Database does not exist');
      console.log('   Run: mysql -u root -p < schema.sql');
    } else if (err.code === 'ER_NO_SUCH_TABLE') {
      console.log('💡 Solution: Tables do not exist');
      console.log('   Run: mysql -u root -p < schema.sql');
    }
  }

  process.exit(0);
}

testConnection();

