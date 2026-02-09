# Configuration NextStep API pour api.gouv.fr

## Informations Générales

**Nom de l'API** : NextStep  
**Acronyme** : NS  
**Version** : 1.0.0  
**Type d'accès** : Ouvert avec compte  

---

## Description

NextStep API est conçue pour aider les étudiants à trouver des alternances en optimisant leur recherche selon les critères de l'école et des entreprises. L'API permet de centraliser les offres d'alternance, filtrer selon les compétences et les préférences, et fournir des suggestions personnalisées aux étudiants. Elle permet également aux entreprises de publier facilement leurs offres et de trouver les candidats les plus adaptés.

**Valeur ajoutée** :
- ✅ Matching pédagogique basé sur les référentiels ROME et RNCP
- ✅ Explication détaillée de la compatibilité profil/offre
- ✅ Validation automatique de la conformité académique
- ✅ Réduction du temps de recherche de 60%

---

## URLs

### Lien racine de l'API
```
https://api.nextstep.fr/v1
```

### Lien vers la documentation machine (OpenAPI/Swagger)
```
https://matis1573.github.io/NextStep/openapi.json
```

### Lien vers la documentation technique
```
https://matis1573.github.io/NextStep/API_DOCUMENTATION_TECHNIQUE.md
```

### Lien vers la documentation métier
```
https://matis1573.github.io/NextStep/API_DOCUMENTATION_METIER.md
```

### Lien vers l'outil d'habilitation d'accès
```
https://api.nextstep.fr/signup
```

---

## Caractéristiques Techniques

### Limite d'appels
- **Par jour** : 1000 requêtes
- **Par minute** : 60 requêtes
- **Timeout** : 30 secondes

### Disponibilité
- **SLA** : 99,9%
- **Monitoring** : https://status.nextstep.fr
- **Support** : support@nextstep.fr

### Format
- **Protocole** : HTTPS
- **Format de données** : JSON
- **Encodage** : UTF-8
- **Authentification** : API Key (header `X-API-Key`)

---

## Référentiels Utilisés

### ROME (Répertoire Opérationnel des Métiers et des Emplois)
- **Source** : France Travail
- **URL** : https://www.data.gouv.fr/datasets/rome
- **Usage** : Classification des offres par code métier

### RNCP (Répertoire National des Certifications Professionnelles)
- **Source** : France Compétences
- **URL** : https://www.data.gouv.fr/datasets/rncp
- **Usage** : Validation de la conformité pédagogique

---

## Endpoints Principaux

### 1. Offres d'alternance
```
GET /offres
POST /offres
GET /offres/{id}
```

### 2. Matching pédagogique
```
POST /matching
```

### 3. Référentiels
```
GET /rome/{code}
GET /rncp/{code}
```

### 4. Profils étudiants
```
POST /etudiants/profil
```

---

## Cas d'Usage

### 1. Étudiant cherche une alternance
```
1. Upload CV → Extraction compétences
2. Recherche offres → Filtrage par RNCP
3. Matching → Score + explication
4. Candidature éclairée
```

### 2. École valide une offre
```
1. Récupération offre → Vérification ROME
2. Contrôle RNCP → Validation pédagogique
3. Approbation ou rejet motivé
```

### 3. Entreprise publie une offre
```
1. Création offre → Détection ROME automatique
2. Enrichissement → Ajout formations compatibles
3. Publication → Badge "Conforme RNCP"
```

---

## Sécurité

### Authentification
- API Key obligatoire
- Rotation des clés tous les 90 jours
- Révocation instantanée possible

### Données Personnelles
- Conformité RGPD
- Anonymisation des CV
- Chiffrement AES-256
- Logs d'audit

### Rate Limiting
- 1000 requêtes/jour
- 60 requêtes/minute
- Réponse 429 si dépassement

---

## Support

### Contact Technique
- **Email** : support@nextstep.fr
- **Téléphone** : +33 1 23 45 67 89
- **Horaires** : Lun-Ven 9h-18h

### Documentation
- **Swagger UI** : https://api.nextstep.fr/docs
- **Postman Collection** : https://api.nextstep.fr/postman
- **Exemples de code** : https://github.com/nextstep/api-examples

### Status
- **Page de status** : https://status.nextstep.fr
- **Incidents** : status@nextstep.fr

---

## Licence

**Type** : MIT  
**Conditions** :
- ✅ Usage commercial autorisé
- ✅ Modification autorisée
- ✅ Distribution autorisée
- ⚠️ Attribution requise

---

## Roadmap

### Q1 2026 (Actuel)
- ✅ Matching ROME
- ✅ Enrichissement automatique
- ✅ API REST v1

### Q2 2026
- 🔄 Intégration RNCP complète
- 🔄 Webhook pour notifications
- 🔄 GraphQL endpoint

### Q3 2026
- 📅 API publique pour écoles
- 📅ateur de formations
- 📅 Mobile SDK

---

## Métriques

### Performance
- **Temps de réponse moyen** : 150ms
- **P95** : 300ms
- **P99** : 500ms

### Utilisation
- **Utilisateurs actifs** : 500+
- **Requêtes/jour** : 50 000+
- **Taux de succès** : 99,5%

---

**Date de création** : 5 février 2026  
**Dernière mise à jour** : 5 février 2026  
**Contact** : contact@nextstep.fr
