import { ScrollView, TouchableOpacity, Alert, Linking } from "react-native";
import { Text, View } from "@/components/Themed";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import GlobalStyles from "@/styles/GlobalStyles";

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
    <ScrollView style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient
        colors={["#0F0F23", "#1E293B", "#0F0F23"]}
        style={GlobalStyles.headerSection}
      >
        <View style={GlobalStyles.headerContent}>
          <MaterialCommunityIcons
            name="cog"
            size={48}
            color={Colors.destiny.primary}
          />
          <Text style={GlobalStyles.headerTitle}>Settings</Text>
          <Text style={GlobalStyles.headerSubtitle}>
            Configure your experience
          </Text>
        </View>
      </LinearGradient>

      {/* Settings Section */}
      <LinearGradient
        colors={[
          Colors.destiny.dark,
          Colors.destiny.dark + "90",
          Colors.destiny.dark,
        ]}
        style={GlobalStyles.section}
      >
        <Text style={GlobalStyles.sectionTitle}>⚙️ App Settings</Text>

        {settingsOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={GlobalStyles.optionCard}
            onPress={option.onPress}
          >
            <View style={GlobalStyles.optionContent}>
              <MaterialCommunityIcons
                name={option.icon}
                size={24}
                color={Colors.destiny.primary}
              />
              <View style={GlobalStyles.optionText}>
                <Text style={GlobalStyles.optionTitle}>{option.title}</Text>
                <Text style={GlobalStyles.optionDescription}>
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
                <View style={GlobalStyles.toggle}>
                  <View
                    style={[
                      GlobalStyles.toggleSwitch,
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
        style={GlobalStyles.section}
      >
        <Text style={GlobalStyles.sectionTitle}>ℹ️ About</Text>

        {aboutOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={GlobalStyles.optionCard}
            onPress={option.onPress}
          >
            <View style={GlobalStyles.optionContent}>
              <MaterialCommunityIcons
                name={option.icon as any}
                size={24}
                color={Colors.destiny.primary}
              />
              <View style={GlobalStyles.optionText}>
                <Text style={GlobalStyles.optionTitle}>{option.title}</Text>
                <Text style={GlobalStyles.optionDescription}>
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
      <View style={GlobalStyles.footer}>
        <MaterialCommunityIcons
          name="shield-star"
          size={20}
          color={Colors.destiny.primary}
        />
        <Text style={GlobalStyles.footerText}>
          Orbit Market • Created for Guardians
        </Text>
      </View>
    </ScrollView>
  );
}
