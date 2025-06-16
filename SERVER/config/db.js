const mongoose = require("mongoose");
require("dotenv").config();
const logger = require("../utils/logger");

// URL de connexion à MongoDB depuis le fichier .env
const mongoUrl = process.env.MONGO_URL;

// Connexion à MongoDB avec promesse
mongoose
  .connect(mongoUrl, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    dbName: "social-network",
  })
  .then(() => console.log("✅ Connexion à MongoDB réussie"))
  .catch((err) => console.log("❌ Erreur MongoDB : %s", err.message));
