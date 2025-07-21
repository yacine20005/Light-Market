import { StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from "react-native";
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
    Alert.alert("Notifications", "Feature coming soon! Stay tuned for push notifications.");
  };

  const handleFeedback = async () => {
    try {
      await Linking.openURL("https://yacine-hamadouche.me/#contact");
    } catch (error) {
      Alert.alert("Error", "Could not open the contact page. Please visit https://yacine-hamadouche.me/#contact manually.");
    }
  };

  const handleGitHubStar = async () => {
    try {
      await Linking.openURL("https://github.com/yacine20005/Orbit-Market");
    } catch (error) {
      Alert.alert("Error", "Could not open GitHub. Please visit https://github.com/yacine20005/Orbit-Market manually.");
    }
  };

  const handlePortfolio = async () => {
    try {
      await Linking.openURL("https://yacine-hamadouche.me");
    } catch (error) {
      Alert.alert("Error", "Could not open portfolio. Please visit https://yacine-hamadouche.me manually.");
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
      description: "Alerts for new inventories (Coming Soon)",
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
      onPress: () => Alert.alert(
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
        <Text style={styles.sectionTitle}>⚙️ App Settings</Text>

        {settingsOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionCard}
            onPress={option.onPress}
          >
            <View style={styles.optionContent}>
              <MaterialCommunityIcons
                name={option.icon}
                size={24}
                color={Colors.destiny.primary}
              />
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{option.title}</Text>
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
          </TouchableOpacity>
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
        <Text style={styles.sectionTitle}>ℹ️ About</Text>

        {aboutOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionCard}
            onPress={option.onPress}
          >
            <View style={styles.optionContent}>
              <MaterialCommunityIcons
                name={option.icon as any}
                size={24}
                color={Colors.destiny.primary}
              />
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
          </TouchableOpacity>
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
          Orbit Market • Created for Guardians
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
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  optionCard: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(0, 212, 255, 0.2)",
    shadowColor: Colors.destiny.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: "transparent",
  },
  optionText: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: "transparent",
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.destiny.ghost,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    opacity: 0.7,
    lineHeight: 18,
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
    fontSize: 14,
    color: Colors.destiny.ghost,
    opacity: 0.6,
  },
});
