# REACT-NATIVE
real estate sales and search application

# HelbImmo

## Description des Technologies Utilisées

J'ai choisi **React Native** pour le développement de HelbImmo, car il s'agit d'un framework puissant et flexible, parfait pour créer des applications mobiles réactives qui fonctionnent aussi bien sur **iOS** que sur **Android**. Cette approche multiplateforme permet de toucher un public plus large et d'offrir une expérience utilisateur cohérente sur les deux systèmes d'exploitation dominants.

React Native a également été mon choix de technologie, car il est largement utilisé et apprécié dans le monde du développement mobile, et il est adopté par la majorité des applications mobiles que j’utilise.

En intégrant **Expo**, j'ai considérablement simplifié le processus de développement. Expo est un ensemble d'outils qui complète React Native, facilitant le développement, le débogage et le déploiement. Cela me permet de me concentrer pleinement sur la conception d'une expérience utilisateur attrayante et efficace.

Expo est accessible sur le **Google Play Store** et l'**Apple App Store**.

Pour la gestion de l'authentification des utilisateurs et le stockage des données, j'ai opté pour **Firebase**, en particulier **Firebase Authentication** et **Firestore**.

- **Firebase Authentication** offre une solution robuste pour la gestion sécurisée des comptes utilisateurs.
- **Firestore** permet de stocker et de synchroniser les annonces immobilières en temps réel, assurant ainsi une application performante et fiable.

En résumé, mon choix de **React Native**, **Expo**, **Firebase Authentication** et **Firestore** est un engagement envers la qualité et la performance. Ces technologies permettent de déployer une application mobile non seulement fonctionnelle mais aussi rapide, sécurisée et agréable à utiliser sur toutes les plateformes.

---

## Fonctionnalités

- **Onboarding de Bienvenue** : Lors de la première ouverture de l’application après installation, les utilisateurs sont accueillis par un onboarding interactif. Ce guide ne se réaffiche qu'en cas de réinstallation de l’application.
- **Inscription et Connexion** : Création de compte via email et mot de passe. Une fois connecté, l'utilisateur est redirigé vers la page d'accueil.
- **Page d'Accueil** : Les utilisateurs peuvent naviguer et accéder aux fonctionnalités principales de l'application via un menu interactif.
- **Ajout d'Annonces** : Les utilisateurs peuvent publier des annonces via un formulaire, téléverser jusqu'à cinq images, sélectionner le type de bien (maison ou appartement), utiliser une **barre de recherche d'adresse belge dynamique**, indiquer le nombre de chambres, le prix et la superficie.
- **Visualisation et Interaction avec les Annonces** :
  - Affichage des annonces sur la page d'accueil.
  - Page détaillée avec un carrousel d’images et des informations complètes sur l’annonce.
  - Contact direct de l’auteur de l’annonce par email.
  - Visualisation de l'emplacement sur une carte interactive.
  - Possibilité pour l’auteur de supprimer ses propres annonces.
- **Tri et Filtres des Annonces** :
  - Tri par date d'ajout.
  - Filtres par type de bien, prix et nombre de chambres.
  - **Barre de recherche** permettant de filtrer les annonces par titre, description et localisation.
- **Page de Profil Personnel** : Affichage des informations du compte et des annonces personnelles.
- **Déconnexion** : Bouton permettant de fermer la session et de revenir à l'écran de connexion.

### Liste des fonctionnalités principales
- [x] Connexion/déconnexion
- [x] Inscription
- [x] Onboarding lors du premier lancement
- [x] Ajout d’annonce via formulaire
- [x] Barre de recherche d’adresse belge dynamique
- [x] Page détaillée des annonces
- [x] Carrousel d’images
- [x] Carte géographique pour la localisation
- [x] Suppression d’annonces
- [x] Tri et filtre des annonces
- [x] Barre de recherche avancée
- [x] Page de profil personnel

---

## Lancement de l’Application

### Depuis un terminal, dans le répertoire principal du projet :

```sh
npx expo start
```

Cette commande génère une **URL** et un **QR Code** permettant d’accéder à l’application via **Expo Go**. 

### Accès à l'application :
1. Scanner le **QR Code** avec un smartphone.
2. Lancer **Expo Go** pour charger l’application.

### Problèmes de connexion réseau
Sur certains réseaux (ex: réseaux scolaires comme **Prigogine** ou **Eduroam**), la commande `npx expo start` peut ne pas fonctionner. Dans ce cas, utiliser :

```sh
npx expo start --tunnel
```

Cette solution a permis de contourner les restrictions réseau en classe.

### Accès via la 4G
Aucun problème détecté en utilisant une connexion **4G**.

---

## Résumé des fonctionnalités techniques
- Onboarding présent lors du premier lancement de l'application
- Création de compte et connexion utilisateur
- Publication d’annonces (via formulaire) si l'utilisateur est connecté
- Recherche des annonces avec filtres (prix, type, localisation, etc.)
- Tri des annonces (date, prix)
- Visualisation des annonces avec géolocalisation sur une carte

---

## Conclusion
HelbImmo est une application mobile performante et ergonomique permettant aux utilisateurs de publier et de rechercher des annonces immobilières en toute simplicité. Grâce à **React Native**, **Expo**, **Firebase Authentication** et **Firestore**, l’application garantit une expérience fluide, rapide et sécurisée sur **Android** et **iOS**.
