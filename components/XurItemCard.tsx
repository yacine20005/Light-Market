import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { XurInventoryItem } from '@/services/api';

interface XurItemCardProps {
  item: XurInventoryItem;
  onPress?: () => void;
}

const getItemIcon = (itemType: number, itemSubType: number): string => {
  // Weapon types
  if (itemType === 3) {
    switch (itemSubType) {
      case 6: return 'pistol'; // Hand Cannon
      case 7: return 'pistol'; // Shotgun
      case 8: return 'pistol'; // Sniper Rifle
      case 9: return 'rifle'; // Fusion Rifle
      case 10: return 'rifle'; // Rocket Launcher
      case 11: return 'sword'; // Sword
      case 12: return 'bow-arrow'; // Bow
      case 13: return 'rifle'; // Auto Rifle
      case 14: return 'rifle'; // Pulse Rifle
      case 15: return 'rifle'; // Scout Rifle
      case 16: return 'pistol'; // Sidearm
      case 17: return 'rifle'; // Linear Fusion Rifle
      case 18: return 'rifle'; // Grenade Launcher
      case 19: return 'rifle'; // Submachine Gun
      case 20: return 'rifle'; // Trace Rifle
      case 21: return 'rifle'; // Machine Gun
      default: return 'rifle';
    }
  }
  
  // Armor types
  if (itemType === 2) {
    switch (itemSubType) {
      case 26: return 'shield'; // Helmet
      case 27: return 'shield-account'; // Gauntlets
      case 28: return 'shield-star'; // Chest Armor
      case 29: return 'shield-check'; // Leg Armor
      case 30: return 'shield-plus'; // Class Armor
      default: return 'shield';
    }
  }
  
  return 'star';
};

const getClassTypeLabel = (classType: number): string => {
  switch (classType) {
    case 0: return 'Titan';
    case 1: return 'Hunter';
    case 2: return 'Warlock';
    default: return 'Tous';
  }
};

const formatCosts = (costs: Array<{ itemHash: string; quantity: number }>): string => {
  if (!costs || costs.length === 0) return 'Gratuit';
  
  return costs.map(cost => {
    // Common currency hashes in Destiny 2
    switch (cost.itemHash) {
      case '3159615086': return `${cost.quantity} Legendary Shards`;
      case '2817410917': return `${cost.quantity} Bright Dust`;
      case '353932628': return `${cost.quantity} Enhancement Core`;
      default: return `${cost.quantity} Items`;
    }
  }).join(', ');
};

export default function XurItemCard({ item, onPress }: XurItemCardProps) {
  const iconName = getItemIcon(item.itemType, item.itemSubType);
  const classLabel = getClassTypeLabel(item.classType);
  const costLabel = formatCosts(item.costs);
  
  const rarityColor = item.rarity === 'Exotic' ? Colors.destiny.exotic : Colors.destiny.legendary;

  return (
    <TouchableOpacity style={styles.itemCard} onPress={onPress}>
      <LinearGradient
        colors={[
          `${rarityColor}20`,
          `${rarityColor}05`
        ]}
        style={styles.itemGradient}
      >
        <View style={styles.itemHeader}>
          <MaterialCommunityIcons
            name={iconName as any}
            size={24}
            color={rarityColor}
          />
          <View style={styles.itemInfo}>
            <Text style={[styles.itemName, { color: rarityColor }]}>
              {item.name}
            </Text>
            {item.classType !== 3 && (
              <Text style={styles.classLabel}>{classLabel}</Text>
            )}
          </View>
          <Text style={[styles.itemPrice, { color: rarityColor }]}>
            {costLabel}
          </Text>
        </View>
        
        <View style={styles.itemDetails}>
          <Text style={styles.rarityLabel}>{item.rarity}</Text>
          <Text style={styles.quantityLabel}>
            Quantité: {item.quantity}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  itemGradient: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  classLabel: {
    fontSize: 12,
    color: Colors.destiny.primary,
    opacity: 0.8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  rarityLabel: {
    fontSize: 12,
    color: Colors.destiny.accent,
    fontWeight: '600',
  },
  quantityLabel: {
    fontSize: 12,
    color: Colors.destiny.ghost,
    opacity: 0.7,
  },
});
