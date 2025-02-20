import React from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Onboarding from 'react-native-onboarding-swiper';

const Dots = ({ selected }) => {
  let backgroundColor;
  backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';

  return (
    <View style={{
      width: 5,
      height: 5,
      marginHorizontal: 3,
      backgroundColor
    }}
    />
  );
}

const Skip = ({ ...props }) => (
  <Button title='passer' color="#3b5998" />
);

const Next = ({ ...props }) => (
  <Button title='suivant ' color="#3b5998" {...props} />
);

const Done = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
    <Text style={{ fontSize: 16, color:"#3b5998" }}>Fin</Text>
  </TouchableOpacity>
);

const OnboardingScreen = () => {
  const navigation = useNavigation();

  return (
    <Onboarding
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      DotComponent={Dots}
      onSkip={() => navigation.replace("Login")}
      onDone={() => navigation.navigate("Login")}
      pages={[
        {
          backgroundColor: '#F5F5F5',
          image: <Image source={require('../assets/blackHouse.png')} style={styles.image} />,
          title: 'Bienvenue dans la nouvelle application de vente immobilière belge',
          
          titleStyles: styles.title,
          subTitleStyles: styles.subtitle,
        },
        {
          backgroundColor: '#F5F5F5',
          image: <Image source={require('../assets/redHouse.jpg')} style={styles.image} />,
          title: 'Poste a n\'importe quel moment, un bien immobilier à vendre.',
          subtitle: 'Crée un comtpe afin de te connecter et pouvoir naviguer dans l\'application !',
          titleStyles: styles.title,
          subTitleStyles: styles.subtitle,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300, // Largeur de l'image
    height: 300, // Hauteur de l'image
    resizeMode: 'contain' // S'assurer que l'image est bien ajustée
  },
  title: {
    fontSize: 22,
    color: '#3b5998', // Couleur du titre
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#3b5998', // Couleur du sous-titre
    textAlign: 'center',
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OnboardingScreen;
