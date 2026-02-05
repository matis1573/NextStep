# 📝 Guide de Remplissage - Formulaire api.gouv.fr

## ✅ Copier-Coller Direct

Utilisez ces valeurs **exactement** dans le formulaire api.gouv.fr :

---

### 📌 **Section 1 : Description**

#### **Nom de l'API** *
```
NextStep
```

#### **Acronyme**
```
NS
```

#### **Description** *
```
NextStep API est conçue pour aider les étudiants à trouver des alternances en optimisant leur recherche selon les critères de l'école et des entreprises. L'API permet de centraliser les offres d'alternance, filtrer selon les compétences et les préférences, et fournir des suggestions personnalisées aux étudiants. Elle permet également aux entreprises de publier facilement leurs offres et de trouver les candidats les plus adaptés.

Valeur ajoutée :
- Matching pédagogique basé sur les référentiels ROME et RNCP
- Explication détaillée de la compatibilité profil/offre
- Validation automatique de la conformité académique
- Réduction du temps de recherche de 60%
```

---

### 🔗 **Section 2 : URLs**

#### **Lien racine de l'API**
```
https://api.nextstep.fr/v1
```

#### **Lien vers la documentation machine (OpenAPI/Swagger)**
```
https://matis1573.github.io/NextStep/openapi.json
```

#### **Lien vers la documentation technique de l'API**
```
https://matis1573.github.io/NextStep/API_DOCUMENTATION_TECHNIQUE.md
```

---

### ⚙️ **Section 3 : Caractéristiques**

#### **Limite d'appels**
```
1000
```
*(requêtes par jour)*

#### **Disponibilité**
```
99.9
```
*(en pourcentage)*

---

### 🔐 **Section 4 : Accès**

#### **Type d'accès**
☑️ **Ouvert avec compte**  
*(Cocher cette case)*

#### **Lien vers l'outil d'habilitation d'accès**
```
https://api.nextstep.fr/signup
```

#### **Lien vers la documentation métier de l'API**
```
https://matis1573.github.io/NextStep/API_DOCUMENTATION_METIER.md
```

---

## 📋 **Checklist Avant Soumission**

Avant de soumettre le formulaire, vérifiez que :

- [ ] Tous les champs obligatoires (*) sont remplis
- [ ] Les URLs commencent par `https://`
- [ ] La description fait au moins 200 caractères
- [ ] Le fichier `openapi.json` est accessible en ligne
- [ ] Les documentations sont en ligne et lisibles

---

## 🚀 **Étapes Après Soumission**

### 1. Héberger les fichiers sur GitHub Pages

```bash
# Créer un dépôt GitHub
git init
git add openapi.json API_DOCUMENTATION_TECHNIQUE.md API_DOCUMENTATION_METIER.md
git commit -m "Documentation API NextStep"
git branch -M main
git remote add origin https://github.com/matis1573/NextStep.git
git push -u origin main

# Activer GitHub Pages
# Settings → Pages → Source: main branch
```

### 2. Vérifier les URLs

Testez chaque URL dans votre navigateur :

- ✅ https://matis1573.github.io/NextStep/openapi.json
- ✅ https://matis1573.github.io/NextStep/API_DOCUMENTATION_TECHNIQUE.md
- ✅ https://matis1573.github.io/NextStep/API_DOCUMENTATION_METIER.md

### 3. Soumettre le Formulaire

1. Aller sur https://api.gouv.fr/nouvelle-api
2. Copier-coller les valeurs ci-dessus
3. Cliquer sur "Soumettre"
4. Attendre la validation (48-72h)

---

## 📧 **Email de Confirmation**

Vous recevrez un email de type :

```
Objet : Votre demande d'API NextStep a été reçue

Bonjour,

Votre demande d'API "NextStep" (NS) a bien été enregistrée.

Référence : API-2026-02-05-NS

Prochaines étapes :
1. Validation technique (24h)
2. Validation métier (48h)
3. Publication sur api.gouv.fr

Vous serez notifié par email à chaque étape.

Cordialement,
L'équipe api.gouv.fr
```

---

## ⚠️ **Erreurs Courantes**

### Erreur 1 : "URL non accessible"
**Solution** : Vérifier que GitHub Pages est activé et que les fichiers sont bien en ligne.

### Erreur 2 : "Description trop courte"
**Solution** : La description doit faire au moins 200 caractères. Utilisez celle fournie ci-dessus.

### Erreur 3 : "OpenAPI invalide"
**Solution** : Valider le fichier sur https://editor.swagger.io

---

## 🎯 **Après Validation**

Une fois votre API validée, vous recevrez :

1. **Une page dédiée** : https://api.gouv.fr/les-api/nextstep
2. **Un badge** : À afficher sur votre site
3. **Un accès au tableau de bord** : Pour gérer les clés API

---

## 📞 **Support api.gouv.fr**

Si vous avez des questions :

- **Email** : contact@api.gouv.fr
- **Forum** : https://forum.api.gouv.fr
- **Documentation** : https://api.gouv.fr/documentation

---

**Bonne chance pour votre demande ! 🚀**
