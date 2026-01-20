# Tests E2E

**E2E** = End-to-End (de bout en bout)

Ces tests simulent un **vrai utilisateur** qui utilise ton API :
- Ils envoient de vraies requêtes HTTP (POST, GET, PATCH, DELETE)
- Ils utilisent une vraie base de données MongoDB
- Ils vérifient que tout fonctionne ensemble

## 🎯 Ce qui est testé

### ✅ Cas de succès (happy path)
- Créer une tâche avec tous les champs
- Créer une tâche sans description (optionnelle)
- Lister toutes les tâches
- Récupérer une tâche par ID
- Modifier une tâche (title, description, completed)
- Supprimer une tâche

### ❌ Cas d'erreur
- Créer une tâche sans title (requis)
- Créer une tâche avec title vide
- Créer une tâche avec title trop long (>200 caractères)
- Créer une tâche avec description trop longue (>1000 caractères)
- Envoyer des champs inconnus (rejetés par whitelist)
- Récupérer/modifier/supprimer avec un ID invalide (400)
- Récupérer/modifier/supprimer une tâche inexistante (404)

## 🚀 Lancer les tests

### Prérequis
MongoDB doit être démarré (via Docker ou localement)

```bash
# Démarrer MongoDB avec Docker
docker-compose up -d mongodb
```

### Lancer tous les tests E2E
```bash
pnpm test:e2e
```

### Lancer uniquement les tests des tâches
```bash
pnpm test:e2e -- tasks.e2e-spec.ts
```