import React from "react";
import { StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { Text, View } from "./Themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

const { width: screenWidth } = Dimensions.get("window");

interface XurItemCardProps {
  item: {
    itemName: string;
    itemDescription: string;
    itemIcon: string;
    rarity: string;
    costs: Array<{
      itemHash: number;
      quantity: number;
      hasConditionalVisibility: boolean;
    }>;
    itemHash: number;
    vendorItemIndex: number;
    quantity: number;
  };
  onPress: () => void;
}

const getRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case "exotic":
      return Colors.destiny.exotic;
    case "legendary":
      return "#522F9A";
    case "rare":
      return "#5076A3";
    case "uncommon":
      return "#366F3F";
    case "common":
      return "#C3BCDB";
    default:
      return Colors.destiny.primary;
  }
};

const getCurrencyName = (itemHash: number) => {
  switch (itemHash) {
    case 800069450:
      return "Strange Coins";
    case 2817410917:
      return "Glimmer";
    default:
      return "Unknown";
  }
};

const getCurrencyIcon = (itemHash: number) => {
  switch (itemHash) {
    case 800069450:
      return "currency-usd";
    case 2817410917:
      return "triangle";
    default:
      return "help-circle";
  }
};

export default function XurItemCard({ item, onPress }: XurItemCardProps) {
  const rarityColor = getRarityColor(item.rarity);
  const imageUri = `https://www.bungie.net${item.itemIcon}`;
  const isSpecialOffer =
    item.itemName.includes("Strange") || item.costs.length === 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.cardGradient, { borderColor: `${rarityColor}30` }]}>
        {/* Item Image */}
        <View style={[styles.imageContainer, { borderColor: rarityColor }]}>
          <Image
            source={{ uri: imageUri }}
            style={styles.itemImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={[`${rarityColor}00`, `${rarityColor}20`]}
            style={styles.imageOverlay}
          />
        </View>

        {/* Item Info */}
        <View style={styles.itemInfo}>
          <View style={styles.itemHeader}>
            <Text
              style={[styles.itemName, { color: rarityColor }]}
              numberOfLines={2}
            >
              {item.itemName}
            </Text>
            <View
              style={[
                styles.rarityBadge,
                { backgroundColor: `${rarityColor}20` },
              ]}
            >
              <Text style={[styles.rarityText, { color: rarityColor }]}>
                {item.rarity}
              </Text>
            </View>
          </View>

          {item.itemDescription && (
            <Text style={styles.itemDescription} numberOfLines={2}>
              {item.itemDescription}
            </Text>
          )}

          {/* Price */}
          <View style={styles.priceSection}>
            {item.costs.length > 0 ? (
              <View style={styles.priceContainer}>
                <MaterialCommunityIcons
                  name={getCurrencyIcon(item.costs[0].itemHash)}
                  size={16}
                  color={Colors.destiny.accent}
                />
                <Text style={styles.priceText}>
                  {item.costs[0].quantity}{" "}
                  {getCurrencyName(item.costs[0].itemHash)}
                </Text>
              </View>
            ) : (
              <Text style={styles.freeText}>Gratuit</Text>
            )}

            {isSpecialOffer && (
              <View style={styles.specialBadge}>
                <MaterialCommunityIcons
                  name="star"
                  size={12}
                  color={Colors.destiny.exotic}
                />
                <Text style={styles.specialText}>SPÉCIAL</Text>
              </View>
            )}
          </View>
        </View>

        {/* Tap indicator */}
        <View style={styles.tapIndicator}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={Colors.destiny.ghost}
            style={{ opacity: 0.5 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginHorizontal: 4,
  },
  cardGradient: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "rgba(15, 11, 31, 1)",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 3,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    position: "relative",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
    backgroundColor: "rgba(15, 11, 31, 1)",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
    backgroundColor: "transparent",
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  itemDescription: {
    fontSize: 12,
    color: Colors.destiny.ghost,
    opacity: 0.7,
    marginBottom: 8,
    lineHeight: 16,
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  priceText: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    fontWeight: "600",
    marginLeft: 4,
  },
  freeText: {
    fontSize: 14,
    color: Colors.destiny.primary,
    fontWeight: "600",
  },
  specialBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.destiny.exotic}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  specialText: {
    fontSize: 10,
    color: Colors.destiny.exotic,
    fontWeight: "bold",
    marginLeft: 2,
    letterSpacing: 0.5,
  },
  tapIndicator: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
