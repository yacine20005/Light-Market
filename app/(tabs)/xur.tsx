import { StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { Text, View } from "@/components/Themed";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { useXur } from "@/hooks/useXur";
import XurItemCard from "@/components/XurItemCard";

export default function XurScreen() {
  const { xurData, isLoading, error, isXurPresent, timeUntilXur, refreshXurData } = useXur();

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.destiny.accent} />
        <Text style={styles.loadingText}>Chargement des données de Xûr...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshXurData}
            tintColor={Colors.destiny.accent}
          />
        }
      >
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={64}
            color="#ef4444"
          />
          <Text style={styles.errorTitle}>Erreur</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshXurData}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (!isXurPresent) {
    return (
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshXurData}
            tintColor={Colors.destiny.accent}
          />
        }
      >
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
            <Text style={styles.countdownTitle}>Xûr arrives in</Text>
            <Text style={styles.countdownTime}>{timeUntilXur}</Text>
            <Text style={styles.countdownDescription}>
              The Agent of the Nine will return with new exotic equipment
            </Text>
          </View>
        </LinearGradient>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>About Xûr</Text>
          <Text style={styles.infoText}>
            Xûr, Agent of the Nine, is a mysterious vendor who appears in
            Destiny 2 from Friday 6:00 PM to Tuesday 6:00 PM (Paris time).
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshXurData}
          tintColor={Colors.destiny.accent}
        />
      }
    >
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
          <Text style={styles.locationText}>📍 Quelque part dans le système</Text>
          <Text style={styles.timeRemainingText}>Temps restant: {timeUntilXur}</Text>
        </View>
      </LinearGradient>

      {/* Inventory Section */}
      <View style={styles.inventorySection}>
        <Text style={styles.sectionTitle}>Inventaire de Xûr</Text>

        {xurData?.sales?.saleItems ? (
          Object.entries(xurData.sales.saleItems).map(([key, item]) => (
            <XurItemCard
              key={key}
              item={item}
              onPress={() => {
                // TODO: Open item detail modal
                console.log('Item pressed:', item.name);
              }}
            />
          ))
        ) : (
          <View style={styles.noItemsContainer}>
            <MaterialCommunityIcons
              name="package-variant"
              size={48}
              color={Colors.destiny.primary}
              style={{ opacity: 0.5 }}
            />
            <Text style={styles.noItemsText}>
              Aucun objet disponible pour le moment
            </Text>
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.destiny.dark,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'transparent',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.destiny.ghost,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.destiny.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.destiny.dark,
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
  noItemsContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'transparent',
  },
  noItemsText: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    opacity: 0.7,
    marginTop: 16,
    textAlign: 'center',
  },
  // Legacy styles for backward compatibility (can be removed if not used)
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
