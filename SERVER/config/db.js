const mongoose = require("mongoose");

// URL de connexion MongoDB
const mongoUrl = process.env.MONGO_URL;

// Connexion à MongoDB (sans les options obsolètes)
mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.error("Erreur de connexion à MongoDB :", error));
