# Suggestions API - Version Déployable

## Installation

```bash
npm install
```

## Configuration

Modifie le fichier `.env` avec tes paramètres MySQL :

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
DB_NAME=suggestions_db
PORT=3000
```

## Lancement

```bash
npm start
```

Ou directement :

```bash
node server.js
```

## Endpoints

- GET    /suggestions
- GET    /suggestions/:id
- POST   /suggestions
- PUT    /suggestions/:id
- DELETE /suggestions/:id
- POST   /suggestions/:id/like
- GET    /suggestions/category/:category
- GET    /suggestions/status/:status
