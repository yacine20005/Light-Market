import React from "react";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

function MaterialIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
}) {
  return (
    <MaterialCommunityIcons size={24} style={{ marginBottom: -3 }} {...props} />
  );
}

function IonicIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.destiny.primary,
        tabBarInactiveTintColor: Colors.destiny.ghost + "60",
        headerShown: true,
        headerTransparent: false,
        headerStyle: {
          backgroundColor: Colors.destiny.dark,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(0, 212, 255, 0.2)",
        },
        headerTitleStyle: {
          color: Colors.destiny.ghost,
          fontSize: 18,
          fontWeight: "600",
        },
        headerTitleAlign: "center",
        headerTintColor: Colors.destiny.ghost,
        tabBarStyle: {
          backgroundColor: Colors.destiny.dark,
          borderTopWidth: 1,
          borderTopColor: "rgba(0, 212, 255, 0.2)",
          elevation: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="xur"
        options={{
          title: "Xûr",
          tabBarIcon: ({ color }) => (
            <MaterialIcon name="alien" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vendors"
        options={{
          title: "Vendeurs",
          tabBarIcon: ({ color }) => (
            <MaterialIcon name="store" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => <IonicIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Paramètres",
          tabBarIcon: ({ color }) => (
            <IonicIcon name="settings" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
