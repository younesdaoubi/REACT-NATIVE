// HomePage.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from './firebase'; // Importez l'instance Firestore à partir du fichier Firebase
import { collection, onSnapshot } from 'firebase/firestore';
import { CheckBox } from 'react-native-elements';

const HomePage = () => {

  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // Ordre de tri: 'asc' pour croissant, 'desc' pour décroissant
  const [isFilterModalVisible, setFilterModalVisible] = useState(false); // Contrôle la visibilité du modal de filtrage
  const [minPrice, setMinPrice] = useState(''); // Prix minimum pour le filtrage
  const [maxPrice, setMaxPrice] = useState(''); // Prix maximum pour le filtrage
  const [isHouseChecked, setIsHouseChecked] = useState(true); // Filtre pour les maisons
  const [isApartmentChecked, setIsApartmentChecked] = useState(true); // Filtre pour les appartements
  const [minBedrooms, setMinBedrooms] = useState(''); // Nombre minimum de chambres pour le filtrage
  const [maxBedrooms, setMaxBedrooms] = useState(''); // Nombre maximum de chambres pour le filtrage
  const [searchText, setSearchText] = useState(''); // Texte de recherche pour filtrer les posts

  const navigateToAddPostForm = () => {
    navigation.navigate('AddPostForm');
  };

  const navigateToProfilePage = () => {
    navigation.navigate('ProfilePage');
  };

  const navigateToDetailPage = (post) => {
    const serializablePost = {
      ...post,
      createdAt: post.createdAt.toISOString() // Convert to string
    };
    navigation.navigate('DetailPage', { post: serializablePost });
  };

  // Fonction pour changer l'ordre de tri
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const toggleFilterModal = () => {
    setFilterModalVisible(!isFilterModalVisible);
  };

  const applyFilters = () => {
    const minRooms = parseInt(minBedrooms, 10);
    const maxRooms = parseInt(maxBedrooms, 10);
    if (minRooms < 1 || minRooms > 15 || maxRooms < 1 || maxRooms > 15 || minRooms > maxRooms) {
      alert('Entrez des valeurs valides pour les chambres (entre 1 et 15).');
      return;
    }

    // Logique pour filtrer les posts en fonction de minPrice et maxPrice
    toggleFilterModal();
  };


  // Fonction mise à jour pour filtrer les posts
  const filterPosts = (posts) => {
    return posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(searchText.toLowerCase());
      const descriptionMatch = post.description.toLowerCase().includes(searchText.toLowerCase());
      const addressMatch = post.address.toLowerCase().includes(searchText.toLowerCase());
      return titleMatch || descriptionMatch || addressMatch;
    });
  };


  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('LoginPage');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const postRef = collection(db, 'real_estate_posts');

    const unsubscribe = onSnapshot(postRef, (snapshot) => {
      let updatedPosts = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
        };
      });

      // Filtrer les posts par prix
      if (minPrice !== '' || maxPrice !== '') {
        const minPriceNum = minPrice !== '' ? parseFloat(minPrice) : 0;
        const maxPriceNum = maxPrice !== '' ? parseFloat(maxPrice) : Number.MAX_VALUE;

        updatedPosts = updatedPosts.filter(post => {
          const price = parseFloat(post.price);
          return price >= minPriceNum && price <= maxPriceNum;
        });
      }


      // Dans filtrer nombre de chambre
      if (minBedrooms !== '' && maxBedrooms !== '') {
        const minRooms = parseInt(minBedrooms, 10);
        const maxRooms = parseInt(maxBedrooms, 10);

        updatedPosts = updatedPosts.filter(post => {
          const bedrooms = parseInt(post.bedrooms, 10);
          return bedrooms >= minRooms && bedrooms <= maxRooms;
        });
      }


      // Filtrer les posts par type de propriété
      if (isHouseChecked || isApartmentChecked) {
        updatedPosts = updatedPosts.filter(post => {
          return (isHouseChecked && post.propertyType === 'MAISON') ||
            (isApartmentChecked && post.propertyType === 'APPARTEMENT');
        });
      }

      // Tri des posts par date
      updatedPosts.sort((a, b) => {
        return sortOrder === 'asc' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
      });

      // Filtrez les posts après les avoir récupérés et traités
      setPosts(filterPosts(updatedPosts));
    });

    return () => unsubscribe();
  }, [sortOrder, minPrice, maxPrice, isHouseChecked, isApartmentChecked, minBedrooms, maxBedrooms, searchText]);



  return (
    <View style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>HelbImmo</Text>
        <TouchableOpacity style={styles.icon} onPress={toggleFilterModal}>
          <Icon name="filter" type="font-awesome" size={30} color="#3b5998" />
          <Text style={styles.postItemText}>Filtres</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchBar}
        onChangeText={setSearchText}
        value={searchText}
        placeholder="Rechercher par titre, description ou ville"
        placeholderTextColor="#3b5998"
      />

      <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
        <Text style={styles.sortButtonText}>Tri {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}</Text>
      </TouchableOpacity>

      <View style={styles.postList}>
        <FlatList
          data={posts}
          // ... autres props de FlatList ...
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.postItem} onPress={() => navigateToDetailPage(item)}>
              <View style={styles.postImageContainer}>
                {item.images && item.images.length > 0 && (
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.postImage}
                  />
                )}
              </View>
              <View style={styles.postDetails}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postDetail}>Prix: {item.price}</Text>
              <Text style={styles.postDetail}>Superficie: {item.area} m²</Text>
              <Text style={styles.postDetail}>Chambres: {item.bedrooms}</Text>
            </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.icon}>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Filtrer par prix</Text>
          <TextInput
            style={styles.input}
            onChangeText={setMinPrice}
            value={minPrice}
            placeholder="Prix min"
            placeholderTextColor="#3b5998"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            onChangeText={setMaxPrice}
            value={maxPrice}
            placeholder="Prix max"
            placeholderTextColor="#3b5998"
            keyboardType="numeric"
          />
          <View style={styles.checkboxContainer}>
            <CheckBox
              title="Maison"
              checked={isHouseChecked}
              onPress={() => setIsHouseChecked(!isHouseChecked)}
            />

            <CheckBox
              title="Appartement"
              checked={isApartmentChecked}
              onPress={() => setIsApartmentChecked(!isApartmentChecked)}
            />
          </View>

          <TextInput
            style={styles.input}
            onChangeText={text => setMinBedrooms(text)}
            value={minBedrooms}
            placeholder="Min chambres"
            placeholderTextColor="#3b5998"
            keyboardType="numeric"
            maxLength={2}
          />

          <TextInput
            style={styles.input}
            onChangeText={text => setMaxBedrooms(text)}
            value={maxBedrooms}
            placeholder="Max chambres"
            placeholderTextColor="#3b5998"
            keyboardType="numeric"
            maxLength={2}
          />

          <TouchableOpacity style={styles.button} onPress={applyFilters}>
            <Text style={styles.buttonText} >Appliquer</Text>
          </TouchableOpacity>

        </View>
      </Modal>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Couleur de fond blanc grisâtre très claire
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3b5998',
  },
  searchBar: {
    height: 40,
    borderColor: '#3b5998',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    width: '90%',
    color: '#3b5998',
    marginBottom: 20, // Espace supplémentaire entre la barre de recherche et le bouton de tri
    marginTop: 10,
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
    borderRadius: 10,
    flexDirection: 'row', // Aligner les éléments en ligne
  },
  postImage: {
    width: '100%', 
    height: 100,
    resizeMode: 'cover',
  },
  postImageContainer: {
    flex: 1, // Prend 1/3 de l'espace
    paddingRight: 10, // Ajouter un peu d'espace entre l'image et les détails
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
  },
  filterIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: '#8b9dc3',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  button: {
    backgroundColor: '#3b5998',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
  },
  checkbox: {
    alignSelf: "center",
    margin: 8,
  },
  picker: {
    height: 50,
    width: 150,
  },
  checkboxContainer: {
    flexDirection: 'row', // Aligner les éléments en ligne
    justifyContent: 'space-between', // Espacer équitablement les éléments
    width: '80%', // Largeur du conteneur
    alignItems: 'center', // Centrer les éléments verticalement
  },
  sortButton: {
    alignSelf: 'flex-start', // Alignement à gauche
    marginLeft: 20,
  },
  sortButtonText: {
    color: '#3b5998',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  postItemText: {
    color: '#3b5998',
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
});

export default HomePage;
