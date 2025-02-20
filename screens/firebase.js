import { initializeApp } from 'firebase/app'; // Importe la fonction pour initialiser Firebase
import 'firebase/auth'; // Importe les fonctionnalités d'authentification de Firebase
import 'firebase/firestore'; // Importe les fonctionnalités de la base de données Firestore

// Importation des fonctions spécifiques pour l'authentification Firebase et la persistance React Native
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe AsyncStorage pour stocker des données localement sur le dispositif mobile



const firebaseConfig = {
  apiKey: "AIzaSyCsKbRXMuLJjVRionzC1WXeEQwaD7KQxoQ",
  authDomain: "helbimmoapp.firebaseapp.com",
  projectId: "helbimmoapp",
  storageBucket: "helbimmoapp.appspot.com",
  messagingSenderId: "131253982264",
  appId: "1:131253982264:web:d580ecbd4259779b9242cd",
  measurementId: "G-YVKVZ2113W"
};

// Initialisation de l'application Firebase avec la configuration définie
const app = initializeApp(firebaseConfig);

// Configuration de l'authentification Firebase pour utiliser AsyncStorage comme méthode de persistance.
// Cela permet de maintenir l'état de connexion entre les redémarrages de l'application.
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Importation et initialisation du service Firestore pour les opérations de base de données
import { getFirestore } from 'firebase/firestore';
const db = getFirestore(app);

// Exportation des instances de l'application Firebase, de l'authentification et de Firestore pour une utilisation ultérieure dans l'application
export { app, auth, db };
