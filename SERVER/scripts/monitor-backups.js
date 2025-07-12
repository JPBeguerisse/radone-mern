const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Configuration
const LOG_DIR = path.join(__dirname, "../logs");
const BACKUP_DIR = path.join(__dirname, "../backups");
const ALERT_FILE = path.join(LOG_DIR, "backup-alerts.log");

// Créer le dossier de logs s'il n'existe pas
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Fonction pour écrire une alerte
function writeAlert(message) {
  const timestamp = new Date().toISOString();
  const alertMessage = `[${timestamp}] 🚨 ${message}\n`;

  fs.appendFileSync(ALERT_FILE, alertMessage);
  console.log(alertMessage.trim());
}

// Fonction pour vérifier les logs de sauvegarde
function checkBackupLogs() {
  const logFiles = [
    "backup-production.log",
    "backup-weekly-production.log",
    "gdrive-backup.log",
    "health-check.log",
  ];

  console.log("📋 Vérification des logs de sauvegarde...");

  logFiles.forEach((logFile) => {
    const logPath = path.join(LOG_DIR, logFile);

    if (fs.existsSync(logPath)) {
      const stats = fs.statSync(logPath);
      const lastModified = new Date(stats.mtime);
      const hoursSinceModified =
        (Date.now() - lastModified.getTime()) / (1000 * 60 * 60);

      console.log(`   ${logFile}: ${hoursSinceModified.toFixed(1)}h`);

      // Vérifier le contenu du log pour les erreurs
      const logContent = fs.readFileSync(logPath, "utf8");
      const lines = logContent.split("\n");
      const recentLines = lines.slice(-20); // 20 dernières lignes

      const hasErrors = recentLines.some(
        (line) =>
          line.includes("❌") ||
          line.includes("ERROR") ||
          line.includes("Failed") ||
          line.includes("timeout")
      );

      if (hasErrors) {
        writeAlert(`Erreurs détectées dans ${logFile}`);
      }

      // Vérifier si le log est récent (moins de 24h)
      if (hoursSinceModified > 24) {
        writeAlert(
          `Log ${logFile} non mis à jour depuis ${hoursSinceModified.toFixed(
            1
          )}h`
        );
      }
    } else {
      writeAlert(`Fichier de log manquant: ${logFile}`);
    }
  });
}

// Fonction pour vérifier les sauvegardes locales
function checkLocalBackups() {
  console.log("📦 Vérification des sauvegardes locales...");

  if (!fs.existsSync(BACKUP_DIR)) {
    writeAlert("Dossier de sauvegarde manquant");
    return;
  }

  const backups = fs
    .readdirSync(BACKUP_DIR)
    .filter((file) => file.startsWith("backup-"))
    .sort()
    .reverse();

  if (backups.length === 0) {
    writeAlert("Aucune sauvegarde locale trouvée");
    return;
  }

  const latestBackup = backups[0];
  const backupPath = path.join(BACKUP_DIR, latestBackup);
  const stats = fs.statSync(backupPath);
  const daysSinceBackup =
    (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

  console.log(
    `   Dernière sauvegarde: ${latestBackup} (${daysSinceBackup.toFixed(
      1
    )} jours)`
  );

  if (daysSinceBackup > 2) {
    writeAlert(
      `Dernière sauvegarde locale trop ancienne: ${daysSinceBackup.toFixed(
        1
      )} jours`
    );
  }

  // Vérifier la taille de la sauvegarde
  const backupSize = fs.statSync(backupPath).size;
  const backupSizeMB = backupSize / (1024 * 1024);

  console.log(`   Taille: ${backupSizeMB.toFixed(2)} MB`);

  if (backupSizeMB < 0.1) {
    writeAlert(`Sauvegarde locale trop petite: ${backupSizeMB.toFixed(2)} MB`);
  }
}

// Fonction pour vérifier les sauvegardes sur Google Drive
function checkGoogleDriveBackups() {
  console.log("☁️  Vérification des sauvegardes Google Drive...");

  return new Promise((resolve) => {
    exec("rclone lsd googledrive:SauvegardesMongo", (error, stdout, stderr) => {
      if (error) {
        writeAlert(`Erreur accès Google Drive: ${error.message}`);
        resolve();
        return;
      }

      const lines = stdout.trim().split("\n");
      const backupLines = lines.filter((line) => line.includes("backup-"));

      if (backupLines.length === 0) {
        writeAlert("Aucune sauvegarde trouvée sur Google Drive");
        resolve();
        return;
      }

      console.log(`   ${backupLines.length} sauvegardes sur Google Drive`);

      // Vérifier la dernière sauvegarde
      const latestLine = backupLines[0];
      const match = latestLine.match(
        /backup-(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})/
      );

      if (match) {
        const backupDate = new Date(
          match[1].replace(/-/g, ":").replace("T", " ")
        );
        const daysSinceBackup =
          (Date.now() - backupDate.getTime()) / (1000 * 60 * 60 * 24);

        console.log(
          `   Dernière sauvegarde: ${match[1]} (${daysSinceBackup.toFixed(
            1
          )} jours)`
        );

        if (daysSinceBackup > 3) {
          writeAlert(
            `Dernière sauvegarde Google Drive trop ancienne: ${daysSinceBackup.toFixed(
              1
            )} jours`
          );
        }
      }

      resolve();
    });
  });
}

// Fonction pour générer un rapport
function generateReport() {
  const timestamp = new Date().toISOString();
  const reportFile = path.join(
    LOG_DIR,
    `backup-report-${timestamp.split("T")[0]}.txt`
  );

  console.log("📊 Génération du rapport...");

  let report = `=== RAPPORT DE SAUVEGARDE - ${timestamp} ===\n\n`;

  // Ajouter les alertes récentes
  if (fs.existsSync(ALERT_FILE)) {
    const alerts = fs.readFileSync(ALERT_FILE, "utf8");
    const recentAlerts = alerts.split("\n").slice(-10); // 10 dernières alertes
    report += "🚨 ALERTES RÉCENTES:\n";
    recentAlerts.forEach((alert) => {
      if (alert.trim()) report += `${alert}\n`;
    });
    report += "\n";
  }

  // Ajouter les statistiques
  const backups = fs
    .readdirSync(BACKUP_DIR)
    .filter((file) => file.startsWith("backup-")).length;

  report += `📊 STATISTIQUES:\n`;
  report += `   Sauvegardes locales: ${backups}\n`;
  report += `   Espace disque: ${
    (fs.statfsSync(BACKUP_DIR).bavail * fs.statfsSync(BACKUP_DIR).bsize) /
    (1024 * 1024 * 1024)
  } GB libre\n`;

  fs.writeFileSync(reportFile, report);
  console.log(`   Rapport généré: ${reportFile}`);
}

// Fonction principale
async function monitorBackups() {
  console.log("🔍 Début du monitoring des sauvegardes...");

  checkBackupLogs();
  checkLocalBackups();
  await checkGoogleDriveBackups();
  generateReport();

  console.log("✅ Monitoring terminé");
}

// Exécuter le monitoring
monitorBackups().catch((error) => {
  console.error("❌ Erreur lors du monitoring:", error);
  writeAlert(`Erreur monitoring: ${error.message}`);
  process.exit(1);
});
