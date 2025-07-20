import React from "react";
import {
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

const { width: screenWidth } = Dimensions.get("window");

interface XurItemModalProps {
  visible: boolean;
  onClose: () => void;
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
    classType?: number;
    supportedClasses?: string[];
  } | null;
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
      return "Unknown Currency";
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

const getClassIcon = (className: string) => {
  switch (className.toLowerCase()) {
    case "titan":
      return "shield";
    case "hunter":
      return "target";
    case "warlock":
      return "creation";
    default:
      return "help-circle";
  }
};

const getClassColor = (className: string) => {
  switch (className.toLowerCase()) {
    case "titan":
      return "#FF6B35"; // Orange/rouge pour Titan
    case "hunter":
      return "#00D4FF"; // Bleu pour Hunter
    case "warlock":
      return "#9333EA"; // Violet pour Warlock
    default:
      return Colors.destiny.ghost;
  }
};

export default function XurItemModal({
  visible,
  onClose,
  item,
}: XurItemModalProps) {
  if (!item) return null;

  const rarityColor = getRarityColor(item.rarity);
  const imageUri = `https://www.bungie.net${item.itemIcon}`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={[Colors.destiny.dark, "#1E293B", Colors.destiny.dark]}
        style={styles.modalContainer}
      >
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.destiny.ghost} />
            </TouchableOpacity>
          </View>

          {/* Item Image and Basic Info */}
          <View style={styles.itemSection}>
            <View style={[styles.imageContainer, { borderColor: rarityColor }]}>
              <Image
                source={{ uri: imageUri }}
                style={styles.itemImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={[`${rarityColor}20`, `${rarityColor}40`]}
                style={styles.imageOverlay}
              />
            </View>

            <Text style={[styles.itemName, { color: rarityColor }]}>
              {item.itemName}
            </Text>

            <View
              style={[
                styles.rarityBadge,
                { backgroundColor: `${rarityColor}20` },
              ]}
            >
              <Text style={[styles.rarityText, { color: rarityColor }]}>
                {item.rarity.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Description */}
          {item.itemDescription && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{item.itemDescription}</Text>
            </View>
          )}

          {/* Classes supportées */}
          {item.supportedClasses && item.supportedClasses.length > 0 && (
            <View style={styles.classesSection}>
              <Text style={styles.sectionTitle}>Classes supportées</Text>
              <View style={styles.classesGrid}>
                {item.supportedClasses.map((className, index) => (
                  <View
                    key={index}
                    style={[
                      styles.classCard,
                      {
                        backgroundColor: `${getClassColor(className)}20`,
                        borderColor: `${getClassColor(className)}60`,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={getClassIcon(className)}
                      size={24}
                      color={getClassColor(className)}
                    />
                    <Text
                      style={[
                        styles.classCardText,
                        { color: getClassColor(className) },
                      ]}
                    >
                      {className}
                    </Text>
                  </View>
                ))}
              </View>
              {item.supportedClasses.length === 3 && (
                <Text style={styles.allClassesNote}>
                  ✨ Cet objet exotique est disponible pour toutes les classes !
                </Text>
              )}
            </View>
          )}

          {/* Price Information */}
          <View style={styles.priceSection}>
            <Text style={styles.sectionTitle}>Prix</Text>
            {item.costs.length > 0 ? (
              item.costs.map((cost, index) => (
                <View key={index} style={styles.costItem}>
                  <MaterialCommunityIcons
                    name={getCurrencyIcon(cost.itemHash)}
                    size={24}
                    color={Colors.destiny.accent}
                  />
                  <Text style={styles.costText}>
                    {cost.quantity} {getCurrencyName(cost.itemHash)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.freeText}>Gratuit</Text>
            )}
          </View>

          {/* Item Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Détails</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hash d'objet:</Text>
              <Text style={styles.detailValue}>{item.itemHash}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Index vendeur:</Text>
              <Text style={styles.detailValue}>{item.vendorItemIndex}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Quantité:</Text>
              <Text style={styles.detailValue}>{item.quantity}</Text>
            </View>
          </View>

          {/* Special Notes */}
          {item.itemName.includes("Strange") && (
            <View style={styles.noteSection}>
              <MaterialCommunityIcons
                name="information"
                size={20}
                color={Colors.destiny.accent}
              />
              <Text style={styles.noteText}>
                Cet objet donne accès à d'autres offres spéciales de Xûr
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    paddingTop: 50,
    backgroundColor: "transparent",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  itemSection: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "transparent",
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 3,
    overflow: "hidden",
    marginBottom: 16,
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
  itemName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  rarityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  descriptionSection: {
    padding: 24,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    lineHeight: 24,
    opacity: 0.8,
  },
  priceSection: {
    padding: 24,
    backgroundColor: "transparent",
  },
  costItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  costText: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    marginLeft: 8,
    fontWeight: "600",
  },
  freeText: {
    fontSize: 16,
    color: Colors.destiny.primary,
    fontWeight: "600",
  },
  detailsSection: {
    padding: 24,
    backgroundColor: "transparent",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    fontWeight: "600",
  },
  noteSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    margin: 24,
    padding: 16,
    backgroundColor: "rgba(0, 212, 255, 0.1)",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.destiny.accent,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: Colors.destiny.ghost,
    marginLeft: 8,
    lineHeight: 20,
  },
  classesSection: {
    padding: 24,
    backgroundColor: "transparent",
  },
  classesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    backgroundColor: "transparent",
    marginBottom: 16,
  },
  classCard: {
    flex: 1,
    minWidth: 80,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  classCardText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  allClassesNote: {
    fontSize: 14,
    color: Colors.destiny.primary,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.9,
    lineHeight: 20,
  },
});
