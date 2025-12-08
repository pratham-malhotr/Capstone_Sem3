-- BitPort Database Schema

CREATE DATABASE IF NOT EXISTS bitport_db;
USE bitport_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT '',
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Swap history table
CREATE TABLE IF NOT EXISTS history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  from_symbol VARCHAR(10) NOT NULL,
  to_symbol VARCHAR(10) NOT NULL,
  amount_from DECIMAL(20, 8) NOT NULL,
  amount_to DECIMAL(20, 8) NOT NULL,
  price_usd DECIMAL(20, 8) NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_symbols (from_symbol, to_symbol)
);

