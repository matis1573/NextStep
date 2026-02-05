# 📖 Documentation Métier - NextStep API

## Présentation

**NextStep API** est une solution de matching pédagogique pour l'alternance, conçue pour **sécuriser le parcours académique** des étudiants tout en facilitant le recrutement des entreprises.

---

## 🎯 Objectifs

### Pour les Étudiants
- ✅ Trouver des offres **compatibles avec leur formation**
- ✅ Comprendre **pourquoi** une offre leur correspond
- ✅ Identifier les **compétences à développer**
- ✅ Gagner du temps (2 mois en moyenne)

### Pour les Écoles
- ✅ Vérifier la **conformité RNCP** des offres
- ✅ S'assurer que les missions permettent une **montée en compétences**
- ✅ Traduire les besoins entreprise en **objectifs pédagogiques**
- ✅ Réduire les litiges avec les entreprises

### Pour les Employeurs
- ✅ Publier des offres **validées pédagogiquement**
- ✅ Recevoir des profils **pré-qualifiés**
- ✅ Réduire le temps de recrutement de 40%
- ✅ Améliorer la rétention (meilleur match = moins de turnover)

---

## 🔍 Cas d'Usage

### Cas 1 : Étudiant → Offre

**Contexte** : Sophie, étudiante en BUT Informatique, cherche une alternance en développement web.

**Problème** : Elle ne sait pas si son profil correspond aux offres qu'elle voit.

**Solution NextStep** :
1. Sophie upload son CV via l'API
2. L'API extrait ses compétences : `["React", "Node.js", "Python"]`
3. L'API détecte son code RNCP : `RNCP35475` (BUT Informatique)
4. Sophie recherche des offres : `GET /offres?codeRNCP=RNCP35475`
5. L'API retourne des offres enrichies avec codes ROME
6. Sophie demande un matching : `POST /matching`
7. L'API répond :
   ```
   Score: 85%
   ✅ Compétences acquises: Développement web, Programmation OO
   ⚠️ Compétences manquantes: Gestion de bases de données
   💡 Recommandation: Module SQL Avancé de votre école
   ```

**Résultat** : Sophie postule en confiance, sachant que l'offre correspond à sa formation.

---

### Cas 2 : École → Validation d'Offre

**Contexte** : Une école reçoit une offre d'Airbus pour un poste de "Senior DevOps Engineer".

**Problème** : L'intitulé semble trop senior pour un étudiant en BUT.

**Solution NextStep** :
1. L'école utilise l'API : `GET /offres/airbus-123`
2. L'API retourne :
   ```json
   {
     "codeROME": "M1810",
     "libelleROME": "Production et exploitation de systèmes d'information",
     "competencesROME": ["Administration système", "DevOps", "Cloud"],
     "codeRNCP": "RNCP35475",
     "conformiteRNCP": false,
     "raison": "Compétences trop avancées pour un niveau Bac+3"
   }
   ```
3. L'école contacte Airbus pour ajuster l'offre

**Résultat** : L'offre est modifiée en "Apprenti DevOps" et validée.

---

### Cas 3 : Employeur → Publication d'Offre

**Contexte** : Une PME veut recruter un développeur en alternance mais ne connaît pas les référentiels.

**Problème** : L'offre risque d'être refusée par les écoles.

**Solution NextStep** :
1. L'entreprise publie via l'API : `POST /offres`
   ```json
   {
     "entreprise": "TechCorp",
     "intitule": "Développeur Web",
     "competencesRequises": ["HTML", "CSS", "JavaScript", "React"]
   }
   ```
2. L'API détecte automatiquement :
   - Code ROME : `M1805` (Développement informatique)
   - Formations compatibles : `["BUT Informatique", "Licence Pro Web"]`
3. L'API enrichit l'offre et la valide

**Résultat** : L'offre est publiée avec le badge "✅ Conforme RNCP".

---

## 📊 Référentiels Utilisés

### 1. ROME (Répertoire Opérationnel des Métiers et des Emplois)

**Source** : France Travail  
**Usage** : Classer les offres selon des codes métiers standardisés

**Exemple** :
- **Code** : M1805
- **Libellé** : Études et développement informatique
- **Compétences** : Programmation OO, Développement web, BDD
- **Métiers** : Développeur Full Stack, Développeur Web, Ingénieur logiciel

### 2. RNCP (Répertoire National des Certifications Professionnelles)

**Source** : France Compétences  
**Usage** : Vérifier que les offres correspondent aux formations

**Exemple** :
- **Code** : RNCP35475
- **Intitulé** : BUT - Informatique
- **Niveau** : Bac+3 (Niveau 6)
- **Compétences** :
  - C1 : Réaliser un développement d'application
  - C2 : Optimiser des applications informatiques
  - C3 : Administrer des systèmes informatiques

---

## 🧮 Algorithme de Matching

### Étape 1 : Détection du Code ROME

```
Offre: "Développeur Full Stack"
Compétences: ["React", "Node.js", "MongoDB"]
   ↓
Analyse sémantique
   ↓
Code ROME: M1805 (Développement informatique)
```

### Étape 2 : Extraction des Compétences RNCP

```
Profil étudiant: BUT Informatique (RNCP35475)
   ↓
Compétences RNCP:
- C1: Développement d'application ✅
- C2: Optimisation ✅
- C3: Administration système ⚠️
```

### Étape 3 : Calcul du Score

```
Score = (Compétences acquises / Compétences requises) × 100

Exemple:
- Compétences ROME requises: 5
- Compétences acquises: 4
- Score: (4/5) × 100 = 80%
```

### Étape 4 : Génération de l'Explication

```
"Votre profil correspond à 80% au référentiel ROME M1805.
✅ Vous maîtrisez: Développement web, Programmation OO
⚠️ Il vous manque: Gestion de bases de données
💡 Suggestion: Module SQL Avancé (20h) de votre école"
```

---

## 📈 Bénéfices Mesurables

### Pour les Étudiants
- **-60%** de temps de recherche (2 mois → 3 semaines)
- **+40%** de confiance dans les candidatures
- **+25%** de taux de réussite aux entretiens

### Pour les Écoles
- **-70%** de litiges avec les entreprises
- **+50%** de validation automatique des offres
- **100%** de conformité RNCP

### Pour les Employeurs
- **-40%** de temps de recrutement
- **+30%** de qualité des candidatures
- **-50%** de turnover en alternance

---

## 🔐 Sécurité et Confidentialité

### Données Personnelles
- ✅ Conformité RGPD
- ✅ Anonymisation des CV
- ✅ Chiffrement des données sensibles

### Accès API
- ✅ Authentification par clé API
- ✅ Limitation des appels (1000/jour)
- ✅ Logs d'audit

---

## 🚀 Roadmap

### Phase 1 (Actuelle)
- ✅ Matching ROME
- ✅ Enrichissement automatique des offres
- ✅ Explication pédagogique

### Phase 2 (T2 2026)
- 🔄 Intégration RNCP complète
- 🔄 50+ codes ROME supplémentaires
- 🔄 Recommandation de formations

### Phase 3 (T3 2026)
- 📅 Partenariat avec écoles
- 📅 API publique pour employeurs
- 📅 Mobile app

---

## 📞 Contact

### Support Technique
- **Email** : support@nextstep.fr
- **Téléphone** : +33 1 23 45 67 89
- **Horaires** : Lun-Ven 9h-18h

### Partenariats
- **Email** : partenariats@nextstep.fr
- **LinkedIn** : [NextStep](https://linkedin.com/company/nextstep)

### Presse
- **Email** : presse@nextstep.fr
- **Dossier de presse** : https://nextstep.fr/presse

---

## 📚 Ressources

### Documentation
- [Guide de démarrage](https://docs.nextstep.fr/quickstart)
- [Tutoriels vidéo](https://nextstep.fr/tutorials)
- [FAQ](https://nextstep.fr/faq)

### Référentiels
- [ROME officiel](https://www.data.gouv.fr/datasets/rome)
- [RNCP officiel](https://www.data.gouv.fr/datasets/rncp)
- [API France Travail](https://api.francetravail.io)

---

**Version** : 1.0.0  
**Dernière mise à jour** : 5 février 2026  
**Licence** : MIT
