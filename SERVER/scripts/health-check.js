const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Charger les variables d'environnement selon l'environnement
const NODE_ENV = process.env.NODE_ENV || "development";
const envFile =
  NODE_ENV === "production" ? ".env.production" : ".env.development";
const envPath = path.join(__dirname, "..", envFile);

console.log(`🏥 Vérification de santé - Environnement: ${NODE_ENV}`);

if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
} else {
  console.error(`❌ Fichier .env non trouvé: ${envPath}`);
  process.exit(1);
}

const MONGO_URL = process.env.MONGO_URL;
const BACKUP_DIR = path.join(__dirname, "../backups");

// Fonction pour vérifier la connexion MongoDB
async function checkMongoConnection() {
  try {
    console.log("🔗 Test de connexion MongoDB...");
    await mongoose.connect(MONGO_URL, {
      dbName: "social-network",
      serverSelectionTimeoutMS: 5000,
    });

    // Vérifier les collections principales
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    console.log(
      `✅ Connexion MongoDB OK - Collections: ${collectionNames.join(", ")}`
    );

    // Vérifier le nombre de documents
    const userCount = await db.collection("users").countDocuments();
    const postCount = await db.collection("posts").countDocuments();

    console.log(
      `📊 Statistiques: ${userCount} utilisateurs, ${postCount} posts`
    );

    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error(`❌ Erreur connexion MongoDB: ${error.message}`);
    return false;
  }
}

// Fonction pour vérifier les sauvegardes
function checkBackups() {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      console.log("⚠️  Dossier de sauvegarde non trouvé");
      return false;
    }

    const backups = fs
      .readdirSync(BACKUP_DIR)
      .filter((file) => file.startsWith("backup-"))
      .sort()
      .reverse();

    if (backups.length === 0) {
      console.log("⚠️  Aucune sauvegarde trouvée");
      return false;
    }

    const latestBackup = backups[0];
    const backupPath = path.join(BACKUP_DIR, latestBackup);
    const stats = fs.statSync(backupPath);
    const daysSinceBackup =
      (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

    console.log(
      `📦 Dernière sauvegarde: ${latestBackup} (${daysSinceBackup.toFixed(
        1
      )} jours)`
    );

    if (daysSinceBackup > 2) {
      console.log("⚠️  Attention: Dernière sauvegarde > 2 jours");
      return false;
    }

    return true;
  } catch (error) {
    console.error(`❌ Erreur vérification sauvegardes: ${error.message}`);
    return false;
  }
}

// Fonction pour vérifier l'espace disque
function checkDiskSpace() {
  try {
    const stats = fs.statfsSync(BACKUP_DIR);
    const freeSpaceGB = (stats.bavail * stats.bsize) / (1024 * 1024 * 1024);

    console.log(`💾 Espace disque libre: ${freeSpaceGB.toFixed(2)} GB`);

    if (freeSpaceGB < 1) {
      console.log("⚠️  Attention: Espace disque faible (< 1 GB)");
      return false;
    }

    return true;
  } catch (error) {
    console.error(`❌ Erreur vérification espace disque: ${error.message}`);
    return false;
  }
}

// Fonction principale
async function healthCheck() {
  console.log("🏥 Début de la vérification de santé...");

  const mongoOK = await checkMongoConnection();
  const backupOK = checkBackups();
  const diskOK = checkDiskSpace();

  const allOK = mongoOK && backupOK && diskOK;

  console.log("");
  console.log("📋 Résumé:");
  console.log(`   MongoDB: ${mongoOK ? "✅" : "❌"}`);
  console.log(`   Sauvegardes: ${backupOK ? "✅" : "❌"}`);
  console.log(`   Espace disque: ${diskOK ? "✅" : "❌"}`);
  console.log(`   Statut global: ${allOK ? "✅ OK" : "❌ PROBLÈME"}`);

  if (!allOK) {
    console.log("");
    console.log("🚨 Actions recommandées:");
    if (!mongoOK) console.log("   - Vérifier la connexion MongoDB");
    if (!backupOK) console.log("   - Lancer une sauvegarde manuelle");
    if (!diskOK) console.log("   - Nettoyer l'espace disque");
  }

  process.exit(allOK ? 0 : 1);
}

// Exécuter la vérification
healthCheck().catch((error) => {
  console.error("❌ Erreur lors de la vérification:", error);
  process.exit(1);
});
