import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { app } from './firebase';
import { getAuth, signInWithEmailAndPassword, AuthErrorCodes } from 'firebase/auth';
import { Icon } from 'react-native-elements'; // Assurez-vous d'avoir installé react-native-elements

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

 
  const handleLogin = async () => {
    if (!isMounted) return;

        try {
          const auth = getAuth(app);
          await signInWithEmailAndPassword(auth, email, password);
          // La connexion a réussi, vous pouvez rediriger l'utilisateur vers la page d'accueil ou effectuer d'autres actions nécessaires.
          navigation.navigate('HomePage'); // Rediriger l'utilisateur vers la page d'accueil après la connexion.

        } catch (error) {
          console.error(error);
          if (error.code === AuthErrorCodes.INVALID_EMAIL || error.code === AuthErrorCodes.INVALID_PASSWORD) {
            setError("L'adresse e-mail ou le mot de passe est incorrect.");
          } else {
            setError("Une erreur s'est produite lors de la connexion.");
          }
        }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

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

      <Button
        title="Se connecter"
        onPress={handleLogin}
        color="#4267B2" // Changement de la couleur du bouton
      />

      <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
        <Text style={styles.signupText}>Pas encore de compte ? inscrivez-vous gratuitement</Text>
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
    backgroundColor: '#F5F5F5',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#3b5998', // Bleu ciel en arrière-plan
    marginTop: 20, // Marge ajoutée au-dessus du bouton
  },
  loginButtonText: {
    color: 'white', // Texte en blanc
    fontSize: 16, // Taille de police augmentée
  },
  signupText: {
    marginTop: 10, // Marge ajoutée au-dessus du texte du lien
    color: '#3b5998', // Couleur du texte bleu
    textDecorationLine: 'underline', // Souligner le texte pour indiquer que c'est un lien
  },
  title: {
    fontSize: 30, // Agrandissement du titre
    fontWeight: 'bold', // Rendre le titre gras
    color: '#3b5998', // Changement de couleur pour le contraste
    marginBottom: 30, // Augmentation de la marge
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#3b5998', // Changement de la couleur de la bordure
    marginBottom: 15,
    padding: 10,
  },
  input: {
    flex: 1,
    color: '#3b5998', // Changement de la couleur du texte
    marginLeft: 10, // Ajout d'un peu d'espace entre l'icône et le texte
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  signupText: {
    marginTop: 20,
    color: '#3b5998',
    textDecorationLine: 'underline',
  },

});
export default LoginPage;

