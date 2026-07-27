const db = require("../config/db");

/*
 * ===== MOOD =====
 */

// Récupérer toutes les humeurs
exports.getAllMoods = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM Mood"
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ajouter une humeur
exports.createMood = async (req, res) => {
  try {
    const { humeur } = req.body;

    await db.query(
      "INSERT INTO Mood(humeur) VALUES (?)",
      [humeur]
    );

    res.status(201).json({
      message: "Humeur créée"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une humeur
exports.deleteMood = async (req, res) => {
  try {

    await db.query(
      "DELETE FROM Mood WHERE humeur = ?",
      [req.params.humeur]
    );

    res.json({
      message: "Humeur supprimée"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
 * ===== EMOTIONS SOUS-JACENTES =====
 */

// Obtenir toutes les associations humeur -> émotion
exports.getAllEmotionsSousJacentes = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT humeur, emotion
      FROM emotions_sous_jacentes
    `);

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir les émotions associées à une humeur
exports.getEmotionsByMood = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT emotion
      FROM emotions_sous_jacentes
      WHERE humeur = ?
    `, [req.params.humeur]);

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ajouter une émotion à une humeur
exports.addEmotionToMood = async (req, res) => {

  try {

    const { humeur, emotion } = req.body;

    await db.query(`
      INSERT INTO emotions_sous_jacentes
      (humeur, emotion)
      VALUES (?, ?)
    `, [humeur, emotion]);

    res.status(201).json({
      message: "Association créée"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une association humeur -> émotion
exports.deleteEmotionFromMood = async (req, res) => {

  try {

    const { humeur, emotion } = req.params;

    await db.query(`
      DELETE FROM emotions_sous_jacentes
      WHERE humeur = ? AND emotion = ?
    `, [humeur, emotion]);

    res.json({
      message: "Association supprimée"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};