import { Redirect, Tabs } from "expo-router";
import { View, useColorScheme } from "react-native";

import { IonIcon } from "../../components/icons/ion";

import colors from "../../constants/colors";
import { useSigninCheck, useUser } from "reactfire";
import { SplashScreen } from "../../components/splash/splash";
import { useUserData } from "../../hooks/use-user-data";
import { RoomProvider } from "../../context/room-context";
import { RoleProvider } from "../../context/role-context";
import { UserContextProvider } from "../../context/user-context";
import { Image } from "expo-image";
import fonts from "../../constants/fonts";
import { StatusBar } from "expo-status-bar";

export default function TabsLayout() {
  const {
    status: checkStatus,
    data: checkData,
    error: checkError,
  } = useSigninCheck();

  if (checkStatus === "loading") {
    return <SplashScreen loading message="Retrieving session..." />;
  }

  if (checkStatus === "error" && checkError) {
    return <SplashScreen message={checkError.message} />;
  }

  if (!checkData.signedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <RoomProvider>
      <RoleProvider>
        <UserContextProvider>
          <TabsLayoutNav />
        </UserContextProvider>
      </RoleProvider>
    </RoomProvider>
  );
}

const TabsLayoutNav = () => {
  const colorScheme = useColorScheme();

  const { status: authUserStatus, data: authUserData } = useUser();
  const { status, data } = useUserData();

  const isLight = colorScheme === "light";

  if (status === "loading" || authUserStatus === "loading") {
    return <SplashScreen loading message="Retrieving user data..." />;
  }

  if (status === "error" || authUserStatus === "error") {
    return <SplashScreen message="Unable to fetch data from Firestore" />;
  }

  if (!authUserData) {
    return <Redirect href="/sign-in" />;
  }

  if (!data) {
    return <Redirect href="/sign-up" />;
  }

  return (
    <View style={[{ flex: 1 }]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isLight
            ? colors.default.tint[400]
            : colors.default.tint[200],
          tabBarStyle: {
            height: 64,
            paddingVertical: 8,
          },
          tabBarLabelStyle: {
            fontFamily: fonts.poppinsRegular,
            fontSize: 12,
          },
          headerStyle: {
            backgroundColor: colors.default.tint[400],
          },
          headerTitleStyle: {
            fontFamily: fonts.poppinsMedium,
            color: colors.default.white[100],
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
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  {
                    width: 32,
                    aspectRatio: 1,
                    borderRadius: 100,
                    overflow: "hidden",
                    borderWidth: 2,
                    borderColor: "transparent",
                  },
                  focused && {
                    borderColor: color,
                  },
                ]}
              >
                <Image
                  source={authUserData.photoURL}
                  style={[{ height: "100%", width: "100%" }]}
                />
              </View>
            ),
          }}
        />
      </Tabs>
      <StatusBar style="light" />
    </View>
  );
};
