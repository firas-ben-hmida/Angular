const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestionController');

// Routes CRUD principales
router.get('/', suggestionController.getAllSuggestions);
router.get('/:id', suggestionController.getSuggestionById);
router.post('/', suggestionController.createSuggestion);
router.put('/:id', suggestionController.updateSuggestion);
router.delete('/:id', suggestionController.deleteSuggestion);

// Route pour les likes
router.post('/:id/like', suggestionController.likeSuggestion);

// Routes de filtrage
router.get('/category/:category', suggestionController.getSuggestionsByCategory);
router.get('/status/:status', suggestionController.getSuggestionsByStatus);

module.exports = router;
