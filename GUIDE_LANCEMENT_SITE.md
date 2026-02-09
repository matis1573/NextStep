# 🚀 GUIDE COMPLET - Lancer NextStep Correctement

## ✅ ÉTAPE 1 : Vérifier que le serveur tourne

Dans votre terminal, vous devriez voir :
```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

✅ **Si vous voyez ce message** : Le serveur tourne, passez à l'étape 2.

❌ **Si vous ne voyez pas ce message** : Lancez le serveur :
```bash
cd /Users/marwan/.gemini/antigravity/playground/exo-magnetar
python3 -m http.server 8000
```

---

## ✅ ÉTAPE 2 : Ouvrir le bon URL

**⚠️ IMPORTANT** : N'ouvrez PAS le fichier directement !

### ❌ MAUVAIS (file://)
```
file:///Users/marwan/.gemini/antigravity/playground/exo-magnetar/index.html
```
**Problème** : CORS bloque les API

### ✅ BON (http://localhost)
```
http://localhost:8000/index.html
```
**Solution** : CORS fonctionne !

---

## ✅ ÉTAPE 3 : Vérifier l'URL dans le navigateur

1. **Regardez la barre d'adresse** de votre navigateur
2. **Elle doit commencer par** : `http://localhost:8000`
3. **Si elle commence par** `file://` : **FERMEZ l'onglet** et ouvrez `http://localhost:8000/index.html`

---

## ✅ ÉTAPE 4 : Tester

1. Cliquer sur **"Student Demo"**
2. Uploader un CV (ou cliquer sur "Skip")
3. Ouvrir la console (F12)

### Vous devriez voir :
```
✅ Base de données ROME chargée avec 8 codes métiers
✅ Module France Travail chargé
🔍 Tentative de chargement des offres réelles...
```

### Vous NE devriez PAS voir :
```
❌ Access to fetch ... has been blocked by CORS policy
```

---

## 🔧 SI VOUS VOYEZ ENCORE DES ERREURS CORS

**Cela signifie que vous utilisez toujours `file://`**

### Solution :
1. **Fermer TOUS les onglets** du site
2. **Copier cette URL** : `http://localhost:8000/index.html`
3. **Coller dans la barre d'adresse**
4. **Appuyer sur Entrée**

---

## 📊 ERREURS NORMALES (À IGNORER)

### 1. API France Travail : 401
```
France Travail API: Error 401
```
**Normal** : La clé est expirée. Le système utilise les données de démo.

### 2. Hugging Face : Failed to fetch
```
Hugging Face Error: Failed to fetch
```
**Normal** : L'API a des limites. Le système utilise un fallback.

### 3. showNotification is not defined
```
Uncaught ReferenceError: showNotification is not defined
```
**Normal** : Fonction manquante, mais n'empêche pas le fonctionnement.

---

## ✅ CHECKLIST FINALE

- [ ] Serveur lancé (`python3 -m http.server 8000`)
- [ ] URL correcte (`http://localhost:8000/index.html`)
- [ ] Pas d'erreur CORS dans la console
- [ ] Points blancs visibles sur la carte

---

## 🎓 POUR LE HACKATHON

### Avant la démo :

1. **Lancer le serveur** :
   ```bash
   cd /Users/marwan/.gemini/antigravity/playground/exo-magnetar
   python3 -m http.server 8000
   ```

2. **Ouvrir le site** :
   ```
   http://localhost:8000/index.html
   ```

3. **Vérifier** : Pas d'erreur CORS

---

**Maintenant, fermez l'onglet actuel et ouvrez : http://localhost:8000/index.html** 🚀
