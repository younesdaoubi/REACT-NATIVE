import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase'; // Importation des modules Firebase nécessaires
import { LinearGradient } from 'expo-linear-gradient'; // Utilisé pour le dégradé d'arrière-plan
import MapView, { Marker } from 'react-native-maps'; // Pour afficher la carte

const DetailPage = ({ route, navigation }) => {
  const post = route.params?.post;

  // Fonction pour vérifier si l'utilisateur actuel est l'auteur du post
  const isUserTheAuthor = () => post.userId && post.userId === auth.currentUser.uid;

  // Fonction pour supprimer un post
  const deletePost = (postId) => {
    const postRef = doc(db, 'real_estate_posts', postId);
    deleteDoc(postRef)
      .then(() => {
        console.log('Annonce supprimée avec succès');
        navigation.navigate('HomePage');
      })
      .catch(error => console.error('Erreur lors de la suppression de l\'annonce:', error));
  };

  if (!post) {
    return <View style={styles.centered}><Text>Post introuvable</Text></View>;
  }

  // Vérifier si les coordonnées du post sont valides
  const isValidCoordinates = post.coordinates && post.coordinates.lat && post.coordinates.lon && !isNaN(post.coordinates.lat) && !isNaN(post.coordinates.lon);


  return (
    <LinearGradient
      colors={['#3b5998', '#8b9dc3', '#dfe3ee']} // Utilisez le même dégradé que LoginPage
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>

          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.price}>Price: {post.price} €</Text>

          {post.images && (
            <Swiper style={styles.wrapper} showsButtons={true}>
              {post.images.map((imageUri, index) => (
                <View key={index} style={styles.slide}>
                  <Image source={{ uri: imageUri }} style={styles.image} />
                </View>
              ))}
            </Swiper>
          )}

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.description}>{post.description}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Details</Text>
            <Text style={styles.details}>Supeficie: {post.area} m²</Text>
            <Text style={styles.details}>Chambres: {post.bedrooms}</Text>
          </View>

          <View style={styles.contactContainer}>

            <Text style={styles.contactTitle}>Contact : {post.authorEmail}</Text>


          </View>

          {isUserTheAuthor() && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => deletePost(post.id)}>
              <Text style={styles.deleteButtonText}>Supprimer l'annonce</Text>
            </TouchableOpacity>
          )}

          {isValidCoordinates && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: parseFloat(post.coordinates.lat),
                longitude: parseFloat(post.coordinates.lon),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                coordinate={{
                  latitude: parseFloat(post.coordinates.lat),
                  longitude: parseFloat(post.coordinates.lon),
                }}
                title={post.title}
              />
            </MapView>
          )}

        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    margin: 15,
    color: '#3b5998', // Couleur du texte
  },
  price: {
    fontSize: 22,
    marginHorizontal: 15,
    marginBottom: 10,
    color: '#3b5998', 
  },
  // ... Autres styles inchangés
  descriptionContainer: {
    padding: 15, // Ajout de padding pour un meilleur espacement
    borderBottomWidth: 1, // Ligne de séparation
    borderBottomColor: '#eee', // Couleur de la ligne de séparation
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  detailsContainer: {
    padding: 15,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },

  /////

  wrapper: {
    height: 200,
    backgroundColor: 'transparent',
  },
  swiperButtonWrapper: {
    position: 'absolute',
    top: 0,
    height: 200,
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  slide: {
    flex: 1, // Changé à 1 pour s'assurer que la vue occupe tout l'espace disponible
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%', // Modifié pour occuper toute la hauteur disponible
    resizeMode: 'cover',
  },
  pagination: {
    position: 'absolute',
    bottom: 0, // Ajustez cette valeur pour positionner la pagination plus près des images
  },
  description: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  details: {
    fontSize: 14,
    marginHorizontal: 10,
    marginBottom: 10,
  },


  deleteButton: {
    backgroundColor: '#4267B2', // Style de bouton similaire à celui de LoginPage
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
  },
  deleteButtonText: {
    color: 'white',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  map: {
    height: 250, // Définissez la hauteur selon vos besoins
    width: '100%',
    marginVertical: 15,
  },
  contactContainer: {
    padding: 15,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  contactEmail: {
    fontSize: 16,
    color: '#4a90e2', // Vous pouvez choisir une couleur différente
  },
});

export default DetailPage;
