import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth'; // Pour écouter les changements d'état de l'authentification
import { db, auth } from './firebase'; // Importe l'authentification et la base de données Firebase
import { collection, query, where, onSnapshot } from 'firebase/firestore'; // Méthodes Firestore pour les requêtes
import { useNavigation } from '@react-navigation/native'; // Hook pour la navigation
import { LinearGradient } from 'expo-linear-gradient'; // Composant pour créer un dégradé
import { Icon } from 'react-native-elements'; // Bibliothèque d'icônes

const ProfilePage = () => {
  // États pour stocker l'utilisateur actuel et ses publications
  const [currentUser, setCurrentUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const navigation = useNavigation(); // Hook de navigation

 // useEffect pour écouter les changements d'état de l'authentification
 useEffect(() => {
  let unsubscribeFromFirestore = null; // Variable pour stocker la fonction de désinscription de Firestore

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user); // Mise à jour de l'utilisateur actuel
      unsubscribeFromFirestore = loadUserPosts(user.uid); // Chargement des publications de l'utilisateur et stockage de la fonction de désinscription
    } else {
      setCurrentUser(null); // Réinitialisation si l'utilisateur se déconnecte
      if (unsubscribeFromFirestore) {
        unsubscribeFromFirestore(); // Désinscription des écoutes Firestore
      }
    }
  });

  return () => {
    unsubscribe(); // Désinscription de l'écoute d'authentification lors du démontage du composant
    if (unsubscribeFromFirestore) {
      unsubscribeFromFirestore(); // Désinscription de Firestore lors du démontage du composant
    }
  };
}, []);

// Fonction pour charger les publications de l'utilisateur
const loadUserPosts = (userId) => {
  const postsRef = collection(db, 'real_estate_posts'); // Référence à la collection des publications
  const q = query(postsRef, where('userId', '==', userId)); // Création d'une requête pour filtrer les publications par userId

  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate() // Convertit la date Firestore en objet Date JavaScript
    }));
    setUserPosts(posts); // Mise à jour des publications de l'utilisateur dans l'état
  });
};
  

  // Fonctions pour la navigation vers différents écrans
  const navigateToAddPostForm = () => navigation.navigate('AddPostForm');
  const navigateToHomePage = () => navigation.navigate('HomePage');
  const navigateToProfilePage = () => navigation.navigate('ProfilePage');
  const navigateToDetailPage = (post) => {
    const serializablePost = {
      ...post,
      createdAt: post.createdAt.toISOString() // Convertit en chaîne pour la sérialisation
    };
    navigation.navigate('DetailPage', { post: serializablePost });
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('LoginPage');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LinearGradient
      colors={['#f5f5f5', '#f5f5f5', '#f5f5f5']} // Utilisez les mêmes couleurs que dans LoginPage.js
      style={{ flex: 1 }} // Appliquez le dégradé à tout le conteneur
    >
      <View style={styles.container}>
        <Text style={styles.title}>Profil Utilisateur</Text>
        {currentUser ? (
          <>
            <View style={styles.contactContainer}>
              <Text style={styles.contactHeader}>Contact Personnel :</Text>
              <Text style={styles.contactEmail}>{currentUser.email}</Text>
            </View>
            {userPosts.length > 0 && (
              <Text style={styles.sectionHeader}>Mes annonces :</Text>
            )}

            <View style={styles.postList}>
              <FlatList
                data={userPosts}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => navigateToDetailPage(item)}>
                    <View style={styles.postItem}>
                      <View style={styles.postImageContainer}>
                        {item.images && item.images.length > 0 && (
                          <Image source={{ uri: item.images[0] }} style={styles.postImage} />
                        )}
                      </View>
                      <View style={styles.postDetails}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postDetail}>Prix: {item.price}</Text>
              <Text style={styles.postDetail}>Superficie: {item.area} m²</Text>
              <Text style={styles.postDetail}>Chambres: {item.bedrooms}</Text>
            </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          </>
        ) : (
          <Text style={styles.notConnectedText}>Utilisateur non connecté</Text>
        )}
      </View>

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


    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  title: {
    marginTop: '10%',
    fontSize: 24,
    color: '#3b5998',
  },
  contactContainer: {
    alignSelf: 'flex-start', // Aligner à gauche
    marginTop: 60, // Ajuster selon l'espacement souhaité en dessous du titre
    marginLeft: 20, // Alignement à gauche dans le conteneur
  },
  postDetails: {
    flex: 2, // Prend 2/3 de l'espace
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'#3b5998',
  },
  postDetail: {
    fontSize: 14,
    color: '#3b5998',
  },
  contactHeader: {
    fontSize: 22, // Taille de police plus grande
    fontWeight: 'bold',
    color: '#3b5998', // Texte blanc
    marginBottom: 5, // Ajustez l'espacement selon vos besoins
  },
  contactEmail: {
    fontSize: 20, // Taille de police pour l'email
    color: '#3b5998', // Texte blanc
    marginBottom: 20, // Ajustez l'espacement selon vos besoins
  },
  postList: {
    flex: 3,
    width: '100%',
    padding: 20,
  },
  postItem: {
    marginBottom: 20,
    borderColor: '#3b5998',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10, // Ajoutez cette ligne pour arrondir les coins
    flexDirection: 'row', // Aligner les éléments en ligne
    backgroundColor: 'transparent',
  },
  iconContainer: {
      position: 'absolute',
      bottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      paddingHorizontal: 10,
    },
  postImage: {
    width: '100%', // Utilise toute la largeur du conteneur
    height: 100, // Hauteur de l'image
    resizeMode: 'cover', // Couvre la zone sans déformer l'image
    marginBottom: 10, // Espace en dessous de l'image

  },
  postImageContainer: {
    flex: 1, // Prend 1/3 de l'espace
    // autres styles spécifiques à l'image, si nécessaire
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  icon: {
    alignItems: 'center',
  },
  postDetails: {
    flex: 2, // Prend 2/3 de l'espace
    paddingLeft: 10, // Ajoutez un peu d'espace entre l'image et le texte
    // autres styles spécifiques aux détails, si nécessaire
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b5998',
    marginTop: 60,
    marginBottom: 10, // Espacement avant la liste des annonces
    paddingLeft: 20, // Alignement avec le contenu de la liste
    //marginTop: '50%', // Cela déplace la section vers le bas à la moitié de l'écran
  },
  postDetails: {
    flex: 2,
    paddingLeft: 10,
    color: '#3b5998', // Texte blanc
  },
  notConnectedText: {
    color: '#3b5998', // Texte blanc pour "Utilisateur non connecté"
  },
  postItemText: {
    color: '#3b5998',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
});

export default ProfilePage;




