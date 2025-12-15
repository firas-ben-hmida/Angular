const fs = require("fs");

console.log("🔨 Début du build autonome...");

// Fonction pour nettoyer UNIQUEMENT les require locaux (pas les node_modules)
function cleanCode(code) {
  return (
    code
      // Supprimer uniquement les require avec ../ ou ./ (fichiers locaux)
      .replace(/const\s+{[^}]+}\s*=\s*require\(['"][.\/][^)]+\);?\n?/g, "")
      .replace(/const\s+\w+\s*=\s*require\(['"][.\/][^)]+\);?\n?/g, "")
      // Supprimer tous les module.exports
      .replace(/module\.exports\s*=\s*{[^}]+};?\n?/g, "")
      .replace(/module\.exports\s*=\s*\w+;?\n?/g, "")
      // Nettoyer les exports.fonction
      .replace(/exports\.(\w+)/g, "const $1")
      // Supprimer les lignes vides multiples
      .replace(/\n{3,}/g, "\n\n")
  );
}

// Lire et nettoyer les fichiers
const database = cleanCode(fs.readFileSync("./config/database.js", "utf8"));
const Suggestion = cleanCode(fs.readFileSync("./models/Suggestion.js", "utf8"));
const controller = cleanCode(
  fs.readFileSync("./controllers/suggestionController.js", "utf8")
);
const app = fs.readFileSync("./app.js", "utf8");

// Nettoyer app.js spécifiquement (seulement les require locaux)
const cleanApp = app
  .replace(/const\s+{[^}]+}\s*=\s*require\(['"][.\/][^)]+\);?\n?/g, "")
  .replace(/const\s+\w+Routes\s*=\s*require\(['"][.\/][^)]+\);?\n?/g, "")
  .replace(
    /app\.use\(['"]\/suggestions['"],\s*suggestionRoutes\);?/,
    `
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
`
  );

// Créer le bundle final
const bundle = `// ==========================================
// BUNDLE AUTONOME - ${new Date().toISOString()}
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
${database}

// ===== SUGGESTION MODEL =====
${Suggestion}

// ===== CONTROLLERS =====
${controller}

// ===== APPLICATION =====
${cleanApp}
`;

// Créer le dossier dist s'il n'existe pas
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}

// Écrire le fichier bundle
fs.writeFileSync("dist/server.js", bundle);

// Copier le fichier .env dans dist
if (fs.existsSync(".env")) {
  fs.copyFileSync(".env", "dist/.env");
  console.log("✅ Fichier .env copié dans dist/");
}

// Créer un package.json minimal dans dist
const minimalPackage = {
  name: "suggestions-api-dist",
  version: "1.0.0",
  main: "server.js",
  scripts: {
    start: "node server.js",
  },
  dependencies: {
    express: "^4.18.2",
    cors: "^2.8.5",
    mysql2: "^3.6.5",
    dotenv: "^16.3.1",
  },
};

fs.writeFileSync("dist/package.json", JSON.stringify(minimalPackage, null, 2));

// Créer un README dans dist
const readme = `# Suggestions API - Version Déployable

## Installation

\`\`\`bash
npm install
\`\`\`

## Configuration

Modifie le fichier \`.env\` avec tes paramètres MySQL :

\`\`\`
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
DB_NAME=suggestions_db
PORT=3000
\`\`\`

## Lancement

\`\`\`bash
npm start
\`\`\`

Ou directement :

\`\`\`bash
node server.js
\`\`\`

## Endpoints

- GET    /suggestions
- GET    /suggestions/:id
- POST   /suggestions
- PUT    /suggestions/:id
- DELETE /suggestions/:id
- POST   /suggestions/:id/like
- GET    /suggestions/category/:category
- GET    /suggestions/status/:status
`;

fs.writeFileSync("dist/README.md", readme);

console.log("");
console.log("✅ Build autonome terminé avec succès!");
console.log("");
console.log("📦 Fichiers générés dans dist/ :");
console.log("   ├── server.js      (Code complet)");
console.log("   ├── package.json   (Dépendances)");
console.log("   ├── .env           (Configuration)");
console.log("   └── README.md      (Instructions)");
console.log("");
console.log(
  `📊 Taille du bundle: ${(fs.statSync("dist/server.js").size / 1024).toFixed(
    2
  )} KB`
);
console.log("");
console.log("🚀 Pour déployer ailleurs:");
console.log("   1. Copie tout le dossier dist/ où tu veux");
console.log("   2. cd dist");
console.log("   3. npm install");
console.log("   4. node server.js");
console.log("");
console.log("💡 Ou teste maintenant: cd dist && npm install && npm start");
