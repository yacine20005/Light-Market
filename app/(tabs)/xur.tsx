import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

export default function XurScreen() {
  // Simule si Xûr est présent ou non
  const isXurPresent = true; // À modifier selon la logique réelle
  const timeUntilXur = "2j 14h 32m"; // Exemple de compte à rebours

  if (!isXurPresent) {
    return (
      <ScrollView style={styles.container}>
        {/* Countdown Section */}
        <LinearGradient
          colors={["#522F9A", "#1E293B", "#522F9A"]}
          style={styles.countdownSection}
        >
          <View style={styles.countdownContent}>
            <MaterialCommunityIcons
              name="alien"
              size={64}
              color={Colors.destiny.accent}
              style={styles.alienIcon}
            />
            <Text style={styles.countdownTitle}>Xûr arrive dans</Text>
            <Text style={styles.countdownTime}>{timeUntilXur}</Text>
            <Text style={styles.countdownDescription}>
              L'Agent des Neuf reviendra avec de nouveaux équipements exotiques
            </Text>
          </View>
        </LinearGradient>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>À propos de Xûr</Text>
          <Text style={styles.infoText}>
            Xûr, Agent des Neuf, est un vendeur mystérieux qui apparaît dans
            Destiny 2 du vendredi 18h00 au mardi 18h00 (heure de Paris).
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Xur Present Section */}
      <LinearGradient
        colors={["#522F9A", "#1E293B", "#522F9A"]}
        style={styles.xurPresentSection}
      >
        <View style={styles.xurPresentContent}>
          <MaterialCommunityIcons
            name="alien"
            size={48}
            color={Colors.destiny.accent}
          />
          <Text style={styles.xurPresentTitle}>Xûr est présent !</Text>
          <Text style={styles.locationText}>📍 Tour de l'EDZ</Text>
          <Text style={styles.timeRemainingText}>Temps restant: 1j 8h 15m</Text>
        </View>
      </LinearGradient>

      {/* Inventory Section */}
      <View style={styles.inventorySection}>
        <Text style={styles.sectionTitle}>Inventaire de Xûr</Text>

        {/* Exotic Items */}
        <TouchableOpacity style={styles.itemCard}>
          <LinearGradient
            colors={["rgba(251, 191, 36, 0.2)", "rgba(251, 191, 36, 0.05)"]}
            style={styles.itemGradient}
          >
            <View style={styles.itemHeader}>
              <MaterialCommunityIcons
                name="shield-star"
                size={24}
                color={Colors.destiny.exotic}
              />
              <Text style={styles.itemName}>Casque Exotique</Text>
              <Text style={styles.itemPrice}>23 💎</Text>
            </View>
            <Text style={styles.itemDescription}>
              Casque avec perk unique pour Titans
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemCard}>
          <LinearGradient
            colors={["rgba(251, 191, 36, 0.2)", "rgba(251, 191, 36, 0.05)"]}
            style={styles.itemGradient}
          >
            <View style={styles.itemHeader}>
              <MaterialCommunityIcons
                name="pistol"
                size={24}
                color={Colors.destiny.exotic}
              />
              <Text style={styles.itemName}>Arme Exotique</Text>
              <Text style={styles.itemPrice}>29 💎</Text>
            </View>
            <Text style={styles.itemDescription}>
              Canon à main avec capacités spéciales
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.destiny.dark,
    paddingBottom: 80,
  },
  countdownSection: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    minHeight: 240,
    justifyContent: "center",
  },
  countdownContent: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  alienIcon: {
    marginBottom: 16,
    opacity: 0.9,
  },
  countdownTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    textAlign: "center",
    marginBottom: 8,
  },
  countdownTime: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.destiny.accent,
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 2,
  },
  countdownDescription: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    textAlign: "center",
    opacity: 0.8,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  xurPresentSection: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    minHeight: 160,
    justifyContent: "center",
  },
  xurPresentContent: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  xurPresentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: Colors.destiny.accent,
    textAlign: "center",
    marginBottom: 4,
  },
  timeRemainingText: {
    fontSize: 14,
    color: Colors.destiny.primary,
    textAlign: "center",
    opacity: 0.8,
  },
  inventorySection: {
    padding: 24,
    backgroundColor: "transparent",
  },
  infoSection: {
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
  infoText: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    lineHeight: 24,
    opacity: 0.8,
    textAlign: "center",
  },
  itemCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderWidth: 1,
    borderColor: `${Colors.destiny.exotic}30`,
  },
  itemGradient: {
    padding: 16,
    backgroundColor: "transparent",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    marginLeft: 12,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.destiny.exotic,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    opacity: 0.7,
    lineHeight: 20,
  },
});
