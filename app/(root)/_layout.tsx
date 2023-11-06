import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

import { IonIcon } from "../../components/icons/ion";

import colors from "../../constants/colors";

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
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <IonIcon name={focused ? "home" : "home-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <IonIcon
              name={focused ? "settings" : "settings-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
