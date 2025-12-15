-- Créer la base de données
CREATE DATABASE IF NOT EXISTS suggestions_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE suggestions_db;

-- Créer la table suggestions
CREATE TABLE IF NOT EXISTS suggestions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'en attente',
  nbLikes INT DEFAULT 0,
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
