import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from '../screens/SignupScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomePage from '../screens/HomePage';
import LoginPage from '../screens/LoginPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddPostForm from '../screens/AddPostForm';
import DetailPage from '../screens/DetailPage';
import ProfilePage from '../screens/ProfilePage';

// Création d'un nouveau stack navigator
const Stack = createStackNavigator();

const AuthStack = () => {
    // Utilisation d'un état pour déterminer si c'est le premier lancement de l'app
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
    let routeName;

    // Vérification du premier lancement de l'app avec AsyncStorage
    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched').then((value) => {
            if (value == null) {
                AsyncStorage.setItem('alreadyLaunched', 'true'); // Marquer comme lancé
                setIsFirstLaunch(true); // Définir le premier lancement à vrai
            } else {
                setIsFirstLaunch(false); // Déjà lancé auparavant
            }
        });
    }, []);

    // Définition du nom de la route initiale en fonction du premier lancement
    if (isFirstLaunch == null) {
        return null; // Si le statut est indéterminé, ne rien rendre
    } else if (isFirstLaunch == true) {
        routeName = 'Onboarding'; // Lancer l'écran d'introduction pour les nouveaux utilisateurs
    } else {
        routeName = 'LoginPage'; // Lancer l'écran de connexion pour les utilisateurs existants
    }

    // Rendu du stack navigator avec les écrans spécifiés
    return (
        <Stack.Navigator initialRouteName={routeName}>
            {/* Définition des écrans et options de navigation */}
            <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ header: () => null }} // Cacher l'en-tête pour cet écran
            />
            <Stack.Screen
                name="Login"
                component={LoginPage}
                options={{ header: () => null }} // Cacher l'en-tête pour cet écran
            />
            {/* Ajout d'autres écrans dans le stack navigator */}
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="HomePage" component={HomePage} />
            <Stack.Screen name="LoginPage" component={LoginPage} />
            <Stack.Screen name="AddPostForm" component={AddPostForm} />
            <Stack.Screen name="DetailPage" component={DetailPage} />
            <Stack.Screen name="ProfilePage" component={ProfilePage} />
        </Stack.Navigator>
    );
};

export default AuthStack;
