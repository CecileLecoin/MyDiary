const express = require("express");
const cors = require("cors");
require("dotenv").config();

const blocnoteRoutes = require("./routes/bloc_note.route");
const noteRoutes = require("./routes/note.route");
const moodRoutes = require("./routes/mood.route");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/blocnotes", blocnoteRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/moods", moodRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});