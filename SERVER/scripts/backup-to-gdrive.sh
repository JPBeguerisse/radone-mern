#!/bin/bash

# Script pour envoyer les sauvegardes MongoDB vers Google Drive
# Usage: ./backup-to-gdrive.sh

# Configuration
BACKUP_DIR="$(dirname "$0")/../backups"
REMOTE_NAME="googledrive"
REMOTE_DIR="SauvegardesMongo"
LOG_FILE="$(dirname "$0")/../logs/gdrive-backup.log"

# Créer le dossier de logs s'il n'existe pas
mkdir -p "$(dirname "$LOG_FILE")"

echo "🚀 Début de l'envoi vers Google Drive - $(date)" | tee -a "$LOG_FILE"

# Vérifier si rclone est installé
if ! command -v rclone &> /dev/null; then
    echo "❌ Erreur: rclone n'est pas installé" | tee -a "$LOG_FILE"
    exit 1
fi

# Vérifier si le dossier de sauvegarde existe
if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Erreur: Dossier de sauvegarde non trouvé: $BACKUP_DIR" | tee -a "$LOG_FILE"
    exit 1
fi

# Chercher la dernière sauvegarde
LAST_BACKUP=$(ls -td "$BACKUP_DIR"/backup-* 2>/dev/null | head -1)

if [ -z "$LAST_BACKUP" ]; then
    echo "❌ Erreur: Aucune sauvegarde trouvée dans $BACKUP_DIR" | tee -a "$LOG_FILE"
    exit 1
fi

BACKUP_NAME=$(basename "$LAST_BACKUP")
echo "📦 Sauvegarde à envoyer: $BACKUP_NAME" | tee -a "$LOG_FILE"

# Vérifier si cette sauvegarde existe déjà sur Google Drive
if rclone lsf "$REMOTE_NAME:$REMOTE_DIR/$BACKUP_NAME" &>/dev/null; then
    echo "⚠️  Cette sauvegarde existe déjà sur Google Drive" | tee -a "$LOG_FILE"
    echo "🔄 Mise à jour de la sauvegarde..." | tee -a "$LOG_FILE"
fi

# Envoyer la sauvegarde vers Google Drive
echo "📤 Envoi en cours..." | tee -a "$LOG_FILE"
if rclone copy "$LAST_BACKUP" "$REMOTE_NAME:$REMOTE_DIR/$BACKUP_NAME" --progress 2>&1 | tee -a "$LOG_FILE"; then
    echo "✅ Sauvegarde envoyée avec succès sur Google Drive !" | tee -a "$LOG_FILE"
    
    # Nettoyer les anciennes sauvegardes sur Google Drive (garder les 10 dernières)
    echo "🧹 Nettoyage des anciennes sauvegardes sur Google Drive..." | tee -a "$LOG_FILE"
    rclone lsf "$REMOTE_NAME:$REMOTE_DIR/" | grep "backup-" | sort -r | tail -n +11 | while read -r old_backup; do
        if [ -n "$old_backup" ]; then
            echo "🗑️  Suppression: $old_backup" | tee -a "$LOG_FILE"
            rclone delete "$REMOTE_NAME:$REMOTE_DIR/$old_backup" 2>/dev/null
        fi
    done
else
    echo "❌ Erreur lors de l'envoi vers Google Drive" | tee -a "$LOG_FILE"
    exit 1
fi

echo "🏁 Envoi terminé - $(date)" | tee -a "$LOG_FILE"
echo "---" | tee -a "$LOG_FILE" 