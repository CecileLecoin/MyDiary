const express = require("express");
const router = express.Router();

const moodController = require(
  "../controllers/mood.controller"
);

/*
 * ===== MOOD =====
 */

// Toutes les humeurs
router.get(
  "/",
  moodController.getAllMoods
);

// Ajouter une humeur
router.post(
  "/",
  moodController.createMood
);

// Supprimer une humeur
router.delete(
  "/:humeur",
  moodController.deleteMood
);

/*
 * ===== EMOTIONS SOUS-JACENTES =====
 */

// Toutes les associations
router.get(
  "/emotions-sous-jacentes",
  moodController.getAllEmotionsSousJacentes
);

// Moyenne globale de l'humeur sur 7 jours
router.get(
  "/weekly-average",
  moodController.getWeeklyMoodAverages
);

// Statistiques hebdomadaires des humeurs et emotions
router.get(
  "/weekly-stats",
  moodController.getWeeklyStats
);

// Enregistrer l'humeur du jour
router.post(
  "/daily",
  moodController.saveDailyMood
);

// Emotions d'une humeur
router.get(
  "/:humeur/emotions",
  moodController.getEmotionsByMood
);

// Ajouter une association
router.post(
  "/emotions-sous-jacentes",
  moodController.addEmotionToMood
);

// Supprimer une association
router.delete(
  "/emotions-sous-jacentes/:humeur/:emotion",
  moodController.deleteEmotionFromMood
);

module.exports = router;