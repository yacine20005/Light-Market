import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

export default function VendorsScreen() {

  type Vendor = {
    id: string;
    name: string;
    location: string;
    status: string;
    icon: any; 
    color: string;
    specialty: string;
    description: string;
  };

  const vendors: Vendor[] = [
    {
      id: "banshee",
      name: "Banshee-44",
      location: "Tour",
      status: "Toujours disponible",
      icon: "hammer-wrench",
      color: Colors.destiny.secondary,
      specialty: "Armes & Mods",
      description: "Armes légendaires, mods et matériaux d'amélioration",
    },
    {
      id: "ada",
      name: "Ada-1",
      location: "Tour",
      status: "Toujours disponible",
      icon: "shield-star",
      color: Colors.destiny.success,
      specialty: "Mods d'Armure",
      description: "Mods d'armure et synthèse d'équipements",
    },
    {
      id: "zavala",
      name: "Commandant Zavala",
      location: "Tour",
      status: "Toujours disponible",
      icon: "shield-account",
      color: Colors.destiny.primary,
      specialty: "Avant-garde",
      description: "Équipements et récompenses de l'Avant-garde",
    },
    {
      id: "shaxx",
      name: "Lord Shaxx",
      location: "Tour",
      status: "Toujours disponible",
      icon: "sword-cross",
      color: Colors.destiny.secondary,
      specialty: "Creuset",
      description: "Équipements et récompenses du Creuset",
    },
    {
      id: "drifter",
      name: "Le Vagabond",
      location: "Tour",
      status: "Toujours disponible",
      icon: "coin",
      color: "#4A5D23",
      specialty: "Gambit",
      description: "Équipements et récompenses de Gambit",
    },
    {
      id: "saint14",
      name: "Saint-14",
      location: "Tour",
      status: "Toujours disponible",
      icon: "shield-plus",
      color: Colors.destiny.accent,
      specialty: "Épreuves",
      description: "Récompenses des Épreuves d'Osiris",
    },
    {
      id: "petra",
      name: "Petra Venj",
      location: "Cité Rêvée",
      status: "Toujours disponible",
      icon: "bow-arrow",
      color: "#8B5CF6",
      specialty: "Cité Rêvée",
      description: "Équipements de la Cité Rêvée",
    },
    {
      id: "variks",
      name: "Variks",
      location: "Europa",
      status: "Toujours disponible",
      icon: "snowflake",
      color: "#3B82F6",
      specialty: "Europa",
      description: "Équipements et améliorations d'Europa",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Tous les Vendeurs</Text>
        <Text style={styles.headerSubtitle}>
          Explorez tous les marchands de Destiny 2
        </Text>
      </View>

      {/* Vendors List */}
      <View style={styles.vendorsContainer}>
        {vendors.map((vendor) => (
          <TouchableOpacity key={vendor.id} style={styles.vendorCard}>
            <LinearGradient
              colors={[`${vendor.color}20`, `${vendor.color}05`]}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name={vendor.icon}
                  size={32}
                  color={vendor.color}
                />
                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName}>{vendor.name}</Text>
                  <Text style={styles.vendorLocation}>
                    📍 {vendor.location}
                  </Text>
                </View>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: Colors.destiny.success },
                    ]}
                  />
                  <Text style={styles.statusText}>En ligne</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.specialtyTag}>{vendor.specialty}</Text>
                <Text style={styles.vendorDescription}>
                  {vendor.description}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialCommunityIcons
                    name="eye"
                    size={16}
                    color={Colors.destiny.primary}
                  />
                  <Text style={styles.actionButtonText}>Voir l'inventaire</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Ionicons
                    name="heart-outline"
                    size={16}
                    color={Colors.destiny.ghost}
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer Note */}
      <View style={styles.footerNote}>
        <Ionicons
          name="information-circle"
          size={16}
          color={Colors.destiny.primary}
        />
        <Text style={styles.footerText}>
          Les inventaires sont mis à jour automatiquement
        </Text>
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
  headerSection: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.destiny.primary,
    textAlign: "center",
    opacity: 0.8,
  },
  vendorsContainer: {
    paddingHorizontal: 24,
    backgroundColor: "transparent",
  },
  vendorCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardGradient: {
    padding: 16,
    backgroundColor: "transparent",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  vendorInfo: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: "transparent",
  },
  vendorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    marginBottom: 2,
  },
  vendorLocation: {
    fontSize: 14,
    color: Colors.destiny.primary,
    opacity: 0.8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: Colors.destiny.success,
    fontWeight: "500",
  },
  cardContent: {
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  specialtyTag: {
    fontSize: 12,
    color: Colors.destiny.primary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  vendorDescription: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    opacity: 0.7,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(0, 212, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 212, 255, 0.3)",
  },
  actionButtonText: {
    fontSize: 12,
    color: Colors.destiny.primary,
    marginLeft: 6,
    fontWeight: "500",
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "transparent",
  },
  footerText: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    marginLeft: 8,
    opacity: 0.6,
  },
});
