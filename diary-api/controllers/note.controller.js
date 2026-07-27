const db = require("../config/db");

exports.getAll = async (req, res) => {
  const [rows] = await db.query(`
    SELECT *
    FROM Note
  `);

  res.json(rows);
};

exports.create = async (req, res) => {
  const {
    dateEtHeure,
    titre,
    texte,
    Id_BlocNote
  } = req.body;

  await db.query(
    `
    INSERT INTO Note
    (dateEtHeure,titre,texte,Id_BlocNote)
    VALUES (?,?,?,?)
    `,
    [
      dateEtHeure,
      titre,
      texte,
      Id_BlocNote
    ]
  );

  res.status(201).json({
    message: "Note créée"
  });
};

exports.update = async (req, res) => {
  const {
    dateEtHeure,
    titre,
    texte
  } = req.body;

  await db.query(
    `
    UPDATE Note
    SET texte=?
    WHERE dateEtHeure=? AND titre=?
    `,
    [texte, dateEtHeure, titre]
  );

  res.json({
    message: "Note mise à jour"
  });
};

exports.remove = async (req, res) => {

  const {
    dateEtHeure,
    titre
  } = req.body;

  await db.query(
    `
    DELETE FROM Note
    WHERE dateEtHeure=? AND titre=?
    `,
    [dateEtHeure, titre]
  );

  res.json({
    message: "Note supprimée"
  });
};