CREATE SCHEMA diary;

CREATE TABLE BlocNote(
   Id_BlocNote INT AUTO_INCREMENT,
   jour DATE,
   lieu VARCHAR(250),
   PRIMARY KEY(Id_BlocNote)
);

CREATE TABLE Note(
   dateEtHeure DATETIME,
   titre VARCHAR(250),
   texte TEXT,
   Id_BlocNote INT NOT NULL,
   PRIMARY KEY(dateEtHeure, titre),
   FOREIGN KEY(Id_BlocNote) REFERENCES BlocNote(Id_BlocNote)
);

CREATE TABLE Img(
   Id_Img INT AUTO_INCREMENT,
   URL VARCHAR(250),
   description TEXT,
   dateEtHeure DATETIME NOT NULL,
   titre VARCHAR(250) NOT NULL,
   PRIMARY KEY(Id_Img),
   FOREIGN KEY(dateEtHeure, titre) REFERENCES Note(dateEtHeure, titre)
);

CREATE TABLE Mood(
   humeur VARCHAR(50),
   PRIMARY KEY(humeur)
);

CREATE TABLE emotions(
   emotion VARCHAR(250),
   PRIMARY KEY(emotion)
);

CREATE TABLE emotions_sous_jacentes(
   humeur VARCHAR(50),
   emotion VARCHAR(250),
   PRIMARY KEY(humeur, emotion),
   FOREIGN KEY(humeur) REFERENCES Mood(humeur),
   FOREIGN KEY(emotion) REFERENCES emotions(emotion)
);

CREATE TABLE humeur_du_jour(
   dateEtHeure DATETIME,
   titre VARCHAR(250),
   humeur VARCHAR(50),
   PRIMARY KEY(dateEtHeure, titre, humeur),
   FOREIGN KEY(dateEtHeure, titre) REFERENCES Note(dateEtHeure, titre),
   FOREIGN KEY(humeur) REFERENCES Mood(humeur)
);

insert into emotions (emotion) values ('Heureuse');
insert into emotions (emotion) values ('Triste');
insert into emotions (emotion) values ('En colère');
insert into emotions (emotion) values ('Instable');
insert into emotions (emotion) values ('Sensible');
insert into emotions (emotion) values ('Agréable mélange');
insert into emotions (emotion) values ('Désagréable mélange');
insert into emotions (emotion) values ('Mélange confus');
insert into emotions (emotion) values ('irritée/irritable');
insert into emotions (emotion) values ('Foncedée');
insert into emotions (emotion) values ('OK');
insert into emotions (emotion) values ('Satisfaite');
insert into emotions (emotion) values ('Détendue');
insert into emotions (emotion) values ('Reconnaissante');
insert into emotions (emotion) values ('Fatiguée');
insert into emotions (emotion) values ('Dissociée');

insert into mood (humeur) values ("Super");
insert into mood (humeur) values ("Bien");
insert into mood (humeur) values ("Mouais");
insert into mood (humeur) values ("Mauvais");
insert into mood (humeur) values ("Horrible");
