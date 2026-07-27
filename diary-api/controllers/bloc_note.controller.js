const db = require("../config/db");

exports.getAll = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM BlocNote"
  );

  res.json(rows);
};

exports.getOne = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM BlocNote WHERE Id_BlocNote = ?",
    [req.params.id]
  );

  if (!rows.length)
    return res.status(404).json({
      message: "BlocNote non trouvé"
    });

  res.json(rows[0]);
};

exports.create = async (req, res) => {
  const { jour, lieu } = req.body;

  const [result] = await db.query(
    `INSERT INTO BlocNote(jour, lieu)
     VALUES (?, ?)`,
    [jour, lieu]
  );

  res.status(201).json({
    id: result.insertId,
    jour,
    lieu
  });
};

exports.update = async (req, res) => {
  const { jour, lieu } = req.body;

  await db.query(
    `UPDATE BlocNote
     SET jour=?, lieu=?
     WHERE Id_BlocNote=?`,
    [jour, lieu, req.params.id]
  );

  res.json({
    message: "BlocNote modifié"
  });
};

exports.remove = async (req, res) => {
  await db.query(
    "DELETE FROM BlocNote WHERE Id_BlocNote=?",
    [req.params.id]
  );

  res.json({
    message: "BlocNote supprimé"
  });
};