import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";
import { Text, View } from "@/components/Themed";
import {
  FontAwesome6,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
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

      {/* Quick Access Cards */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Vendeurs Actifs</Text>

        {/* Xûr Card */}
        <TouchableOpacity style={[styles.vendorCard, styles.xurCard]}>
          <LinearGradient
            colors={["rgba(147, 51, 234, 0.2)", "rgba(147, 51, 234, 0.05)"]}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="alien"
                size={32}
                color={Colors.destiny.accent}
              />
              <View style={styles.vendorInfo}>
                <Text style={styles.vendorName}>Xûr, Agent des Neuf</Text>
                <Text style={styles.vendorStatus}>• Présent jusqu'à mardi</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>
              Équipements exotiques et objets rares en échange de Fragments
              d'Éclat étrange.
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Banshee Card */}
        <TouchableOpacity style={[styles.vendorCard, styles.bansheeCard]}>
          <LinearGradient
            colors={["rgba(255, 107, 53, 0.2)", "rgba(255, 107, 53, 0.05)"]}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="hammer-wrench"
                size={32}
                color={Colors.destiny.secondary}
              />
              <View style={styles.vendorInfo}>
                <Text style={styles.vendorName}>Banshee-44</Text>
                <Text style={styles.vendorStatus}>• Toujours disponible</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>
              Armes légendaires, mods et matériaux d'amélioration pour votre
              arsenal.
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Ada-1 Card */}
        <TouchableOpacity style={[styles.vendorCard, styles.adaCard]}>
          <LinearGradient
            colors={["rgba(16, 185, 129, 0.2)", "rgba(16, 185, 129, 0.05)"]}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="shield-star"
                size={32}
                color={Colors.destiny.success}
              />
              <View style={styles.vendorInfo}>
                <Text style={styles.vendorName}>Ada-1</Text>
                <Text style={styles.vendorStatus}>• Toujours disponible</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>
              Mods d'armure et synthèse d'équipements pour optimiser vos builds.
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Fonctionnalités</Text>

        <View style={styles.featuresGrid}>
          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="refresh" size={28} color={Colors.destiny.primary} />
            <Text style={styles.featureTitle}>Mise à jour auto</Text>
            <Text style={styles.featureText}>
              Inventaires actualisés en temps réel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <MaterialCommunityIcons
              name="database-search"
              size={28}
              color={Colors.destiny.primary}
            />
            <Text style={styles.featureTitle}>Analyse des Rolls</Text>
            <Text style={styles.featureText}>
              Décryptage des perks détaillé
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <Ionicons
              name="notifications"
              size={28}
              color={Colors.destiny.primary}
            />
            <Text style={styles.featureTitle}>Alertes</Text>
            <Text style={styles.featureText}>
              Notification des bonnes affaires
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <MaterialCommunityIcons
              name="chart-line"
              size={28}
              color={Colors.destiny.primary}
            />
            <Text style={styles.featureTitle}>Historique</Text>
            <Text style={styles.featureText}>Suivi des inventaires passés</Text>
          </TouchableOpacity>
        </View>
      </View>

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
  sectionContainer: {
    padding: 24,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  vendorCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  xurCard: {
    borderColor: `${Colors.destiny.accent}30`,
  },
  bansheeCard: {
    borderColor: `${Colors.destiny.secondary}30`,
  },
  adaCard: {
    borderColor: `${Colors.destiny.success}30`,
  },
  cardGradient: {
    padding: 20,
    backgroundColor: "transparent",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  vendorInfo: {
    marginLeft: 16,
    flex: 1,
    backgroundColor: "transparent",
  },
  vendorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    marginBottom: 4,
  },
  vendorStatus: {
    fontSize: 14,
    color: Colors.destiny.primary,
    fontWeight: "500",
  },
  cardDescription: {
    fontSize: 15,
    color: Colors.destiny.ghost,
    lineHeight: 22,
    opacity: 0.8,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  featureCard: {
    width: "48%",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  featureText: {
    fontSize: 13,
    color: Colors.destiny.ghost,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 18,
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
