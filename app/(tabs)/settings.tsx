import { StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Text, View } from "@/components/Themed";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

export default function SettingsScreen() {
  const appVersion = "1.0.0";
  const buildNumber = "2025.1";

  const handleNotificationSettings = () => {
    Alert.alert("Notifications", "Notification settings");
  };

  const handleThemeSettings = () => {
    Alert.alert("Theme", "Appearance settings");
  };

  const handleAbout = () => {
    Alert.alert(
      "About",
      `Light Market v${appVersion}\nBuild ${buildNumber}\n\nApplication to check Destiny 2 vendors`
    );
  };

  const handleFeedback = () => {
    Alert.alert("Feedback", "Sending feedback");
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
    {
      id: "theme",
      title: "Theme",
      description: "Application appearance",
      icon: "palette",
      onPress: handleThemeSettings,
      showArrow: true,
    },
    {
      id: "auto-refresh",
      title: "Auto refresh",
      description: "Automatic data update",
      icon: "refresh",
      onPress: () => {},
      showToggle: true,
    },
    {
      id: "cache",
      title: "Cache",
      description: "Clear application cache",
      icon: "database",
      onPress: () => Alert.alert("Cache", "Cache cleared successfully"),
      showArrow: true,
    },
  ];

  const aboutOptions: SettingsOption[] = [
    {
      id: "version",
      title: "Version",
      description: `${appVersion} (${buildNumber})`,
      icon: "information",
      onPress: handleAbout,
    },
    {
      id: "feedback",
      title: "Feedback",
      description: "Send your feedback",
      icon: "message-text",
      onPress: handleFeedback,
    },
    {
      id: "rate",
      title: "Rate the app",
      description: "Leave your review on the App Store",
      icon: "star",
      onPress: () => Alert.alert("Rating", "Redirecting to the App Store"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
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
          <Text style={styles.headerSubtitle}>
            Light Market Configuration
          </Text>
        </View>
      </LinearGradient>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parameters</Text>

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
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

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
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <MaterialCommunityIcons
          name="shield-star"
          size={20}
          color={Colors.destiny.primary}
        />
        <Text style={styles.footerText}>
          Light Market • Created for Guardians
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
    borderRadius: 12,
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    opacity: 0.6,
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
