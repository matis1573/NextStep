# 🤖 Analyse CV avec Ollama - Documentation

## ✅ Ce qui a été mis en place

### 1. Backend FastAPI (`backend/app/main.py`)
- **Nouvel endpoint** : `/api/analyze-cv`
- **Fonction** : Reçoit le texte d'un CV et utilise Ollama pour extraire les informations structurées
- **Modèle utilisé** : `llama3.2` (configurable)
- **Informations extraites** :
  - Nom complet
  - Poste/rôle recherché
  - Compétences (liste)
  - Expériences professionnelles (liste)
  - Formation/Éducation (liste)
  - Localisation

### 2. Frontend (`script.js`)
- **Fonction `extractTextFromPDF(file)`** : Extrait le texte d'un PDF avec pdf.js
- **Fonction `analyzeCVData(text)`** : Envoie le texte à Ollama et récupère les données structurées
- **Gestion d'erreurs** : Fallback vers des données de démo si Ollama n'est pas disponible

### 3. Page de test (`test_cv_analysis.html`)
- Interface moderne pour tester l'analyse de CV
- Drag & drop de fichiers PDF
- Affichage visuel des résultats
- Accessible via : `http://localhost:8080/test_cv_analysis.html`

---

## 🚀 Comment utiliser

### Prérequis
1. **Ollama doit être installé et en cours d'exécution** :
   ```bash
   ollama serve
   ```

2. **Le modèle llama3.2 doit être téléchargé** :
   ```bash
   ollama pull llama3.2
   ```

3. **Le backend FastAPI doit être actif** (déjà en cours) :
   ```bash
   cd backend
   source .venv/bin/activate
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Le serveur web doit être actif** (déjà en cours) :
   ```bash
   python3 -m http.server 8080
   ```

### Test rapide
1. Ouvrez : `http://localhost:8080/test_cv_analysis.html`
2. Déposez un CV PDF
3. Attendez l'analyse (peut prendre 10-30 secondes selon la taille du CV)
4. Consultez les résultats extraits

### Utilisation dans l'application principale
1. Allez sur : `http://localhost:8080`
2. Cliquez sur **"Voir la Démo"** → **"Étudiant"**
3. Dans le bloc **"Déposez votre CV"**, uploadez votre PDF
4. L'IA Ollama va :
   - Extraire le texte du PDF
   - Analyser les informations importantes
   - Afficher les résultats
   - Rechercher des offres correspondantes

---

## 🔍 Détails techniques

### Prompt envoyé à Ollama
```
Tu es un expert en analyse de CV. Analyse le CV suivant et extrais les informations importantes au format JSON strict.

CV:
[texte du CV]

Réponds UNIQUEMENT avec un objet JSON valide contenant ces champs :
{
    "name": "Nom complet du candidat",
    "role": "Poste ou titre professionnel recherché",
    "skills": ["compétence1", "compétence2", "compétence3"],
    "experience": ["expérience1", "expérience2"],
    "education": ["formation1", "formation2"],
    "location": "Ville ou région"
}
```

### Paramètres Ollama
- **Température** : 0.3 (pour plus de précision)
- **Max tokens** : 1000
- **Stream** : false

### Gestion des erreurs
- Si Ollama n'est pas disponible → Données de démo
- Si le JSON est mal formaté → Nettoyage automatique (suppression des code blocks markdown)
- Si les données sont incomplètes → Valeurs par défaut

---

## 🐛 Débogage

### Vérifier qu'Ollama fonctionne
```bash
curl http://localhost:11434/api/tags
```

### Vérifier le backend
```bash
curl http://localhost:8000/health
```

### Tester l'endpoint d'analyse
```bash
curl -X POST http://localhost:8000/api/analyze-cv \
  -H "Content-Type: application/json" \
  -d '{"cv_text": "Jean Dupont, Développeur Full Stack, compétences: React, Node.js, Python"}'
```

### Logs dans la console
Ouvrez la console du navigateur (F12) pour voir :
- `🤖 Analyse du CV avec Ollama...`
- `📄 Texte extrait (premiers 200 caractères): ...`
- `✅ Réponse Ollama: {...}`

---

## 📊 Exemple de réponse

```json
{
  "name": "Jean Dupont",
  "role": "Développeur Full Stack",
  "skills": [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "MongoDB"
  ],
  "experience": [
    "Développeur chez TechCorp (2021-2023)",
    "Stage développement web chez StartupXYZ (2020)"
  ],
  "education": [
    "Master Informatique - Université Paris (2021)",
    "Licence Informatique - Université Lyon (2019)"
  ],
  "location": "Paris, France"
}
```

---

## 🎯 Prochaines améliorations possibles

1. **Extraction d'images** : Analyser les logos d'entreprises
2. **Détection de langues** : Identifier les langues parlées
3. **Score de matching** : Calculer un score de correspondance avec les offres
4. **Suggestions** : Proposer des améliorations du CV
5. **Export** : Générer un CV optimisé

---

## ✨ Résumé

Votre application utilise maintenant **réellement Ollama** pour analyser les CV ! 

- ✅ Extraction de texte PDF fonctionnelle
- ✅ Analyse IA avec Ollama
- ✅ Extraction d'informations structurées
- ✅ Fallback automatique si Ollama est indisponible
- ✅ Interface de test dédiée
- ✅ Intégration dans la démo étudiante

**Testez dès maintenant avec un vrai CV !** 🚀
