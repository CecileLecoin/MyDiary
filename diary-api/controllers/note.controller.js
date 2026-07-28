const db = require("../config/db");

const STOP_WORDS = new Set([
  'alors', 'au', 'aucun', 'aussi', 'autre', 'aux', 'avec', 'avoir', 'bon',
  'car', 'ce', 'cela', 'ces', 'ceux', 'chaque', 'ci', 'comme', 'comment',
  'dans', 'des', 'du', 'dedans', 'dehors', 'depuis', 'devrait', 'doit',
  'donc', 'dos', 'droite', 'debut', 'elle', 'elles', 'en', 'encore', 'essai',
  'est', 'et', 'eu', 'fait', 'faites', 'fois', 'font', 'gauche', 'haut',
  'hors', 'ici', 'il', 'ils', 'je', 'juste', 'la', 'le', 'les', 'leur',
  'là', 'ma', 'maintenant', 'mais', 'mes', 'mine', 'moins', 'mon', 'mot',
  'meme', 'ni', 'nommes', 'notre', 'nous', 'nouveaux', 'ou', 'où', 'par',
  'parce', 'parole', 'pas', 'personnes', 'peut', 'peu', 'piece', 'plupart',
  'pour', 'pourquoi', 'quand', 'que', 'quel', 'quelle', 'quelles', 'quels',
  'qui', 'sa', 'sans', 'ses', 'seulement', 'si', 'sien', 'son', 'sont',
  'sous', 'soyez', 'sujet', 'sur', 'ta', 'tandis', 'tellement', 'tels',
  'tes', 'ton', 'tous', 'tout', 'trop', 'tres', 'tu', 'voient', 'vont',
  'votre', 'vous', 'vu', 'ca', 'cet', 'cette', 'etait', 'etaient', 'etre',
  'à', 'de', 'd\'', 'dans', 'par', 'pour', 'en', 'vers', 'avec', 'sans', 'sous', 'sur',
  'entre', 'chez', 'avant', 'après', 'derrière', 'devant', 'durant', 'pendant',
  'contre', 'parmi', 'depuis', 'jusque', 'jusqu\'', 'malgré', 'selon',
  'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car',
  'que', 'quand', 'comme', 'si', 'puisque', 'lorsque',
  'quoique', 'tandis', 'cependant', 'néanmoins',
  'je', 'j\'', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles',
  'me', 'm\'', 'te', 't\'', 'se', 's\'', 'lui', 'leur', 'eux', 'y', 'en', 'le', 'la', 'les', 'l\'', 'un', 'une', 'des', 'du', 'de', 'd\'', 'ce', 'cet', 'cette', 'ces',
  'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'notre', 'nos', 'votre', 'vos',
  'leur', 'leurs', 'moi', 'toi', 'lui', 'elle', 'nous', 'vous', 'eux', 'elles',
  'qui', 'que', 'quoi', 'dont', 'où', 'lequel', 'laquelle', 'lesquels', 'lesquelles',
  'être', 'est', 'suis', 'es', 'sommes', 'êtes', 'sont',
  'étais', 'était', 'étions', 'étaient',
  'avoir', 'ai', 'as', 'a', 'avons', 'avez', 'ont',
  'avais', 'avait', 'avaient',
  'faire', 'fait', 'fais',
  'aller', 'vais', 'va', 'vont',
  'pouvoir', 'peut', 'peuvent',
  'devoir', 'doit', 'doivent',
  'non', 'oui', 'si', 'mais', 'ou', 'donc', 'or', 'ni', 'car',
  // in english
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'when', 'where', 'why', 'how', 'what', 'which', 'who', 'whom', 'whose',
  'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'having',
  'do', 'does', 'did', 'doing',
  'in', 'on', 'at', 'by', 'for', 'with', 'from', 'of',
  'to', 'into', 'onto', 'over', 'under', 'between',
  'among', 'through', 'during', 'before', 'after',
  'against', 'without', 'within', 'about',
  'and', 'or', 'but', 'nor', 'so', 'yet',
  'because', 'since', 'although', 'though',
  'while', 'whereas', 'if', 'unless',
  'when', 'whenever', 'where', 'wherever',
  'that', 'which', 'who', 'whom', 'whose',
  'this', 'these', 'those', 'such',
  'i', 'me', 'my', 'mine',
  'you', 'your', 'yours',
  'he', 'him', 'his',
  'she', 'her', 'hers',
  'it', 'its',
  'we', 'us', 'our', 'ours',
  'they', 'them', 'their', 'theirs',
  'can', 'could', 'may', 'might',
  'must', 'shall', 'should',
  'will', 'would'

]);

function extractWords(text) {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return normalized
    .split(/[^a-z0-9]+/)
    .filter((word) => (
      word.length >= 3 && !STOP_WORDS.has(word)
    ));
}

function getTopWords(rows) {
  const counts = new Map();

  rows.forEach((row) => {
    const content = `${row.titre || ''} ${row.texte || ''}`;
    const words = extractWords(content);

    words.forEach((word) => {
      counts.set(word, (counts.get(word) || 0) + 1);
    });
  });

  return Array
    .from(counts.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }

      return a[0].localeCompare(b[0]);
    })
    .slice(0, 3)
    .map(([word, count]) => ({ word, count }));
}

function toMySqlDateTime(input) {
  const parsed = new Date(input);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Format dateEtHeure invalide');
  }

  const pad = (value) => String(value).padStart(2, '0');

  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())} ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(parsed.getSeconds())}`;
}

exports.getAll = async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim();
    const like = `%${q}%`;

    const [rows] = await db.query(
      `
      SELECT *
      FROM Note
      WHERE (? = '' OR titre LIKE ? OR texte LIKE ?)
      ORDER BY dateEtHeure DESC
      `,
      [q, like, like]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      dateEtHeure,
      titre,
      texte,
      Id_BlocNote
    } = req.body;

    const normalizedDate = toMySqlDateTime(dateEtHeure);

    await db.query(
      `
      INSERT INTO Note
      (dateEtHeure,titre,texte,Id_BlocNote)
      VALUES (?,?,?,?)
      `,
      [
        normalizedDate,
        titre,
        texte,
        Id_BlocNote
      ]
    );

    res.status(201).json({
      message: "Note créée"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {
      dateEtHeure,
      titre,
      texte
    } = req.body;

    const normalizedDate = toMySqlDateTime(dateEtHeure);

    await db.query(
      `
      UPDATE Note
      SET texte=?
      WHERE dateEtHeure=? AND titre=?
      `,
      [texte, normalizedDate, titre]
    );

    res.json({
      message: "Note mise à jour"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const {
      dateEtHeure,
      titre
    } = req.body;

    const normalizedDate = toMySqlDateTime(dateEtHeure);

    await db.query(
      `
      DELETE FROM Note
      WHERE dateEtHeure=? AND titre=?
      `,
      [normalizedDate, titre]
    );

    res.json({
      message: "Note supprimée"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWordStats = async (req, res) => {
  try {
    const [weeklyRows] = await db.query(
      `
      SELECT titre, texte
      FROM Note
      WHERE dateEtHeure >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      `
    );

    const [allRows] = await db.query(
      `
      SELECT titre, texte
      FROM Note
      `
    );

    res.json({
      weeklyTop: getTopWords(weeklyRows),
      allTimeTop: getTopWords(allRows)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};