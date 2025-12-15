const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initDatabase } = require("./config/database");
const suggestionRoutes = require("./routes/suggestionRoutes");

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

app.use("/suggestions", suggestionRoutes);

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
