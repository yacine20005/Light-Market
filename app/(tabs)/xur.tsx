import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { useXur } from "@/hooks/useXur";
import XurItemCard from "@/components/XurItemCard";
import XurItemModal from "@/components/XurItemModal";

export default function XurScreen() {
  const insets = useSafeAreaInsets();
  const {
    xurData,
    isLoading,
    error,
    isXurPresent,
    timeUntilXur,
    refreshXurData,
  } = useXur();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.destiny.accent} />
        <Text style={styles.loadingText}>Loading Xûr's data...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
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
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshXurData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Show countdown when Xur is not present
  if (!isXurPresent) {
    return (
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
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
          colors={["#1A0B2E", "#2D1B69", "#0F0B1F"]}
          style={styles.countdownSection}
        >
          <View style={styles.countdownContent}>
            <View style={styles.alienIconContainer}>
              <MaterialCommunityIcons
                name="alien"
                size={80}
                color="#8B5CF6"
                style={styles.alienIcon}
              />
              <View style={styles.alienGlow} />
            </View>
            <Text style={styles.countdownTitle}>🚀 Xûr arrives in 🚀</Text>

            {/* Modern Time Display */}
            <View style={styles.timeContainer}>
              <LinearGradient
                colors={["#8B5CF620", "#8B5CF650", "#8B5CF620"]}
                style={styles.timeCard}
              >
                <Text style={styles.countdownTime}>{timeUntilXur}</Text>
                <View style={styles.timeGlow} />
              </LinearGradient>
            </View>

            <Text style={styles.countdownDescription}>
              The Agent of the Nine will return with new exotic equipment
            </Text>

            {/* Decorative elements */}
            <View style={styles.decorativeContainer}>
              <View style={styles.decorativeLine} />
              <MaterialCommunityIcons
                name="rhombus-split"
                size={16}
                color="#8B5CF6"
                style={{ opacity: 0.7 }}
              />
              <View style={styles.decorativeLine} />
            </View>
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

  // Xur is present - show inventory
  const saleItems = xurData?.sales?.saleItems
    ? Object.values(xurData.sales.saleItems)
    : [];

  // Filter exotic items (exclude Xenology and other Strange items)
  const exoticItems = saleItems.filter((item) => {
    return (
      item.rarity === "Exotic" &&
      !item.itemName.includes("Strange") &&
      !item.itemName.includes("Xenology")
    );
  });

  // Filter special offers by excluding unnecessary links and duplicates

  const filteredSpecialOffers = saleItems.filter((item) => {
    const name = item.itemName.toLowerCase();

    // Exclude unnecessary navigation links in Xur's menu
    const excludedLinks = [
      "more strange offers",
      "strange gear offers",
      "more strange gear",
      "strange offers",
    ];

    // Check if the item is a link to exclude
    const isExcludedLink = excludedLinks.some((link) => name.includes(link));
    if (isExcludedLink) {
      return false;
    }

    // Include Xenology, other Strange items and free items
    return (
      item.itemName.includes("Strange") ||
      item.itemName.includes("Xenology") ||
      item.costs.length === 0
    );
  });

  // Remove duplicates based on item name
  const specialOffers = filteredSpecialOffers.filter((item, index, array) => {
    // Find the first item with the same name
    const firstOccurrenceIndex = array.findIndex(
      (otherItem) => otherItem.itemName === item.itemName
    );
    // Keep only if it's the first occurrence
    return firstOccurrenceIndex === index;
  });

  return (
    <>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshXurData}
            tintColor={Colors.destiny.accent}
          />
        }
      >
        {/* Xur Present Header */}
        <LinearGradient
          colors={["#1A0B2E", "#2D1B69", "#0F0B1F"]}
          style={styles.headerSection}
        >
          <View style={styles.headerContent}>
            <View style={styles.xurPresentIconContainer}>
              <MaterialCommunityIcons name="alien" size={64} color="#8B5CF6" />
              <View style={styles.xurPresentGlow} />
            </View>
            <Text style={styles.xurPresentTitle}>Xûr is here!</Text>
            <Text style={styles.xurDescription}>
              {xurData?.vendor?.description ||
                "A peddler of strange curios, Xûr's motives are not his own."}
            </Text>

            {/* Modern Countdown for Xur Present */}
            <View style={styles.xurPresentCountdownContainer}>
              <Text style={styles.xurPresentCountdownLabel}>
                ⏰ Departure in
              </Text>
              <LinearGradient
                colors={["#D4AF3720", "#D4AF3750", "#D4AF3720"]}
                style={styles.xurPresentTimeCard}
              >
                <Text style={styles.xurPresentCountdownTime}>
                  {timeUntilXur}
                </Text>
                <View style={styles.xurPresentTimeGlow} />
              </LinearGradient>
              <Text style={styles.xurPresentCountdownSubtext}>
                Don't miss out on these exotic treasures!
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Subtle transition gradient */}
        <LinearGradient
          colors={["#0F0B1F", Colors.destiny.dark + "20", Colors.destiny.dark]}
          style={styles.subtleTransition}
        />

        {/* Exotic Items Section */}
        {exoticItems.length > 0 && (
          <LinearGradient
            colors={[
              Colors.destiny.dark,
              Colors.destiny.dark + "90",
              Colors.destiny.dark,
            ]}
            style={styles.inventorySection}
          >
            <Text style={styles.sectionTitle}>Exotic Equipment</Text>
            <Text style={styles.sectionSubtitle}>
              {exoticItems.length} item{exoticItems.length > 1 ? "s" : ""}{" "}
              available
            </Text>
            {exoticItems.map((item, index) => (
              <XurItemCard
                key={`exotic-${index}`}
                item={item}
                onPress={() => handleItemPress(item)}
              />
            ))}
          </LinearGradient>
        )}

        {/* Special Offers Section */}
        {specialOffers.length > 0 && (
          <LinearGradient
            colors={[
              Colors.destiny.dark,
              Colors.destiny.dark + "60",
              Colors.destiny.dark,
            ]}
            style={[styles.inventorySection, { paddingBottom: 60 }]}
          >
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <Text style={styles.sectionSubtitle}>
              Quests and access to extended offers
            </Text>
            {specialOffers.map((item, index) => (
              <XurItemCard
                key={`special-${index}`}
                item={item}
                onPress={() => handleItemPress(item)}
              />
            ))}
          </LinearGradient>
        )}
      </ScrollView>

      {/* Item Detail Modal */}
      <XurItemModal
        visible={modalVisible}
        onClose={closeModal}
        item={selectedItem}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.destiny.dark,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.destiny.dark,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "transparent",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    textAlign: "center",
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
    fontWeight: "bold",
    color: Colors.destiny.dark,
  },
  countdownSection: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
    minHeight: 320,
    justifyContent: "center",
  },
  countdownContent: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  alienIconContainer: {
    position: "relative",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  alienIcon: {
    marginBottom: 0,
    opacity: 1,
    zIndex: 2,
  },
  alienGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#8B5CF6",
    opacity: 0.25,
    transform: [{ translateX: -60 }, { translateY: -60 }],
    zIndex: 1,
  },
  countdownTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 1,
  },
  timeContainer: {
    marginBottom: 24,
    position: "relative",
  },
  timeCard: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#8B5CF680",
    position: "relative",
    overflow: "hidden",
  },
  countdownTime: {
    fontSize: 42,
    fontWeight: "900",
    color: "#8B5CF6",
    textAlign: "center",
    letterSpacing: 3,
    textShadowColor: "#8B5CF680",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  timeGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
    backgroundColor: "#8B5CF6",
    opacity: 0.08,
  },
  countdownDescription: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    textAlign: "center",
    opacity: 0.9,
    paddingHorizontal: 20,
    lineHeight: 24,
    marginBottom: 20,
  },
  decorativeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginTop: 8,
  },
  decorativeLine: {
    width: 40,
    height: 1,
    backgroundColor: "#8B5CF6",
    opacity: 0.5,
    marginHorizontal: 12,
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
  xurDescription: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    textAlign: "center",
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 20,
    fontStyle: "italic",
    opacity: 0.9,
    lineHeight: 22,
  },
  timeRemainingText: {
    fontSize: 14,
    color: Colors.destiny.primary,
    textAlign: "center",
    opacity: 0.8,
  },
  headerSection: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    minHeight: 200,
    justifyContent: "center",
  },
  headerContent: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  refreshText: {
    fontSize: 12,
    color: Colors.destiny.ghost,
    textAlign: "center",
    opacity: 0.6,
    marginTop: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    opacity: 0.7,
    marginBottom: 16,
    textAlign: "center",
  },
  inventorySection: {
    padding: 24,
    backgroundColor: "transparent",
    marginTop: 0, // No overlap for clean separation
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
    alignItems: "center",
    padding: 32,
    backgroundColor: "transparent",
  },
  noItemsText: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    opacity: 0.7,
    marginTop: 16,
    textAlign: "center",
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

  // Xur Present Countdown Styles
  xurPresentIconContainer: {
    alignItems: "center",
    position: "relative",
    marginBottom: 20,
  },
  xurPresentGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#8B5CF6",
    opacity: 0.3,
    zIndex: -1,
  },
  xurPresentCountdownContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 16,
  },
  xurPresentCountdownLabel: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    marginBottom: 12,
    fontWeight: "500",
    opacity: 0.9,
  },
  xurPresentTimeCard: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    position: "relative",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#D4AF3760",
  },
  xurPresentCountdownTime: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D4AF37",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  xurPresentTimeGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: "#D4AF37",
    opacity: 0.12,
    zIndex: -1,
  },
  xurPresentCountdownSubtext: {
    fontSize: 12,
    color: Colors.destiny.ghost,
    opacity: 0.7,
    textAlign: "center",
    fontStyle: "italic",
  },

  // Subtle transition style
  subtleTransition: {
    height: 40,
    backgroundColor: "transparent",
  },
});
