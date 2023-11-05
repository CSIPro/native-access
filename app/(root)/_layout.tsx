import { Tabs } from "expo-router";
import { ComponentProps } from "react";
import { useColorScheme } from "react-native";

import IonIcons from "@expo/vector-icons/Ionicons";

import colors from "../../constants/colors";

function TabBarIcon(props: {
  name: ComponentProps<typeof IonIcons>["name"];
  color: string;
}) {
  return <IonIcons size={30} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          height: 64,
          paddingVertical: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "Poppins_400Regular",
        },
        headerTitleStyle: {
          fontFamily: "Poppins_500Medium",
          color: colors[colorScheme ?? "light"].tint,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
