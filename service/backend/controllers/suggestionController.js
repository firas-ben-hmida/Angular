const Suggestion = require("../models/suggestion");

// GET toutes les suggestions
exports.getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.getAll();
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// GET une suggestion par ID
exports.getSuggestionById = async (req, res) => {
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
exports.createSuggestion = async (req, res) => {
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
exports.updateSuggestion = async (req, res) => {
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
exports.deleteSuggestion = async (req, res) => {
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
exports.likeSuggestion = async (req, res) => {
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
exports.getSuggestionsByCategory = async (req, res) => {
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
exports.getSuggestionsByStatus = async (req, res) => {
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
