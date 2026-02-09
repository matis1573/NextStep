# 🤖 GUIDE OLLAMA - IA Locale pour NextStep

## 🎯 QU'EST-CE QU'OLLAMA ?

Ollama est une IA qui tourne **localement sur votre ordinateur**. Pas besoin de clé API, pas de limite d'appels !

---

## ✅ INSTALLATION (5 minutes)

### Étape 1 : Télécharger Ollama

Aller sur : **https://ollama.ai**

Télécharger la version Mac et installer.

### Étape 2 : Télécharger un modèle

Ouvrir un terminal et taper :

```bash
ollama pull llama2
```

Ou pour un modèle plus rapide :

```bash
ollama pull mistral
```

### Étape 3 : Vérifier que ça marche

```bash
ollama list
```

Vous devriez voir :
```
NAME            SIZE
llama2:latest   3.8GB
```

---

## 🔧 INTÉGRATION DANS NEXTSTEP

### Étape 1 : Ajouter le script dans index.html

Ouvrir `index.html` et ajouter après la ligne 20 :

```html
<script src="ollama_integration_complete.js"></script>
```

### Étape 2 : Modifier script.js

Remplacer la fonction `analyzeCVWithHF` (ligne 1779) par :

```javascript
async function analyzeCVWithHF(text) {
    // Essayer Ollama d'abord
    if (await checkOllamaAvailability()) {
        const result = await analyzeCVWithOllama(text);
        if (result) return result;
    }
    
    // Fallback sur données de démo
    return {
        name: "Profil Étudiant",
        role: "Développeur Full Stack",
        skills: ["JavaScript", "React", "Node.js"],
        summary: "Étudiant passionné par le développement web"
    };
}
```

---

## 🧪 TESTER

### 1. Lancer Ollama

Ollama se lance automatiquement après l'installation. Sinon :

```bash
ollama serve
```

### 2. Lancer le site

```bash
cd /Users/marwan/.gemini/antigravity/playground/exo-magnetar
python3 -m http.server 8000
```

Ouvrir : `http://localhost:8000/index.html`

### 3. Uploader un CV

Dans la console (F12), vous devriez voir :

```
✅ Ollama disponible
🤖 Analyse du CV avec Ollama...
✅ CV analysé avec Ollama: {name: "...", role: "...", ...}
```

---

## 🎓 POUR LE HACKATHON

### Avantages d'Ollama :

1. ✅ **Gratuit** - Pas de clé API
2. ✅ **Illimité** - Pas de limite d'appels
3. ✅ **Rapide** - Tourne en local
4. ✅ **Privé** - Les données ne sortent pas de votre machine
5. ✅ **Offline** - Fonctionne sans Internet

### Phrase pour le jury :

> "Nous utilisons Ollama, une IA locale qui tourne directement sur la machine. Cela garantit la confidentialité des CV et permet un nombre illimité d'analyses sans coût."

---

## 📊 MODÈLES RECOMMANDÉS

| Modèle | Taille | Vitesse | Qualité |
|--------|--------|---------|---------|
| `llama2` | 3.8 GB | Moyen | Bonne |
| `mistral` | 4.1 GB | Rapide | Excellente |
| `codellama` | 3.8 GB | Moyen | Bonne (code) |

Pour changer de modèle, modifier `ollama_integration_complete.js` ligne 5 :

```javascript
model: 'mistral' // au lieu de 'llama2'
```

---

## 🔍 DÉPANNAGE

### Problème : "Ollama non disponible"

**Solution** : Vérifier qu'Ollama tourne :

```bash
curl http://localhost:11434/api/tags
```

Si erreur, lancer :

```bash
ollama serve
```

### Problème : "Modèle non trouvé"

**Solution** : Télécharger le modèle :

```bash
ollama pull llama2
```

---

**Ollama est prêt ! Téléchargez-le et testez ! 🚀**
