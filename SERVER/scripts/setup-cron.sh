#!/bin/bash

# Script pour configurer les sauvegardes automatiques avec cron
# Usage: ./setup-cron.sh

# Chemin vers le script de sauvegarde
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/backup.js"
PROJECT_DIR="$(dirname "$SCRIPT_PATH")"

echo "🔧 Configuration des sauvegardes automatiques..."

# Créer la tâche cron pour sauvegarde quotidienne à 2h du matin
(crontab -l 2>/dev/null; echo "0 2 * * * cd $PROJECT_DIR && node scripts/backup.js backup >> logs/backup.log 2>&1") | crontab -

# Créer la tâche cron pour sauvegarde hebdomadaire le dimanche à 3h du matin
(crontab -l 2>/dev/null; echo "0 3 * * 0 cd $PROJECT_DIR && node scripts/backup.js backup >> logs/backup-weekly.log 2>&1") | crontab -

echo "✅ Tâches cron configurées:"
echo "   - Sauvegarde quotidienne: 2h00 du matin"
echo "   - Sauvegarde hebdomadaire: Dimanche 3h00 du matin"
echo ""
echo "📋 Pour voir les tâches cron actuelles:"
echo "   crontab -l"
echo ""
echo "🗑️  Pour supprimer les tâches cron:"
echo "   crontab -r" 