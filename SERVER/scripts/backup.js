const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Déterminer quel fichier .env utiliser
const NODE_ENV = process.env.NODE_ENV || "development";
const envFile =
  NODE_ENV === "production" ? ".env.production" : ".env.development";
const envPath = path.join(__dirname, "..", envFile);

console.log(`🌍 Environnement: ${NODE_ENV}`);
console.log(`📁 Fichier .env utilisé: ${envFile}`);

// Charger les variables d'environnement
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
} else {
  console.error(`❌ Fichier .env non trouvé: ${envPath}`);
  process.exit(1);
}

// Configuration
const BACKUP_DIR = path.join(__dirname, "../backups");
const DB_NAME = "social-network";
let MONGO_URL = process.env.MONGO_URL;

// Vérification de la configuration
if (!MONGO_URL) {
  console.error(
    `❌ Erreur: MONGO_URL n'est pas définie dans le fichier ${envFile}`
  );
  console.log(`📝 Assurez-vous que votre fichier SERVER/${envFile} contient:`);
  console.log(
    "   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/social-network"
  );
  process.exit(1);
}

// Adapter l'URL pour les sauvegardes locales (remplacer 'mongo' par 'localhost' si nécessaire)
if (MONGO_URL.includes("mongo:27017") && !process.env.DOCKER_BACKUP) {
  MONGO_URL = MONGO_URL.replace("mongo:27017", "localhost:27017");
  console.log("🔄 URL adaptée pour sauvegarde locale (localhost)");
}

console.log(
  "🔗 URL MongoDB détectée:",
  MONGO_URL.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")
);

// Créer le dossier de sauvegarde s'il n'existe pas
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Fonction pour créer un nom de fichier avec timestamp
function getBackupFileName() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-").split("T")[0];
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-");
  return `backup-${timestamp}-${time}`;
}

// Fonction de sauvegarde
async function createBackup() {
  const backupName = getBackupFileName();
  const backupPath = path.join(BACKUP_DIR, backupName);

  console.log(`🔄 Début de la sauvegarde: ${backupName}`);

  // Commande mongodump pour MongoDB Atlas
  const command = `mongodump --uri="${MONGO_URL}" --db=${DB_NAME} --out="${backupPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Erreur lors de la sauvegarde: ${error.message}`);
      return;
    }

    if (stderr) {
      console.log(`⚠️  Avertissements: ${stderr}`);
    }

    console.log(`✅ Sauvegarde terminée: ${backupPath}`);

    // Nettoyer les anciennes sauvegardes (garder les 7 derniers jours)
    cleanupOldBackups();
  });
}

// Fonction pour nettoyer les anciennes sauvegardes
function cleanupOldBackups() {
  const MAX_DAYS = 7;
  const now = new Date();

  fs.readdir(BACKUP_DIR, (err, files) => {
    if (err) {
      console.error(`❌ Erreur lors de la lecture du dossier: ${err.message}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      const daysDiff = (now - stats.mtime) / (1000 * 60 * 60 * 24);

      if (daysDiff > MAX_DAYS) {
        fs.rmSync(filePath, { recursive: true, force: true });
        console.log(`🗑️  Ancienne sauvegarde supprimée: ${file}`);
      }
    });
  });
}

// Fonction pour restaurer une sauvegarde
function restoreBackup(backupName) {
  const backupPath = path.join(BACKUP_DIR, backupName);

  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Sauvegarde non trouvée: ${backupName}`);
    return;
  }

  console.log(`🔄 Restauration de la sauvegarde: ${backupName}`);

  const command = `mongorestore --uri="${MONGO_URL}" --db=${DB_NAME} --drop "${backupPath}/${DB_NAME}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Erreur lors de la restauration: ${error.message}`);
      return;
    }

    if (stderr) {
      console.log(`⚠️  Avertissements: ${stderr}`);
    }

    console.log(`✅ Restauration terminée`);
  });
}

// Fonction pour lister les sauvegardes disponibles
function listBackups() {
  fs.readdir(BACKUP_DIR, (err, files) => {
    if (err) {
      console.error(`❌ Erreur lors de la lecture du dossier: ${err.message}`);
      return;
    }

    console.log("📋 Sauvegardes disponibles:");
    files.forEach((file) => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      console.log(`  - ${file} (${stats.mtime.toLocaleString()})`);
    });
  });
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);
const action = args[0];

switch (action) {
  case "backup":
    createBackup();
    break;
  case "restore":
    const backupName = args[1];
    if (!backupName) {
      console.error(
        "❌ Veuillez spécifier le nom de la sauvegarde à restaurer"
      );
      console.log("Usage: node backup.js restore <nom-sauvegarde>");
      process.exit(1);
    }
    restoreBackup(backupName);
    break;
  case "list":
    listBackups();
    break;
  default:
    console.log("📖 Usage:");
    console.log("  node backup.js backup          - Créer une sauvegarde");
    console.log("  node backup.js restore <nom>   - Restaurer une sauvegarde");
    console.log("  node backup.js list            - Lister les sauvegardes");
    break;
}
