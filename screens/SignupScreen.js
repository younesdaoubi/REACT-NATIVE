import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { app } from './firebase';
import { getAuth, createUserWithEmailAndPassword, AuthErrorCodes } from 'firebase/auth';
import { db } from './firebase'; 
import { Icon } from 'react-native-elements';

// Composant pour l'écran d'inscription
const SignUpScreen = ({ navigation }) => {
  // États pour les données du formulaire d'inscription
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gsmNumber, setGsmNumber] = useState(''); // État pour stocker le numéro de GSM
  const [error, setError] = useState(null); // État pour gérer les messages d'erreur


// Ajouter un état pour suivre si le composant est monté (serrs a eviter le "WARN  Sending `onAnimatedValueUpdate` with no listeners registered")
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  // Lorsque le composant est monté
  setIsMounted(true);

  // Fonction de nettoyage lors du démontage
  return () => {
    setIsMounted(false); // Mettre à jour l'état lors du démontage
  };
}, []);

 



  // Fonction pour gérer l'inscription
  const handleSignUp = async () => {
    if (!isMounted) return; // Ne rien faire si le composant est démonté

        try {
          // Utilisation de Firebase Auth pour créer un nouvel utilisateur
          const auth = getAuth(app);
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          navigation.navigate('HomePage'); // Navigation vers la page d'accueil après l'inscription

          // Ajout du numéro de GSM dans Firestore sous la collection 'users'
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            gsmNumber: gsmNumber,
          });
        } catch (error) {
          console.error(error);
          // Gestion des erreurs d'authentification
          if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
            setError("L'adresse e-mail est déjà utilisée.");
          } else {
            setError("Une erreur s'est produite lors de l'inscription.");
          }
        }
  };
  return (

    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      <View style={styles.inputContainer}>
        <Icon name="email" type="material" size={24} color="#3b5998" />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#3b5998"
          onChangeText={(text) => setEmail(text)}
          value={email}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" type="material" size={24} color="#3b5998" />
        <TextInput
          placeholder="Mot de passe"
          placeholderTextColor="#3b5998"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        onPress={handleSignUp}
        style={styles.signupButton}
      >
        <Text style={styles.signupButtonText}>S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3b5998',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#3b5998',
    marginBottom: 15,
    padding: 10,
  },
  input: {
    flex: 1,
    color: '#3b5998',
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  signupButton: {
    marginTop: 20,
    backgroundColor: '#3b5998',
    padding: 10,
    borderRadius: 5,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignUpScreen;