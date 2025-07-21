import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Pressable,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const appVersion = "1.0.0";
  const buildNumber = "2025.1";

  const handleNotificationSettings = () => {
    Alert.alert(
      "Notifications",
      "Feature coming soon! Stay tuned for push notifications."
    );
  };

  const handleFeedback = async () => {
    try {
      await Linking.openURL("https://yacine-hamadouche.me/#contact");
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not open the contact page. Please visit https://yacine-hamadouche.me/#contact manually."
      );
    }
  };

  const handleGitHubStar = async () => {
    try {
      await Linking.openURL("https://github.com/yacine20005/Orbit-Market");
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not open GitHub. Please visit https://github.com/yacine20005/Orbit-Market manually."
      );
    }
  };

  const handlePortfolio = async () => {
    try {
      await Linking.openURL("https://yacine-hamadouche.me");
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not open portfolio. Please visit https://yacine-hamadouche.me manually."
      );
    }
  };

  interface SettingsOption {
    id: string;
    title: string;
    description: string;
    icon: any;
    onPress: () => void;
    showArrow?: boolean;
    showToggle?: boolean;
  }

  const settingsOptions: SettingsOption[] = [
    {
      id: "notifications",
      title: "Notifications",
      description: "Alerts for new inventories",
      icon: "bell",
      onPress: handleNotificationSettings,
      showArrow: true,
    },
  ];

  const aboutOptions: SettingsOption[] = [
    {
      id: "version",
      title: "Version",
      description: `${appVersion} (${buildNumber})`,
      icon: "information",
      onPress: () =>
        Alert.alert(
          "About Orbit Market",
          `Version ${appVersion}\nBuild ${buildNumber}\n\nYour vendor tracker for multiple games`
        ),
    },
    {
      id: "feedback",
      title: "Send Feedback",
      description: "Share your thoughts and suggestions",
      icon: "message-text",
      onPress: handleFeedback,
      showArrow: true,
    },
    {
      id: "github",
      title: "Star on GitHub",
      description: "Give us a star on GitHub ⭐",
      icon: "github",
      onPress: handleGitHubStar,
      showArrow: true,
    },
    {
      id: "portfolio",
      title: "Created by yacine20005",
      description: "Visit my portfolio",
      icon: "account-circle",
      onPress: handlePortfolio,
      showArrow: true,
    },
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient
        colors={["#0F0F23", "#1E293B", "#0F0F23"]}
        style={styles.headerSection}
      >
        <View style={styles.headerContent}>
          <MaterialCommunityIcons
            name="cog"
            size={48}
            color={Colors.destiny.primary}
          />
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Configure your experience</Text>
        </View>
      </LinearGradient>

      {/* Settings Section */}
      <LinearGradient
        colors={[
          Colors.destiny.dark,
          Colors.destiny.dark + "90",
          Colors.destiny.dark,
        ]}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>App Settings</Text>

        {settingsOptions.map((option) => (
          <Pressable
            key={option.id}
            style={({ pressed }) => [
              styles.optionCard,
              pressed && { opacity: 0.7 },
            ]}
            onPress={option.onPress}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionIcon}>
                <MaterialCommunityIcons
                  name={option.icon}
                  size={24}
                  color={Colors.destiny.primary}
                />
              </View>
              <View style={styles.optionText}>
                <View style={styles.optionTitleRow}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                </View>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>
              {option.showArrow && (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.destiny.ghost}
                  style={{ opacity: 0.5 }}
                />
              )}
              {option.showToggle && (
                <View style={styles.toggle}>
                  <View
                    style={[
                      styles.toggleSwitch,
                      { backgroundColor: Colors.destiny.primary },
                    ]}
                  />
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </LinearGradient>

      {/* About Section */}
      <LinearGradient
        colors={[
          Colors.destiny.dark,
          Colors.destiny.dark + "90",
          Colors.destiny.dark,
        ]}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>About</Text>

        {aboutOptions.map((option) => (
          <Pressable
            key={option.id}
            style={({ pressed }) => [
              styles.optionCard,
              pressed && { opacity: 0.7 },
            ]}
            onPress={option.onPress}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionIcon}>
                <MaterialCommunityIcons
                  name={option.icon as any}
                  size={24}
                  color={Colors.destiny.primary}
                />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.destiny.ghost}
                style={{ opacity: 0.5 }}
              />
            </View>
          </Pressable>
        ))}
      </LinearGradient>

      {/* Footer */}
      <View style={styles.footer}>
        <MaterialCommunityIcons
          name="shield-star"
          size={20}
          color={Colors.destiny.primary}
        />
        <Text style={styles.footerText}>
          Orbit Market • Created by yacine20005
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.destiny.dark,
    paddingBottom: 120, // Space for tabs like in home
  },
  headerSection: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    minHeight: 180,
    justifyContent: "center",
  },
  headerContent: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.destiny.primary,
    textAlign: "center",
    opacity: 0.8,
  },
  section: {
    padding: 24,
    backgroundColor: "transparent",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  optionCard: {
    backgroundColor: Colors.destiny.surface,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 212, 255, 0.1)",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "transparent",
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(0, 212, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    backgroundColor: "transparent",
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    backgroundColor: "transparent",
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    flex: 1,
  },
  comingSoonIndicator: {
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.destiny.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    opacity: 0.8,
    lineHeight: 20,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleSwitch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignSelf: "flex-end",
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
