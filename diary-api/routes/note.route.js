const express = require("express");
const router = express.Router();

const noteController = require(
  "../controllers/note.controller"
);

// Statistiques des mots
router.get("/word-stats", noteController.getWordStats);

// Récupérer toutes les notes
router.get("/", noteController.getAll);

// Créer une note
router.post("/", noteController.create);

// Modifier une note
router.put("/", noteController.update);

// Supprimer une note
router.delete("/", noteController.remove);

module.exports = router;