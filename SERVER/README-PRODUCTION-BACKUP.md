# 🚀 Automatisation des Sauvegardes en Production

Ce guide explique comment configurer et maintenir un système de sauvegarde automatique robuste pour votre application en production.

## 📋 Prérequis

- Serveur Linux/Unix avec accès root ou sudo
- Node.js installé
- rclone configuré avec Google Drive
- Fichier `.env.production` configuré avec l'URL MongoDB Atlas

## 🔧 Installation

### 1. Configuration initiale

```bash
# Rendre les scripts exécutables
chmod +x scripts/*.sh

# Configurer l'automatisation en production
NODE_ENV=production npm run backup:setup-prod
```

### 2. Vérifier la configuration

```bash
# Tester la connexion MongoDB Atlas
NODE_ENV=production npm run health-check:prod

# Tester une sauvegarde complète
NODE_ENV=production npm run backup:full
```

## 📅 Planification des Tâches

### Tâches automatiques configurées :

| Tâche | Fréquence | Heure | Description |
|-------|-----------|-------|-------------|
| Sauvegarde complète | Quotidienne | 2h00 | Sauvegarde locale + Google Drive |
| Sauvegarde hebdomadaire | Dimanche | 3h00 | Sauvegarde complète supplémentaire |
| Nettoyage | Samedi | 4h00 | Suppression des anciennes sauvegardes |
| Vérification santé | Quotidienne | 6h00 | Monitoring de la base et des sauvegardes |

## 🛠️ Commandes Disponibles

### Sauvegardes
```bash
# Sauvegarde locale uniquement
NODE_ENV=production npm run backup:prod

# Sauvegarde complète (locale + Google Drive)
NODE_ENV=production npm run backup:full

# Envoi vers Google Drive uniquement
npm run backup:gdrive

# Lister les sauvegardes
NODE_ENV=production npm run backup:list

# Restaurer une sauvegarde
NODE_ENV=production npm run backup:restore <nom-sauvegarde>
```

### Monitoring
```bash
# Vérification de santé
NODE_ENV=production npm run health-check:prod

# Monitoring complet des sauvegardes
npm run monitor
```

### Configuration
```bash
# Configurer l'automatisation
npm run backup:setup-prod

# Voir les tâches cron
crontab -l

# Supprimer toutes les tâches cron
crontab -r
```

## 📊 Monitoring et Alertes

### Logs disponibles

| Fichier | Description |
|---------|-------------|
| `logs/backup-production.log` | Sauvegardes quotidiennes |
| `logs/backup-weekly-production.log` | Sauvegardes hebdomadaires |
| `logs/gdrive-backup.log` | Envoi vers Google Drive |
| `logs/health-check.log` | Vérifications de santé |
| `logs/backup-alerts.log` | Alertes et erreurs |
| `logs/cleanup-production.log` | Nettoyage automatique |

### Vérification des logs

```bash
# Voir les dernières sauvegardes
tail -f logs/backup-production.log

# Voir les alertes
tail -f logs/backup-alerts.log

# Voir les erreurs
grep "❌" logs/backup-production.log
```

## 🚨 Gestion des Erreurs

### Problèmes courants et solutions

#### 1. Connexion MongoDB échouée
```bash
# Vérifier l'URL MongoDB
echo $MONGO_URL

# Tester la connexion
NODE_ENV=production npm run health-check:prod
```

#### 2. Sauvegarde Google Drive échouée
```bash
# Vérifier la configuration rclone
rclone config show

# Tester la connexion Google Drive
rclone lsd googledrive:
```

#### 3. Espace disque insuffisant
```bash
# Vérifier l'espace disque
df -h

# Nettoyer les anciennes sauvegardes
find backups -name "backup-*" -type d -mtime +7 -exec rm -rf {} \;
```

## 🔄 Récupération en cas de problème

### Restaurer depuis Google Drive

```bash
# Lister les sauvegardes disponibles
rclone lsd googledrive:SauvegardesMongo

# Télécharger une sauvegarde
rclone copy googledrive:SauvegardesMongo/backup-YYYY-MM-DD-HH-MM-SS ./backups/

# Restaurer
NODE_ENV=production npm run backup:restore backup-YYYY-MM-DD-HH-MM-SS
```

### Restaurer depuis une sauvegarde locale

```bash
# Lister les sauvegardes locales
ls -la backups/

# Restaurer
NODE_ENV=production npm run backup:restore backup-YYYY-MM-DD-HH-MM-SS
```

## 📈 Maintenance

### Tâches de maintenance recommandées

#### Quotidiennes
- Vérifier les logs de sauvegarde
- Surveiller l'espace disque
- Vérifier les alertes

#### Hebdomadaires
- Tester la restauration d'une sauvegarde
- Vérifier l'intégrité des sauvegardes Google Drive
- Analyser les rapports de monitoring

#### Mensuelles
- Réviser la rétention des sauvegardes
- Mettre à jour rclone si nécessaire
- Vérifier les permissions des dossiers

## 🔒 Sécurité

### Bonnes pratiques

1. **Permissions** : Limiter l'accès aux dossiers de sauvegarde
2. **Chiffrement** : Considérer le chiffrement des sauvegardes sensibles
3. **Monitoring** : Surveiller les accès aux sauvegardes
4. **Tests** : Tester régulièrement les restaurations
5. **Documentation** : Maintenir à jour les procédures

### Permissions recommandées

```bash
# Dossiers de sauvegarde
chmod 750 backups/
chmod 750 logs/

# Scripts
chmod 700 scripts/*.sh
chmod 700 scripts/*.js
```

## 📞 Support

### En cas de problème

1. Vérifier les logs dans `logs/`
2. Exécuter `npm run monitor` pour un diagnostic
3. Tester manuellement les commandes de sauvegarde
4. Vérifier la configuration rclone et MongoDB

### Contacts d'urgence

- **Développeur principal** : [Votre contact]
- **Administrateur système** : [Contact admin]
- **Documentation** : Ce fichier README

---

**⚠️ Important** : Ce système de sauvegarde est critique pour la sécurité de vos données. Testez régulièrement les restaurations et surveillez les logs pour détecter les problèmes rapidement. 