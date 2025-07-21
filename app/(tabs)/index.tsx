import { ScrollView, Platform, Pressable } from "react-native";
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
import GlobalStyles from "@/styles/GlobalStyles";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      {/* Hero Section */}
      <LinearGradient
        colors={["#0F0F23", "#1E293B", "#0F0F23"]}
        style={GlobalStyles.heroSection}
      >
        <View style={GlobalStyles.heroContent}>
          <Text style={GlobalStyles.title}>Orbit Market</Text>
          <Text style={GlobalStyles.subtitle}>Your vendor tracker</Text>
          <Text style={GlobalStyles.description}>
            Track vendors, find the best gear, and stay updated with the latest
            game events - all in one place.
          </Text>
        </View>
      </LinearGradient>

      {/* Subtle transition gradient */}
      <LinearGradient
        colors={["#0F0B1F", Colors.destiny.dark + "20", Colors.destiny.dark]}
        style={GlobalStyles.subtleTransition}
      />

      {/* Current Features Section */}
      <LinearGradient
        colors={[
          Colors.destiny.dark,
          Colors.destiny.dark + "90",
          Colors.destiny.dark,
        ]}
        style={GlobalStyles.section}
      >
        <Text style={GlobalStyles.sectionTitle}>✨ What's Available Now</Text>

        <Pressable
          style={({ pressed }) => [
            GlobalStyles.featureCard,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => router.push("/xur")}
        >
          <View style={GlobalStyles.featureContent}>
            <View style={GlobalStyles.featureIcon}>
              <MaterialCommunityIcons
                name="alien"
                size={28}
                color={Colors.destiny.primary}
              />
            </View>
            <View style={GlobalStyles.featureInfo}>
              <View style={GlobalStyles.featureTitleRow}>
                <Text style={GlobalStyles.featureTitle}>
                  Xûr's Weekly Store
                </Text>
                <View style={GlobalStyles.liveIndicator}>
                  <View style={GlobalStyles.liveDot} />
                  <Text style={GlobalStyles.liveText}>LIVE</Text>
                </View>
              </View>
              <Text style={GlobalStyles.featureDescription}>
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
        style={[GlobalStyles.section, { paddingBottom: 60 }]}
      >
        <Text style={GlobalStyles.sectionTitle}>🚀 Coming Soon</Text>

        <View style={GlobalStyles.upcomingCard}>
          <View style={GlobalStyles.upcomingHeader}>
            <FontAwesome6
              name="ghost"
              size={20}
              color={Colors.destiny.secondary}
            />
            <Text style={GlobalStyles.upcomingTitle}>
              More Destiny 2 Vendors
            </Text>
          </View>
          <Text style={GlobalStyles.upcomingDescription}>
            Track all your favorite vendors like Ada-1, Banshee-44, and Saint-14
            in one convenient place.
          </Text>
        </View>

        <View style={GlobalStyles.upcomingCard}>
          <View style={GlobalStyles.upcomingHeader}>
            <MaterialCommunityIcons
              name="web"
              size={20}
              color={Colors.destiny.accent}
            />
            <Text style={GlobalStyles.upcomingTitle}>Warframe Integration</Text>
          </View>
          <Text style={GlobalStyles.upcomingDescription}>
            Stay on top of Warframe events, alerts, and invasions with real-time
            notifications.
          </Text>
        </View>

        <View style={GlobalStyles.upcomingCard}>
          <View style={GlobalStyles.upcomingHeader}>
            <Ionicons name="apps" size={20} color={Colors.destiny.exotic} />
            <Text style={GlobalStyles.upcomingTitle}>Enhanced Features</Text>
          </View>
          <Text style={GlobalStyles.upcomingDescription}>
            More customization options and personalized recommendations for your
            gaming style.
          </Text>
        </View>
      </LinearGradient>

      {/* Footer */}
      <View style={GlobalStyles.footer}>
        <FontAwesome6 name="ghost" size={20} color={Colors.destiny.primary} />
        <Text style={GlobalStyles.footerTextLarge}>
          Orbit Market • Created by yacine20005
        </Text>
      </View>
    </ScrollView>
  );
}
