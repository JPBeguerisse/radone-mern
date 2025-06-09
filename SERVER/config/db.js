const mongoose = require("mongoose");

// URL de connexion à MongoDB depuis le fichier .env
const mongoUrl = process.env.MONGO_URL;

// Connexion à MongoDB avec promesse
mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) =>
    console.error("Erreur de connexion à MongoDB :", error.message)
  );
