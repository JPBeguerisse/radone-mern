# 🔄 Système de Sauvegarde MongoDB

Ce système permet de créer des sauvegardes automatiques et régulières de votre base de données MongoDB.

## 📋 Prérequis

- MongoDB installé localement ou MongoDB Atlas
- Node.js installé
- Variables d'environnement configurées (MONGO_URL)

## 🚀 Utilisation

### 1. Sauvegarde manuelle

```bash
# Créer une sauvegarde
npm run backup

# Lister les sauvegardes disponibles
npm run backup:list

# Restaurer une sauvegarde
npm run backup:restore <nom-sauvegarde>
```

### 2. Sauvegarde automatique avec cron

```bash
# Rendre le script exécutable
chmod +x scripts/setup-cron.sh

# Configurer les tâches cron automatiques
./scripts/setup-cron.sh
```

**Tâches configurées :**
- Sauvegarde quotidienne : 2h00 du matin
- Sauvegarde hebdomadaire : Dimanche 3h00 du matin

### 3. Sauvegarde avec Docker

```bash
# Rendre le script exécutable
chmod +x scripts/docker-backup.sh

# Exécuter la sauvegarde
./scripts/docker-backup.sh
```

### 4. Service de sauvegarde automatique

```bash
# Démarrer le service de sauvegarde
docker-compose -f docker-compose.backup.yml up -d

# Voir les logs
docker-compose -f docker-compose.backup.yml logs -f backup-service

# Arrêter le service
docker-compose -f docker-compose.backup.yml down
```

## 📁 Structure des sauvegardes

```
SERVER/
├── backups/
│   ├── backup-2024-01-15-14-30-00/
│   │   └── social-network/
│   │       ├── users.bson
│   │       ├── users.metadata.json
│   │       ├── posts.bson
│   │       └── posts.metadata.json
│   └── backup-2024-01-16-02-00-00/
│       └── social-network/
└── scripts/
    ├── backup.js
    ├── setup-cron.sh
    └── docker-backup.sh
```

## ⚙️ Configuration

### Variables d'environnement

Assurez-vous que votre fichier `.env` contient :

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/social-network
```

### Personnalisation

Vous pouvez modifier les paramètres dans `scripts/backup.js` :

```javascript
// Dossier de sauvegarde
const BACKUP_DIR = path.join(__dirname, '../backups');

// Nom de la base de données
const DB_NAME = 'social-network';

// Durée de conservation des sauvegardes (en jours)
const MAX_DAYS = 7;
```

## 🔧 Maintenance

### Nettoyage manuel

```bash
# Supprimer les anciennes sauvegardes
find SERVER/backups -name "backup-*" -type d -mtime +7 -exec rm -rf {} \;
```

### Vérification des logs

```bash
# Logs de sauvegarde quotidienne
tail -f logs/backup.log

# Logs de sauvegarde hebdomadaire
tail -f logs/backup-weekly.log
```

## 🚨 Récupération en cas de problème

### 1. Restaurer une sauvegarde

```bash
# Lister les sauvegardes disponibles
npm run backup:list

# Restaurer la dernière sauvegarde
npm run backup:restore backup-2024-01-15-14-30-00
```

### 2. Vérifier l'intégrité

```bash
# Tester la connexion à la base
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL, {dbName: 'social-network'})
  .then(() => console.log('✅ Connexion OK'))
  .catch(err => console.error('❌ Erreur:', err.message))
  .finally(() => mongoose.disconnect());
"
```

## 📊 Monitoring

### Vérifier l'espace disque

```bash
# Taille des sauvegardes
du -sh SERVER/backups/*

# Espace disque disponible
df -h
```

### Statistiques des sauvegardes

```bash
# Nombre de sauvegardes
ls -1 SERVER/backups/ | wc -l

# Dernière sauvegarde
ls -lt SERVER/backups/ | head -2
```

## 🔒 Sécurité

- Les sauvegardes sont stockées localement
- Nettoyage automatique des anciennes sauvegardes
- Logs détaillés pour audit
- Vérification d'intégrité avant restauration

## 🆘 Dépannage

### Erreur de connexion MongoDB

```bash
# Vérifier l'URL de connexion
echo $MONGO_URL

# Tester la connexion
mongosh "$MONGO_URL"
```

### Erreur de permissions

```bash
# Donner les permissions d'exécution
chmod +x scripts/*.sh

# Vérifier les permissions du dossier de sauvegarde
ls -la SERVER/backups/
```

### Sauvegarde échouée

```bash
# Vérifier l'espace disque
df -h

# Vérifier les logs
tail -n 50 logs/backup.log
``` 