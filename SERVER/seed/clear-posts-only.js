const mongoose = require("mongoose");
const PostModel = require("../models/post.model");
require("dotenv").config();

console.log("🗑️  Suppression des posts seulement...");

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "social-network",
  })
  .then(async () => {
    // console.log("✅ Connexion à MongoDB réussie");

    // Supprimer tous les posts seulement
    const deletedPosts = await PostModel.deleteMany({});
    // console.log(`🗑️  ${deletedPosts.deletedCount} posts supprimés`);
    // console.log("👥 Utilisateurs conservés");

    // console.log("✅ Posts supprimés avec succès !");
  })
  .catch((error) => {
    // console.error("❌ Erreur:", error.message);
  })
  .finally(() => {
    mongoose.disconnect();
    console.log("🔌 Déconnexion de MongoDB");
  });
