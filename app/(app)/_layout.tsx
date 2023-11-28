import { Redirect, Tabs } from "expo-router";
import { useColorScheme } from "react-native";

import { IonIcon } from "../../components/icons/ion";

import colors from "../../constants/colors";
import { useSigninCheck } from "reactfire";
import { SplashScreen } from "../../components/splash/splash";
import { useUserData } from "../../hooks/use-user-data";

export default function TabsLayout() {
  const {
    status: checkStatus,
    data: checkData,
    error: checkError,
  } = useSigninCheck();

  if (checkStatus === "loading") {
    return <SplashScreen loading message="Retrieving session..." />;
  }

  if (checkError) {
    return <SplashScreen message={checkError.message} />;
  }

  if (!checkData.signedIn) {
    return <Redirect href="/sign-in" />;
  }

  return <TabsLayoutNav />;
}

const TabsLayoutNav = () => {
  const colorScheme = useColorScheme();

  const { status, data } = useUserData();

  if (status === "loading") {
    return <SplashScreen loading message="Retrieving user data..." />;
  }

  if (status === "error") {
    return <SplashScreen message="Unable to fetch data from Firestore" />;
  }

  if (!data) {
    return <Redirect href="/sign-up" />;
  }

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
        name="logs"
        options={{
          title: "Logs",
          tabBarIcon: ({ color, focused }) => (
            <IonIcon
              name={focused ? "log-in" : "log-in-outline"}
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
            <IonIcon
              name={focused ? "settings" : "settings-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};
