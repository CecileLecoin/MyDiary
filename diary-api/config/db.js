const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

async function initializeDatabase() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS BlocNote (
      Id_BlocNote INT AUTO_INCREMENT,
      jour DATE,
      lieu VARCHAR(250),
      PRIMARY KEY (Id_BlocNote)
    )`,
    `CREATE TABLE IF NOT EXISTS Note (
      dateEtHeure DATETIME,
      titre VARCHAR(250),
      texte TEXT,
      Id_BlocNote INT NOT NULL,
      PRIMARY KEY (dateEtHeure, titre),
      FOREIGN KEY (Id_BlocNote) REFERENCES BlocNote(Id_BlocNote)
    )`,
    `CREATE TABLE IF NOT EXISTS Img (
      Id_Img INT AUTO_INCREMENT,
      URL VARCHAR(250),
      description TEXT,
      dateEtHeure DATETIME NOT NULL,
      titre VARCHAR(250) NOT NULL,
      PRIMARY KEY (Id_Img),
      FOREIGN KEY (dateEtHeure, titre) REFERENCES Note(dateEtHeure, titre)
    )`,
    `CREATE TABLE IF NOT EXISTS Mood (
      humeur VARCHAR(50),
      PRIMARY KEY (humeur)
    )`,
    `CREATE TABLE IF NOT EXISTS emotions (
      emotion VARCHAR(250),
      PRIMARY KEY (emotion)
    )`,
    `CREATE TABLE IF NOT EXISTS emotions_sous_jacentes (
      humeur VARCHAR(50),
      emotion VARCHAR(250),
      PRIMARY KEY (humeur, emotion),
      FOREIGN KEY (humeur) REFERENCES Mood(humeur),
      FOREIGN KEY (emotion) REFERENCES emotions(emotion)
    )`,
    `CREATE TABLE IF NOT EXISTS humeur_du_jour (
      id INT AUTO_INCREMENT,
      dateEtHeure DATETIME NOT NULL,
      humeur VARCHAR(50) NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (humeur) REFERENCES Mood(humeur)
    )`,
    `CREATE TABLE IF NOT EXISTS emotion_click_log (
      id INT AUTO_INCREMENT,
      dateEtHeure DATETIME NOT NULL,
      humeur VARCHAR(50) NOT NULL,
      emotion VARCHAR(250) NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (humeur) REFERENCES Mood(humeur),
      FOREIGN KEY (emotion) REFERENCES emotions(emotion)
    )`,
    `INSERT IGNORE INTO BlocNote (Id_BlocNote, jour, lieu) VALUES (1, CURDATE(), 'Journal principal')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('Heureuse')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('Triste')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('En colere')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('Instable')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('Sensible')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('Agreable melange')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('Desagreable melange')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('Melange confus')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('irritee/irritable')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('Foncedee')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('OK')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('Satisfaite')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('Detendue')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('Reconnaissante')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('Fatiguee')`,
    `INSERT IGNORE INTO emotions (emotion) VALUES ('Dissociee')`,
    `INSERT IGNORE INTO Mood (humeur) VALUES ('Super')`,
    `INSERT IGNORE INTO Mood (humeur) VALUES ('Bien')`,
    `INSERT IGNORE INTO Mood (humeur) VALUES ('Mouais')`,
    `INSERT IGNORE INTO Mood (humeur) VALUES ('Mauvais')`,
    `INSERT IGNORE INTO Mood (humeur) VALUES ('Horrible')`
  ];

  for (const statement of statements) {
    await pool.query(statement);
  }
}

module.exports = pool;
module.exports.initializeDatabase = initializeDatabase;