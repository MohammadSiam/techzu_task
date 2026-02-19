import { Tabs } from "expo-router";
import { Text, Platform } from "react-native";
import { Colors, FontSize } from "../../../src/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 88 : 64,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          paddingTop: 8,
          elevation: 12,
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.sm,
          fontWeight: "700",
          marginTop: 2,
          letterSpacing: 0.3,
        },
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTitleStyle: {
          fontSize: FontSize.xl,
          fontWeight: "800",
          color: Colors.text,
          letterSpacing: 0.3,
        },
        headerTintColor: Colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>📋</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>✏️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
