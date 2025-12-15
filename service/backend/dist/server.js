// ==========================================
// BUNDLE AUTONOME - 2025-12-04T20:15:02.652Z
// ==========================================
// 
// Pour utiliser ce fichier ailleurs:
// 1. Copie ce fichier server.js
// 2. Copie le fichier .env
// 3. Installe les dépendances: npm install express cors mysql2 dotenv
// 4. Lance: node server.js
//
// ==========================================

// ===== DATABASE CONFIG =====
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




// ===== SUGGESTION MODEL =====


class Suggestion {
  // Récupérer toutes les suggestions
  static async getAll() {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM suggestions ORDER BY date DESC"
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer une suggestion par ID
  static async getById(id) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM suggestions WHERE id = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Créer une nouvelle suggestion
  static async create(data) {
    try {
      const { title, description, category, status } = data;
      const [result] = await pool.query(
        "INSERT INTO suggestions (title, description, category, status) VALUES (?, ?, ?, ?)",
        [title, description || "", category || "", status || "pending"]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour une suggestion
  static async update(id, data) {
    try {
      const { title, description, category, status, nbLikes } = data;
      const [result] = await pool.query(
        "UPDATE suggestions SET title = ?, description = ?, category = ?, status = ?, nbLikes = ? WHERE id = ?",
        [title, description, category, status, nbLikes, id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Supprimer une suggestion
  static async delete(id) {
    try {
      const [result] = await pool.query(
        "DELETE FROM suggestions WHERE id = ?",
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Incrémenter les likes
  static async incrementLikes(id) {
    try {
      const [result] = await pool.query(
        "UPDATE suggestions SET nbLikes = nbLikes + 1 WHERE id = ?",
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Rechercher par catégorie
  static async findByCategory(category) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM suggestions WHERE category = ? ORDER BY date DESC",
        [category]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Rechercher par statut
  static async findByStatus(status) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM suggestions WHERE status = ? ORDER BY date DESC",
        [status]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}




// ===== CONTROLLERS =====


// GET toutes les suggestions
const getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.getAll();
    res.json({
      success: true,
      count: suggestions.length,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// GET une suggestion par ID
const getSuggestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const suggestion = await Suggestion.getById(id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        error: "Suggestion non trouvée",
      });
    }

    res.json({
      success: true,
      suggestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// POST créer une suggestion
const createSuggestion = async (req, res) => {
  try {
    const { title, description, category, status } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: "Le titre est requis",
      });
    }

    const insertId = await Suggestion.create({
      title,
      description,
      category,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Suggestion créée avec succès",
      id: insertId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// PUT mettre à jour une suggestion
const updateSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, status, nbLikes } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: "Le titre est requis",
      });
    }

    const affectedRows = await Suggestion.update(id, {
      title,
      description,
      category,
      status,
      nbLikes,
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Suggestion non trouvée",
      });
    }

    res.json({
      success: true,
      message: "Suggestion mise à jour avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// DELETE supprimer une suggestion
const deleteSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Suggestion.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Suggestion non trouvée",
      });
    }

    res.json({
      success: true,
      message: "Suggestion supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// POST incrémenter les likes
const likeSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Suggestion.incrementLikes(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Suggestion non trouvée",
      });
    }

    res.json({
      success: true,
      message: "Like ajouté avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// GET suggestions par catégorie
const getSuggestionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const suggestions = await Suggestion.findByCategory(category);

    res.json({
      success: true,
      count: suggestions.length,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// GET suggestions par statut
const getSuggestionsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const suggestions = await Suggestion.findByStatus(status);

    res.json({
      success: true,
      count: suggestions.length,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// ===== APPLICATION =====
const express = require("express");
const cors = require("cors");
require("dotenv").config();



const app = express();
const PORT = process.env.PORT || 3000;

// Initialisation de la base de données
initDatabase();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log des requêtes (optionnel)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
/*app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Suggestions avec MySQL - Bienvenue!",
    version: "1.0.0",
    endpoints: {
      suggestions: "/api/suggestions",
      suggestionById: "/api/suggestions/:id",
      byCategory: "/api/suggestions/category/:category",
      byStatus: "/api/suggestions/status/:status",
      like: "/api/suggestions/:id/like",
    },
  });
});*/


// ===== ROUTES INTÉGRÉES =====
const router = express.Router();
router.get('/', getAllSuggestions);
router.get('/:id', getSuggestionById);
router.post('/', createSuggestion);
router.put('/:id', updateSuggestion);
router.delete('/:id', deleteSuggestion);
router.post('/:id/like', likeSuggestion);
router.get('/category/:category', getSuggestionsByCategory);
router.get('/status/:status', getSuggestionsByStatus);
app.use('/suggestions', router);


// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route non trouvée",
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Erreur serveur interne",
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}/suggestions`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || "development"}`);
  console.log(`🗄️  Base de données: MySQL`);
});

module.exports = app;

