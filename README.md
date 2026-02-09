# 🚀 NextStep : L'Orientation Propulsée par l'IA Locale

> **La première plateforme de recherche d'alternance qui combine Intelligence Artificielle Locale, Données Officielles (France Travail) et Géolocalisation.**

---

## 🧐 La Problématique

Pour un étudiant aujourd'hui, trouver une alternance est un parcours du combattant :
*   **Offres dispersées** : Il faut naviguer sur des dizaines de sites.
*   **Descriptions cryptiques** : Les offres d'emploi sont souvent génériques et difficiles à décrypter pour un junior.
*   **Manque de feedback** : "Est-ce que mon CV correspond vraiment ?" L'étudiant envoie des centaines de candidatures sans savoir s'il a ses chances.
*   **Déshumanisation** : Les plateformes classiques sont des moteurs de recherche froids sans accompagnement.

## 💡 Notre Solution

**NextStep** réinvente cette expérience en plaçant l'IA au service de l'étudiant, tout en garantissant la souveraineté des données.

Nous avons créé un **compagnon de carrière intelligent** qui :
1.  **Comprend le candidat** en analysant son CV en profondeur.
2.  **Comprend le marché** en se connectant en temps réel aux offres officielles du Gouvernement (API France Travail).
3.  **Matche les deux** grâce à un moteur d'IA générative local (Llama 3.2 via Ollama) qui explique *pourquoi* une offre est intéressante.

---

## ✨ Fonctionnalités Principales

### 1. 🗺️ Pathfinder : La Carte Interactive
Fini les listes interminables. NextStep affiche les opportunités **autour de l'étudiant** (rayon configurable, par défaut < 20km).
*   Visualisation immédiate de la densité des offres.
*   Filtrage intelligent par domaine et type de contrat.
*   Données réelles issues de l'API France Travail.

### 2. 🤖 Coach Carrière Expert (IA Locale)
Notre Chatbot n'est pas un simple script. C'est une **IA contextuelle** (Llama 3.2) capable de :
*   **Contextualisation** : Il sait quelle entreprise vous regardez. Dites *"Parle-moi de cette boîte"* et il vous fera une présentation détaillée basée sur les données réelles (secteur, description).
*   **Gap Analysis** : Dites *"Quels sont mes avantages ?"*. L'IA croise **votre CV** (compétences, expériences) avec les **pré-requis** de l'offre pour vous donner des arguments de vente concrets (Hard & Soft Skills).

### 3. 📄 Analyseur de CV Intelligent
L'utilisateur peut déposer son CV (PDF).
*   Extraction du texte via `pdf.js`.
*   Analyse sémantique pour détecter les compétences clés.
*   Conversion automatique vers les codes ROME (Répertoire Opérationnel des Métiers et des Emplois) pour interroger l'API France Travail avec précision.

### 4. 🛡️ Privacy First (100% Local / Open Source)
Contrairement aux autres plateformes, **aucune donnée personnelle n'est envoyée à OpenAI ou Google**.
*   Le moteur d'IA (Ollama) tourne **localement** sur la machine ou le serveur.
*   Les appels API externes se font uniquement vers les services de l'État (France Travail).

---

## 🛠️ Stack Technique

Le projet est conçu avec une architecture moderne et découplée :

*   **Frontend** : HTML5, CSS3 (Design System Premium), JavaScript Vanilla (Performance maximale).
*   **Backend** : Python **FastAPI** (API REST performante et asynchrone).
*   **Intelligence Artificielle** : 
    *   **Ollama** : Moteur d'inférence local.
    *   **Llama 3.2** : Le modèle de langage utilisé pour le raisonnement.
*   **Données** : API France Travail (Offres réelles).

---

## 🚀 Installation et Lancement

Pour faire tourner NextStep sur votre machine :

### Pré-requis
1.  Avoir **Python 3.8+** installé.
2.  Avoir **Ollama** installé et le modèle `llama3.2` téléchargé (`ollama pull llama3.2`).

### 1. Lancer le Backend (Cerveau IA & Proxy)
Ce service gère la communication avec Ollama et fait le pont sécurisé avec France Travail.

```bash
cd backend
# (Optionnel) Créer un venv : python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Lancer le Frontend (Interface Web)
Dans un nouveau terminal :

```bash
cd public
python3 -m http.server 8080
```

### 3. Accès
Ouvrez votre navigateur sur : **[http://localhost:8080](http://localhost:8080)**

---

## 🔮 Roadmap

*   [ ] Intégration de l'authentification OAuth.
*   [ ] Version mobile (PWA).
*   [ ] Génération automatique de lettre de motivation par l'IA.

---
*Développé avec ❤️ pour NextStep.*
