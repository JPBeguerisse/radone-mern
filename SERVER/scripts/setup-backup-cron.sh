#!/bin/bash

# Script pour configurer les sauvegardes automatiques complètes
# Usage: ./setup-backup-cron.sh

# Chemin vers le projet
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.."

echo "🔧 Configuration des sauvegardes automatiques complètes..."

# Créer la tâche cron pour sauvegarde locale + Google Drive quotidienne à 2h du matin
(crontab -l 2>/dev/null; echo "0 2 * * * cd $PROJECT_DIR && npm run backup:full >> logs/backup-full.log 2>&1") | crontab -

# Créer la tâche cron pour sauvegarde hebdomadaire le dimanche à 3h du matin
(crontab -l 2>/dev/null; echo "0 3 * * 0 cd $PROJECT_DIR && npm run backup:full >> logs/backup-weekly.log 2>&1") | crontab -

# Créer la tâche cron pour nettoyage des anciennes sauvegardes locales le samedi à 4h
(crontab -l 2>/dev/null; echo "0 4 * * 6 cd $PROJECT_DIR && find backups -name 'backup-*' -type d -mtime +7 -exec rm -rf {} \; >> logs/cleanup.log 2>&1") | crontab -

echo "✅ Tâches cron configurées:"
echo "   - Sauvegarde complète quotidienne: 2h00 du matin"
echo "   - Sauvegarde complète hebdomadaire: Dimanche 3h00 du matin"
echo "   - Nettoyage des anciennes sauvegardes: Samedi 4h00 du matin"
echo ""
echo "📋 Pour voir les tâches cron actuelles:"
echo "   crontab -l"
echo ""
echo "🗑️  Pour supprimer les tâches cron:"
echo "   crontab -r"
echo ""
echo "📊 Logs disponibles:"
echo "   - logs/backup-full.log (sauvegardes quotidiennes)"
echo "   - logs/backup-weekly.log (sauvegardes hebdomadaires)"
echo "   - logs/cleanup.log (nettoyage)"
echo "   - logs/gdrive-backup.log (envoi vers Google Drive)" 