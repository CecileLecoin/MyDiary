const db = require("../config/db");

/*
 * ===== MOOD =====
 */

// Recuperer toutes les humeurs
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
      message: "Humeur creee"
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
      message: "Humeur supprimee"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
 * ===== EMOTIONS SOUS-JACENTES =====
 */

// Obtenir toutes les associations humeur -> emotion
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

// Obtenir les emotions associees a une humeur
exports.getEmotionsByMood = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        e.emotion,
        CASE
          WHEN esj.humeur IS NULL THEN 0
          ELSE 1
        END AS selected
      FROM emotions e
      LEFT JOIN emotions_sous_jacentes esj
        ON esj.emotion = e.emotion
        AND esj.humeur = ?
      ORDER BY e.emotion
    `, [req.params.humeur]);

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Moyenne de l'humeur sur les 7 derniers jours
exports.getWeeklyMoodAverages = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        DATE(dateEtHeure) AS day,
        AVG(CASE humeur
          WHEN 'Horrible' THEN 0
          WHEN 'Mauvais' THEN 10
          WHEN 'Mouais' THEN 20
          WHEN 'Bien' THEN 30
          WHEN 'Super' THEN 40
          ELSE 0
        END) AS averageScore
      FROM humeur_du_jour
      WHERE dateEtHeure >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(dateEtHeure)
      ORDER BY DATE(dateEtHeure) ASC
    `);

    const result = [];
    const today = new Date();

    const pad = (value) => String(value).padStart(2, '0');
    const normalizeDay = (value) => {
      if (value instanceof Date) {
        return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
      }

      const text = String(value || '').trim();
      if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
        return text.slice(0, 10);
      }

      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
      }

      return text;
    };

    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - offset);
      const key = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      const row = rows.find((item) => normalizeDay(item.day) === key);

      result.push({
        day: key,
        label: new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(date),
        value: row ? Number(Number(row.averageScore || 0).toFixed(1)) : 0
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Statistiques hebdomadaires des humeurs et emotions cliquees
exports.getWeeklyStats = async (req, res) => {
  try {
    const moodOrder = ['Horrible', 'Mauvais', 'Mouais', 'Bien', 'Super'];

    const [moodRows] = await db.query(`
      SELECT
        m.humeur,
        COUNT(h.id) AS clickCount
      FROM Mood m
      LEFT JOIN humeur_du_jour h
        ON h.humeur = m.humeur
        AND h.dateEtHeure >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY m.humeur
    `);

    const [emotionRows] = await db.query(`
      SELECT
        emotion,
        COUNT(*) AS clickCount
      FROM emotion_click_log
      WHERE dateEtHeure >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY emotion
      ORDER BY clickCount DESC, emotion ASC
      LIMIT 3
    `);

    const moodCounts = moodRows
      .map((item) => ({
        humeur: item.humeur,
        count: Number(item.clickCount || 0)
      }))
      .sort((a, b) => moodOrder.indexOf(a.humeur) - moodOrder.indexOf(b.humeur));

    const topEmotions = emotionRows.map((item) => ({
      emotion: item.emotion,
      count: Number(item.clickCount || 0)
    }));

    res.json({
      moodCounts,
      topEmotions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Enregistrer une humeur a un instant donne
exports.saveDailyMood = async (req, res) => {
  try {
    const { humeur, dateEtHeure } = req.body;
    const timestamp = dateEtHeure ? new Date(dateEtHeure) : new Date();

    await db.query(`
      INSERT INTO humeur_du_jour
      (dateEtHeure, humeur)
      VALUES (?, ?)
    `, [timestamp, humeur]);

    res.status(201).json({
      message: 'Humeur enregistree'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ajouter une emotion a une humeur
exports.addEmotionToMood = async (req, res) => {

  try {

    const { humeur, emotion } = req.body;

    await db.query(`
      INSERT IGNORE INTO emotions_sous_jacentes
      (humeur, emotion)
      VALUES (?, ?)
    `, [humeur, emotion]);

    await db.query(`
      INSERT INTO emotion_click_log
      (dateEtHeure, humeur, emotion)
      VALUES (NOW(), ?, ?)
    `, [humeur, emotion]);

    res.status(201).json({
      message: "Association creee"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une association humeur -> emotion
exports.deleteEmotionFromMood = async (req, res) => {

  try {

    const { humeur, emotion } = req.params;

    await db.query(`
      DELETE FROM emotions_sous_jacentes
      WHERE humeur = ? AND emotion = ?
    `, [humeur, emotion]);

    res.json({
      message: "Association supprimee"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
