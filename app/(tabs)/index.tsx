import { StyleSheet, ScrollView, Platform, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import {
  FontAwesome6,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Hero Section */}
      <LinearGradient
        colors={["#0F0F23", "#1E293B", "#0F0F23"]}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.title}>Orbit Market</Text>
          <Text style={styles.subtitle}>Your vendor tracker</Text>
          <Text style={styles.description}>
            Track vendors, find the best gear, and stay updated with the latest
            game events - all in one place.
          </Text>
        </View>
      </LinearGradient>

      {/* Subtle transition gradient */}
      <LinearGradient
        colors={["#0F0B1F", Colors.destiny.dark + "20", Colors.destiny.dark]}
        style={styles.subtleTransition}
      />

      {/* Current Features Section */}
      <LinearGradient
        colors={[
          Colors.destiny.dark,
          Colors.destiny.dark + "90",
          Colors.destiny.dark,
        ]}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>✨ What's Available Now</Text>

        <Pressable
          style={({ pressed }) => [
            styles.featureCard,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => router.push("/xur")}
        >
          <View style={styles.featureContent}>
            <View style={styles.featureIcon}>
              <MaterialCommunityIcons
                name="alien"
                size={28}
                color={Colors.destiny.primary}
              />
            </View>
            <View style={styles.featureInfo}>
              <View style={styles.featureTitleRow}>
                <Text style={styles.featureTitle}>Xûr's Weekly Store</Text>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              <Text style={styles.featureDescription}>
                See what exotic gear Xûr is selling this week and never miss out
                on amazing weapons and armor.
              </Text>
            </View>
          </View>
        </Pressable>
      </LinearGradient>

      {/* Coming Soon Section */}
      <LinearGradient
        colors={[
          Colors.destiny.dark,
          Colors.destiny.dark + "60",
          Colors.destiny.dark,
        ]}
        style={[styles.section, { paddingBottom: 60 }]}
      >
        <Text style={styles.sectionTitle}>🚀 Coming Soon</Text>

        <View style={styles.upcomingCard}>
          <View style={styles.upcomingHeader}>
            <FontAwesome6
              name="ghost"
              size={20}
              color={Colors.destiny.secondary}
            />
            <Text style={styles.upcomingTitle}>More Destiny 2 Vendors</Text>
          </View>
          <Text style={styles.upcomingDescription}>
            Track all your favorite vendors like Ada-1, Banshee-44, and Saint-14
            in one convenient place.
          </Text>
        </View>

        <View style={styles.upcomingCard}>
          <View style={styles.upcomingHeader}>
            <MaterialCommunityIcons
              name="web"
              size={20}
              color={Colors.destiny.accent}
            />
            <Text style={styles.upcomingTitle}>Warframe Integration</Text>
          </View>
          <Text style={styles.upcomingDescription}>
            Stay on top of Warframe events, alerts, and invasions with real-time
            notifications.
          </Text>
        </View>

        <View style={styles.upcomingCard}>
          <View style={styles.upcomingHeader}>
            <Ionicons name="apps" size={20} color={Colors.destiny.exotic} />
            <Text style={styles.upcomingTitle}>Enhanced Features</Text>
          </View>
          <Text style={styles.upcomingDescription}>
            More customization options and personalized recommendations for your
            gaming style.
          </Text>
        </View>
      </LinearGradient>

      {/* Footer */}
      <View style={styles.footer}>
        <FontAwesome6 name="ghost" size={20} color={Colors.destiny.primary} />
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
    paddingBottom: 120, // Space for tabs like in Xur
  },
  heroSection: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
    minHeight: 320,
    justifyContent: "center",
  },
  heroContent: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  heroIconContainer: {
    position: "relative",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  heroIcon: {
    marginBottom: 0,
    opacity: 1,
    zIndex: 2,
  },
  heroGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.destiny.primary,
    opacity: 0.25,
    transform: [{ translateX: -40 }, { translateY: -40 }],
    zIndex: 1,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },
  subtitle: {
    fontSize: 20,
    color: Colors.destiny.primary,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 8,
    opacity: 0.8,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  decorativeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "transparent",
  },
  decorativeLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.destiny.primary,
    opacity: 0.3,
    marginHorizontal: 16,
  },
  subtleTransition: {
    height: 20,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    opacity: 0.7,
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  featureCard: {
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
  featureContent: {
    flexDirection: "row",
    padding: 20,
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(0, 212, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureInfo: {
    flex: 1,
    backgroundColor: "transparent",
  },
  featureTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    flex: 1,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.destiny.success,
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.destiny.success,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    lineHeight: 20,
    opacity: 0.8,
  },
  upcomingCard: {
    backgroundColor: Colors.destiny.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.destiny.primary,
  },
  upcomingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.destiny.ghost,
    marginLeft: 12,
  },
  upcomingDescription: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    lineHeight: 20,
    opacity: 0.7,
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
