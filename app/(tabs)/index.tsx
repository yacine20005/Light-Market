import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function HomeScreen() {
  return (
    <ScrollView style={{ backgroundColor: 'transparent' }}>
      <View style={styles.header}>
        <Text style={styles.title}>Spark Love</Text>
        <Text style={styles.subtitle}>Renforcez votre connexion, un quiz à la fois.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quiz du Jour</Text>
        <Text style={styles.cardText}>Découvrez quelque chose de nouveau sur votre partenaire aujourd'hui.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Commencer le Quiz</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Défis en Couple</Text>
        <Text style={styles.cardText}>Relevez des défis amusants et créez des souvenirs inoubliables.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Voir les Défis</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <FontAwesome name="heart" size={24} color="#FFACAC" />
        <Text style={styles.footerText}>Fait avec amour</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  cardText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#F7374F',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  footerText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});
