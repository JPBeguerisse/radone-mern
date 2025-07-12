#!/bin/bash

# Script de sauvegarde pour environnement Docker
# Usage: ./docker-backup.sh

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_NAME="backup_${TIMESTAMP}"

echo "🐳 Sauvegarde MongoDB depuis Docker..."

# Créer le dossier de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarde depuis le conteneur MongoDB
docker exec SOCIAL_APP_MONGO mongodump --db=social-network --out=/data/backup

# Copier la sauvegarde depuis le conteneur
docker cp SOCIAL_APP_MONGO:/data/backup $BACKUP_DIR/$BACKUP_NAME

# Nettoyer le dossier temporaire dans le conteneur
docker exec SOCIAL_APP_MONGO rm -rf /data/backup

echo "✅ Sauvegarde terminée: $BACKUP_DIR/$BACKUP_NAME"

# Nettoyer les anciennes sauvegardes (garder 7 jours)
find $BACKUP_DIR -name "backup_*" -type d -mtime +7 -exec rm -rf {} \;

echo "🗑️  Anciennes sauvegardes nettoyées" 