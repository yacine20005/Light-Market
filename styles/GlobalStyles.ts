import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

/**
 * Global Styles for Orbit Market
 * Centralized styling system for consistent UI across the application
 * Priority order: Xur → Home → Settings
 */

export const GlobalStyles = StyleSheet.create({
  // ===== CONTAINERS =====
  container: {
    flex: 1,
    backgroundColor: Colors.destiny.dark,
    paddingBottom: 120, // Space for tabs
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.destiny.dark,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "transparent",
  },

  // ===== SECTIONS =====
  // Hero/Header sections with gradient
  heroSection: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
    minHeight: 200,
    justifyContent: "center",
  },

  headerSection: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    minHeight: 180,
    justifyContent: "center",
  },

  // Content sections
  section: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: "transparent",
  },

  inventorySection: {
    padding: 24,
    backgroundColor: "transparent",
    marginTop: 0,
  },

  // Countdown specific (Xur priority)
  countdownSection: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
    minHeight: 320,
    justifyContent: "center",
  },

  xurPresentSection: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    minHeight: 160,
    justifyContent: "center",
  },

  // ===== CONTENT CONTAINERS =====
  heroContent: {
    alignItems: "center",
    backgroundColor: "transparent",
  },

  headerContent: {
    alignItems: "center",
    backgroundColor: "transparent",
  },

  countdownContent: {
    alignItems: "center",
    backgroundColor: "transparent",
  },

  xurPresentContent: {
    alignItems: "center",
    backgroundColor: "transparent",
  },

  // ===== TYPOGRAPHY =====
  // Main titles
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: Colors.destiny.ghost,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 2,
    textShadowColor: "rgba(0, 212, 255, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },

  countdownTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 1,
  },

  xurPresentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
  },

  // Subtitles
  subtitle: {
    fontSize: 18,
    color: Colors.destiny.primary,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },

  headerSubtitle: {
    fontSize: 16,
    color: Colors.destiny.primary,
    textAlign: "center",
    opacity: 0.8,
  },

  // Section titles
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.destiny.ghost,
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    opacity: 0.7,
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 0.3,
  },

  // Descriptions
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

  countdownDescription: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    textAlign: "center",
    opacity: 0.9,
    paddingHorizontal: 20,
    lineHeight: 24,
    marginBottom: 20,
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

  // ===== CARDS =====
  // Feature cards (from Home)
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

  // Option cards (Settings priority, enhanced from Xur)
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

  // Upcoming cards (from Home)
  upcomingCard: {
    backgroundColor: Colors.destiny.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.destiny.primary,
  },

  // ===== TIME DISPLAYS =====
  // Countdown time (Xur priority)
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

  // Xur present countdown
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

  // ===== ICONS & INDICATORS =====
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(0, 212, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  alienIconContainer: {
    position: "relative",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  xurPresentIconContainer: {
    alignItems: "center",
    position: "relative",
    marginBottom: 20,
  },

  // Live indicator
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

  // ===== GLOW EFFECTS =====
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

  xurPresentGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#8B5CF6",
    opacity: 0.3,
    zIndex: -1,
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

  // ===== DECORATIVE ELEMENTS =====
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

  // Decorative line from Home (full width)
  decorativeLineFull: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.destiny.primary,
    opacity: 0.3,
    marginHorizontal: 16,
  },

  // ===== SUBTLE TRANSITIONS =====
  subtleTransition: {
    height: 40,
    backgroundColor: "transparent",
  },

  subtleTransitionShort: {
    height: 20,
  },

  // ===== TEXT ELEMENTS =====
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

  featureDescription: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    lineHeight: 20,
    opacity: 0.8,
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

  // ===== STATUS TEXTS =====
  loadingText: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    marginTop: 16,
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

  locationText: {
    fontSize: 16,
    color: Colors.destiny.accent,
    textAlign: "center",
    marginBottom: 4,
  },

  timeRemainingText: {
    fontSize: 14,
    color: Colors.destiny.primary,
    textAlign: "center",
    opacity: 0.8,
  },

  refreshText: {
    fontSize: 12,
    color: Colors.destiny.ghost,
    textAlign: "center",
    opacity: 0.6,
    marginTop: 8,
  },

  xurPresentCountdownLabel: {
    fontSize: 14,
    color: Colors.destiny.ghost,
    marginBottom: 12,
    fontWeight: "500",
    opacity: 0.9,
  },

  xurPresentCountdownSubtext: {
    fontSize: 12,
    color: Colors.destiny.ghost,
    opacity: 0.7,
    textAlign: "center",
    fontStyle: "italic",
  },

  noItemsText: {
    fontSize: 16,
    color: Colors.destiny.ghost,
    opacity: 0.7,
    marginTop: 16,
    textAlign: "center",
  },

  // ===== BUTTONS =====
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

  // ===== TOGGLES =====
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

  // ===== FOOTER =====
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

  footerTextLarge: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.destiny.ghost,
    fontStyle: "italic",
    opacity: 0.7,
  },

  // ===== CENTERED CONTAINERS =====
  noItemsContainer: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "transparent",
  },

  xurPresentCountdownContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 16,
  },
});

export default GlobalStyles;
