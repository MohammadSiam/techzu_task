import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Colors, FontSize, Spacing } from "../constants/theme";

export default function AppSplash() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoEmoji}>💬</Text>
        </View>
        <Text style={styles.appName}>Social Feed</Text>
        <Text style={styles.tagline}>Connect · Share · Discover</Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  logoIcon: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  logoEmoji: {
    fontSize: 48,
  },
  appName: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: Spacing.xl * 2,
  },
});
