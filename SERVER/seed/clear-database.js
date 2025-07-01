const mongoose = require("mongoose");
const UserModel = require("../models/user.model");
const PostModel = require("../models/post.model");
require("dotenv").config();

console.log("🗑️  Nettoyage de la base de données...");

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "social-network",
  })
  .then(async () => {
    console.log("✅ Connexion à MongoDB réussie");

    // Supprimer tous les posts
    const deletedPosts = await PostModel.deleteMany({});
    console.log(`🗑️  ${deletedPosts.deletedCount} posts supprimés`);

    // Supprimer tous les utilisateurs
    const deletedUsers = await UserModel.deleteMany({});
    console.log(`🗑️  ${deletedUsers.deletedCount} utilisateurs supprimés`);

    console.log("✅ Base de données nettoyée !");
  })
  .catch((error) => {
    console.error("❌ Erreur:", error.message);
  })
  .finally(() => {
    mongoose.disconnect();
    console.log("🔌 Déconnexion de MongoDB");
  });
