const mysql = require("mysql2/promise");
require("dotenv").config();

// Créer le pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "suggestions_db",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Promisify pour utiliser async/await
//const promisePool = pool.promise();

// Initialisation de la base de données
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Créer la table si elle n'existe pas
    await connection.query(`
      CREATE TABLE IF NOT EXISTS suggestions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        nbLikes INT DEFAULT 0,
        INDEX idx_status (status),
        INDEX idx_category (category),
        INDEX idx_date (date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    connection.release();
    console.log("✅ Base de données MySQL initialisée");
  } catch (err) {
    console.error("❌ Erreur initialisation base de données:", err.message);
    process.exit(1);
  }
};

// Tester la connexion
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Erreur connexion MySQL:", err.message);
    return;
  }
  console.log("✅ Connecté à MySQL");
  connection.release();
});

module.exports = { pool, initDatabase };
