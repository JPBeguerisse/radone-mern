#!/bin/bash

# Script pour configurer les sauvegardes automatiques en PRODUCTION
# Usage: ./setup-production-backup.sh

# Chemin vers le projet
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.."

echo "🚀 Configuration des sauvegardes automatiques PRODUCTION..."

# Vérifier que nous sommes en production
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  Attention: NODE_ENV n'est pas défini comme 'production'"
    echo "   Utilisez: NODE_ENV=production ./setup-production-backup.sh"
    read -p "   Continuer quand même ? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Créer les dossiers nécessaires
mkdir -p "$PROJECT_DIR/logs"
mkdir -p "$PROJECT_DIR/backups"

echo "📁 Dossiers créés: logs/, backups/"

# Créer la tâche cron pour sauvegarde complète quotidienne à 2h du matin
(crontab -l 2>/dev/null; echo "0 2 * * * cd $PROJECT_DIR && NODE_ENV=production npm run backup:full >> logs/backup-production.log 2>&1") | crontab -

# Créer la tâche cron pour sauvegarde hebdomadaire le dimanche à 3h du matin
(crontab -l 2>/dev/null; echo "0 3 * * 0 cd $PROJECT_DIR && NODE_ENV=production npm run backup:full >> logs/backup-weekly-production.log 2>&1") | crontab -

# Créer la tâche cron pour nettoyage des anciennes sauvegardes locales le samedi à 4h
(crontab -l 2>/dev/null; echo "0 4 * * 6 cd $PROJECT_DIR && find backups -name 'backup-*' -type d -mtime +7 -exec rm -rf {} \; >> logs/cleanup-production.log 2>&1") | crontab -

# Créer la tâche cron pour vérification de santé quotidienne à 6h
(crontab -l 2>/dev/null; echo "0 6 * * * cd $PROJECT_DIR && NODE_ENV=production node scripts/health-check.js >> logs/health-check.log 2>&1") | crontab -

echo "✅ Tâches cron PRODUCTION configurées:"
echo "   - Sauvegarde complète quotidienne: 2h00 du matin"
echo "   - Sauvegarde complète hebdomadaire: Dimanche 3h00 du matin"
echo "   - Nettoyage des anciennes sauvegardes: Samedi 4h00 du matin"
echo "   - Vérification de santé: 6h00 du matin"
echo ""
echo "📋 Pour voir les tâches cron actuelles:"
echo "   crontab -l"
echo ""
echo "🗑️  Pour supprimer les tâches cron:"
echo "   crontab -r"
echo ""
echo "📊 Logs de production:"
echo "   - logs/backup-production.log (sauvegardes quotidiennes)"
echo "   - logs/backup-weekly-production.log (sauvegardes hebdomadaires)"
echo "   - logs/cleanup-production.log (nettoyage)"
echo "   - logs/gdrive-backup.log (envoi vers Google Drive)"
echo "   - logs/health-check.log (vérifications de santé)"
echo ""
echo "🔧 Pour tester immédiatement:"
echo "   NODE_ENV=production npm run backup:full" 