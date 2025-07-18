import {
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <LinearGradient
        colors={["#0F0F23", "#1E293B", "#0F0F23"]}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.title}>Light Market</Text>
          <Text style={styles.subtitle}>Vendor Checker</Text>
          <Text style={styles.description}>
            Consultez les inventaires des vendeurs en temps réel et trouvez les
            meilleurs équipements pour votre Gardien.
          </Text>
        </View>
      </LinearGradient>

      {/* Footer */}
      <View style={styles.footer}>
        <FontAwesome6 name="ghost" size={20} color={Colors.destiny.primary} />
        <Text style={styles.footerText}>
          Que la Lumière vous guide, Gardien
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.destiny.dark,
    paddingBottom: 80, // Espace pour les tabs
  },
  heroSection: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    minHeight: 240,
    justifyContent: "center",
  },
  heroContent: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },
  subtitle: {
    fontSize: 18,
    color: Colors.destiny.primary,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  description: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 8,
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  footer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  footerText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.destiny.ghost,
    fontStyle: "italic",
    opacity: 0.7,
  },
});
