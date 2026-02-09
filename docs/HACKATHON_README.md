# 🎯 NextStep - Conformité Hackathon Epitech x Linkpick

## ✅ Fonctionnalités Implémentées

### 1. **Matching Pédagogique avec Référentiel ROME**
- ✅ Base de données ROME intégrée (`rome_database.js`)
- ✅ 8 codes métiers informatiques (M1805, M1806, M1810, etc.)
- ✅ Enrichissement automatique de toutes les offres avec:
  - Code ROME
  - Libellé métier
  - Compétences requises selon le référentiel
  - Formations compatibles

### 2. **Cas d'Usage Apprenant → Employeur**
- ✅ Chatbot IA "NextStep AI" disponible 24/7
- ✅ Analyse de CV via Hugging Face GPT-2
- ✅ Système de scoring (0-100) pour le matching
- ✅ Explication détaillée du matching ROME:
  - Compétences acquises vs requises
  - Formations recommandées
  - Pourcentage de compatibilité

### 3. **Cas d'Usage École → Offre → Employeur**
- ✅ Vérification automatique de la conformité ROME
- ✅ Traduction des besoins entreprise en objectifs pédagogiques
- ✅ Base de données écoles (`schools_db.js`) avec lycées et facs
- ⚠️ **Manque**: Intégration complète du référentiel RNCP (prévu mais non finalisé)

### 4. **Cas d'Usage Employeur → Apprenant**
- ✅ Clarification des offres via l'IA
- ✅ Détection automatique du code ROME basé sur:
  - Intitulé du poste
  - Compétences mentionnées
  - Mots-clés métier
- ✅ API France Travail intégrée (offres réelles)

---

## 🚀 Démonstration Technique

### Exemple de Matching ROME

**Offre:** Développeur Full Stack IA (Airbus)
```javascript
{
  company: "Airbus",
  role: "Développeur Fullstack IA",
  codeROME: "M1805",  // ← Détecté automatiquement
  libelleROME: "Études et développement informatique",
  competencesROME: [
    "Programmation orientée objet",
    "Développement web",
    "Gestion de bases de données"
  ],
  formationsROME: ["BUT Informatique", "Licence Pro Développement"]
}
```

**Profil Étudiant:**
```javascript
{
  name: "Sophie",
  skills: ["React.js", "Node.js", "Python"],
  formation: "BUT Informatique"
}
```

**Résultat du Matching:**
```
📋 Compatibilité: 85%
✅ Compétences acquises: Développement web, Programmation
⚠️ Compétences à développer: Gestion de bases de données
💡 Formation compatible: BUT Informatique ✓
```

---

## 📊 Architecture Technique

### Stack Technologique
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript ES6+
- **Cartographie**: MapLibre GL JS
- **IA**: Hugging Face Inference API (GPT-2)
- **APIs Externes**:
  - France Travail (offres d'emploi réelles)
  - Référentiel ROME (codes métiers)

### Flux de Données
```
1. Upload CV → Analyse IA → Extraction compétences
2. Recherche offres → API France Travail → Récupération données
3. Enrichissement ROME → Matching automatique → Scoring
4. Affichage carte → Géolocalisation → Visualisation
5. Chatbot → Explication pédagogique → Accompagnement
```

---

## 🎓 Réponse aux Exigences du Jury

### ✅ Prototype Fonctionnel
- Interface complète avec carte interactive
- Upload et analyse de CV
- Matching en temps réel
- Chatbot conversationnel

### ✅ Architecture IA + Matching
- **Collecte**: Conversation naturelle via chatbot
- **Traduction**: CV → Compétences → Codes ROME
- **Explication**: Pourquoi un profil correspond (ou non)

### ⚠️ Points d'Amélioration
1. **RNCP**: Intégration partielle (base de données créée, logique à finaliser)
2. **API Token**: Le token France Travail fourni est expiré (401)
3. **Explication IA**: Peut être enrichie avec plus de détails pédagogiques

---

## 🏆 Valeur Ajoutée de NextStep

### Ce qui nous différencie:
1. **Visualisation Géographique**: Carte interactive avec géolocalisation
2. **Matching Pédagogique**: Pas juste un score, mais une explication ROME
3. **Expérience Premium**: Design moderne, animations fluides
4. **IA Conversationnelle**: Accompagnement personnalisé 24/7

### Impact pour les 3 acteurs:
- **Apprenant**: Comprend pourquoi une offre lui correspond
- **École**: Vérifie la conformité pédagogique (ROME)
- **Employeur**: Reçoit des profils pré-qualifiés

---

## 📝 Pitch (10 min)

### Structure Recommandée:
1. **Problème** (2 min): Décalage entre langage école/entreprise
2. **Solution** (3 min): NextStep = Traducteur pédagogique IA
3. **Démo** (4 min):
   - Upload CV
   - Matching ROME
   - Explication chatbot
4. **Impact** (1 min): Sécurisation du parcours étudiant

### Points Clés à Mentionner:
- ✅ "Chaque offre est validée selon le référentiel ROME"
- ✅ "Notre IA explique POURQUOI, pas juste un score"
- ✅ "Traduction automatique: missions entreprise → compétences académiques"

---

## 🔧 Commandes Rapides

### Lancer le Projet:
```bash
# Ouvrir index.html dans un navigateur
open index.html
```

### Tester le Matching ROME:
```javascript
// Console du navigateur
const offer = window.studentOffersData[0];
console.log("Code ROME:", offer.codeROME);
console.log("Compétences:", offer.competencesROME);
```

### Tester l'IA:
1. Ouvrir le chatbot (icône robot)
2. Taper: `@Airbus`
3. Voir l'explication ROME complète

---

## 📞 Contact & Support

**Équipe NextStep**
- GitHub: [Lien du repo]
- Email: [Votre email]
- Discord: [Votre pseudo]

**Fichiers Clés:**
- `rome_database.js`: Base de données ROME
- `script.js` (lignes 2158-2166): Enrichissement automatique
- `script.js` (lignes 2875+): Explication IA du matching

---

## ⏰ Roadmap Post-Hackathon

### Court Terme (Semaine 1):
- [ ] Finaliser l'intégration RNCP complète
- [ ] Obtenir un token France Travail valide
- [ ] Enrichir les réponses IA avec plus de détails

### Moyen Terme (Mois 1):
- [ ] Ajouter 50+ codes ROME supplémentaires
- [ ] Système de recommandation de formations
- [ ] Export PDF du matching pédagogique

### Long Terme (Trimestre 1):
- [ ] Partenariat avec écoles pour référentiels RNCP
- [ ] API publique pour les employeurs
- [ ] Mobile app (React Native)

---

**Date de création**: 5 février 2026  
**Version**: 1.0 - Hackathon Epitech x Linkpick  
**Statut**: ✅ Prêt pour le jury
