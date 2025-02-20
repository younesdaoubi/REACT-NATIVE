import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, ScrollView, Image, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { db, auth } from './firebase'; // Importation des modules nécessaires depuis firebase
import { Icon } from 'react-native-elements';

// Composant pour le formulaire d'ajout de publication
export default function AddPostForm({ navigation }) {
  // États pour les différents champs du formulaire
  const [propertyType, setPropertyType] = useState('MAISON');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('1');
  const [imageUris, setImageUris] = useState([]);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const [addressSuggestions, setAddressSuggestions] = useState([]);

  // Fonctions de navigation
  const navigateToAddPostForm = () => navigation.navigate('AddPostForm');
  const navigateToProfilePage = () => navigation.navigate('ProfilePage');
  const navigateToHomePage = () => navigation.navigate('HomePage');

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('LoginPage');
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction de validation et de soumission du formulaire
  const validateAndSubmit = () => {
    if (title === '' || description === '' || price === '' || area === '' || imageUris.length === 0 || address === '') {
      Alert.alert('Erreur', 'Tous les champs doivent être complétés', [{ text: 'OK', style: { color: 'red' } }]);
      return;
    }
    handleSubmit();
  };

  // Fonction pour sélectionner une image
  const selectImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required !');
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.cancelled) {
      setImageUris(prev => {
        if (prev.length < 5) {
          return [...prev, pickerResult.uri];
        } else {
          alert('You can only upload up to 5 images.');
          return prev;
        }
      });
    }
  };

  // Fonction pour rechercher une adresse
  const searchAddress = (text) => {
    setAddress(text);
    if (text.length > 3) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&countrycodes=be`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setAddressSuggestions(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      setAddressSuggestions([]);
    }
  };

  // Fonction pour sélectionner une adresse depuis les suggestions
  const handleAddressSelect = (suggestion) => {
    setAddress(suggestion.display_name);
    setCoordinates({ lat: suggestion.lat, lon: suggestion.lon });
    setAddressSuggestions([]);
  };

  // Fonction pour soumettre les données du formulaire
  const handleSubmit = () => {
    const postRef = collection(db, 'real_estate_posts');
    const postData = {
      propertyType,
      title,
      description,
      price: parseFloat(price),
      area: parseFloat(area),
      bedrooms: parseInt(bedrooms),
      images: imageUris,
      address,
      coordinates,
      createdAt: new Date(),
      userId: auth.currentUser.uid,
      authorEmail: auth.currentUser.email
    };

    addDoc(postRef, postData)
      .then(() => {
        // Réinitialisez les états ici après l'ajout
        navigation.navigate('HomePage');
      })
      .catch((error) => {
        console.error('Error adding data to Firestore:', error);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          {imageUris.map((uri, index) => (
            <Image key={index} source={{ uri: uri }} style={styles.imagePreview} />
          ))}
        </View>
        <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
          <Text style={styles.imageButtonText}>Ajouter maximum 5 images</Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={propertyType}
            onValueChange={(itemValue, itemIndex) => setPropertyType(itemValue)}
            style={{ color: '#3b5998' }}>
            <Picker.Item label="Maison" value="MAISON" />
            <Picker.Item label="Appartement" value="APPARTEMENT" />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Titre"
            placeholderTextColor="#3b5998" 
            value={title}
            onChangeText={text => setTitle(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Entrer addresse"
            placeholderTextColor="#3b5998"
            value={address}
            onChangeText={searchAddress}
          />
          {addressSuggestions.map(suggestion => (
            <TouchableOpacity key={suggestion.place_id} onPress={() => handleAddressSelect(suggestion)}>
              <Text>{suggestion.display_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="#3b5998"
            value={description}
            onChangeText={text => setDescription(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Prix"
            placeholderTextColor="#3b5998"
            value={price}
            onChangeText={text => setPrice(text)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Superficie (m²)"
            placeholderTextColor="#3b5998"
            value={area}
            onChangeText={text => setArea(text)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={bedrooms}
            onValueChange={(value) => setBedrooms(value)}>
            {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
              <Picker.Item key={num} label={`${num} bedroom(s)`} value={num.toString()} />
            ))}
          </Picker>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={validateAndSubmit} style={styles.touchableButton}>
            <Text style={styles.buttonText}>Ajouter annonce</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.icon} onPress={navigateToHomePage}>
          <Icon name="home" type="font-awesome" size={30} color="#3b5998" />
          <Text>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon} onPress={navigateToAddPostForm}>
          <Icon name="plus-circle" type="font-awesome" size={30} color="#3b5998" />
          <Text>Ajouter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon} onPress={navigateToProfilePage}>
          <Icon name="user" type="font-awesome" size={30} color="#3b5998" />
          <Text>Profil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon} onPress={handleLogout}>
          <Icon name="sign-out" type="font-awesome" size={30} color="#3b5998" />
          <Text>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  scrollView: {
    width: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    padding: 16,
  },
  formContainer: {
    width: '100%',
  },
  imagePreview: {
    width: 100,
    height: 100,
    margin: 5,
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#3b5998',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#fff',
    color: '#3b5998',
  },
  imageButton: {
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
    backgroundColor: '#3b5998',
  },
  buttonText: {
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 50,
    width: '100%',
    backgroundColor: '#3b5998'
  },
  iconContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  touchableButton: {
    backgroundColor: '#3b5998', // Couleur de fond du bouton
    padding: 10,
    width: '100%',
    alignItems: 'center', // Pour centrer le texte dans le bouton
  },
  buttonText: {
    color: '#fff', // Couleur du texte en blanc
  },
  imageButton: {
    alignItems: 'center',
    justifyContent: 'center', // Centre le contenu verticalement et horizontalement
    marginTop: 16,
    width: '100%',
    backgroundColor: '#3b5998',
    padding: 10,
  },
  imageButtonText: {
    color: '#fff', // Texte blanc
    textAlign: 'center', // Centre le texte horizontalement
  },
});