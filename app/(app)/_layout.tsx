import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import * as NavigationBar from "expo-navigation-bar";
import { Redirect, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Platform, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSigninCheck, useUser } from "reactfire";

import { IonIcon } from "@/components/icons/ion";
import { SplashScreen } from "@/components/splash/splash";

import { RoleProvider, useRoleContext } from "@/context/role-context";
import { RoomProvider } from "@/context/room-context";
import { UserProvider, useUserContext } from "@/context/user-context";

import { useStore } from "@/store/store";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useEffect, useRef } from "react";

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
        <UserProvider>
          <TabsLayoutNav />
        </UserProvider>
      </RoleProvider>
    </RoomProvider>
  );
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const TabsLayoutNav = () => {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  NavigationBar.setBackgroundColorAsync(
    isLight ? colors.default.white[200] : colors.default.black[400]
  );

  const { status: authUserStatus, data: authUserData } = useUser();
  const {
    user: userData,
    membership,
    pushNotificationToken,
  } = useUserContext();
  const { roles } = useRoleContext();

  const seenOnboarding = useStore((state) => state.seenOnboarding);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      pushNotificationToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (authUserStatus === "loading") {
    return <SplashScreen loading message="Retrieving user data..." />;
  }

  if (authUserStatus === "error") {
    return <SplashScreen message="Unable to fetch data from Firebase" />;
  }

  if (!authUserData) {
    return <Redirect href="/sign-in" />;
  }

  if (!userData) {
    return <Redirect href="/sign-up" />;
  }

  if (roles.length === 0) {
    return <SplashScreen message="Unable to connect to the server" />;
  }

  if (!seenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  const userRole = roles.find((role) => role.id === membership?.role.id);
  const canSeeMembers =
    userRole?.canManageAccess ||
    userRole?.canManageRoles ||
    userRole?.canHandleRequests ||
    userData.isRoot;

  return (
    <View style={[{ flex: 1 }]}>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarInactiveTintColor: isLight
            ? colors.default.black[400]
            : colors.default.white[400],
          tabBarActiveTintColor: isLight
            ? colors.default.tint[400]
            : colors.default.tint[100],
          tabBarActiveBackgroundColor: isLight
            ? colors.default.tint.translucid[200]
            : colors.default.tint.translucid[50],
          tabBarItemStyle: {
            borderRadius: 10,
          },
          tabBarStyle: {
            position: "absolute",
            bottom: 4,
            left: 4,
            right: 4,
            height: 72,
            borderTopWidth: 0,
            paddingTop: 4,
            paddingRight: 4,
            paddingBottom: 4,
            paddingLeft: 4,
          },
          tabBarBackground: () => (
            <BlurView
              intensity={32}
              tint={isLight ? "light" : "dark"}
              style={[
                {
                  ...StyleSheet.absoluteFillObject,
                  overflow: "hidden",
                  backgroundColor: isLight
                    ? colors.default.white.translucid[600]
                    : colors.default.black.translucid[800],
                  borderColor: colors.default.tint[400],
                  borderWidth: 2,
                  borderRadius: 14,
                },
              ]}
            >
              <View
                style={[
                  {
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: isLight
                      ? colors.default.tint.translucid[300]
                      : colors.default.tint.translucid[200],
                  },
                ]}
              />
            </BlurView>
          ),
          headerStyle: {
            backgroundColor: colors.default.tint[400],
          },
          headerTitleStyle: {
            fontFamily: fonts.poppinsMedium,
            color: colors.default.white[100],
          },
          headerShown: false,
          tabBarLabel: ({ color, focused, children }) => {
            return focused ? (
              <Text
                style={[
                  styles.tabLabelBase,
                  { color: color, fontFamily: fonts.poppinsMedium },
                ]}
              >
                {children}
              </Text>
            ) : (
              <Text
                style={[
                  styles.tabLabelBase,
                  {
                    color: isLight
                      ? colors.default.black[400]
                      : colors.default.white[400],
                  },
                ]}
              >
                {children}
              </Text>
            );
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
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
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <IonIcon name={focused ? "list" : "list-outline"} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="members"
          options={{
            title: "Miembros",
            href: canSeeMembers ? "/members" : null,
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <IonIcon
                name={focused ? "people" : "people-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
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

const styles = StyleSheet.create({
  tabLabelBase: {
    fontFamily: fonts.poppins,
    fontSize: 12,
  },
});

async function registerForPushNotificationsAsync() {
  let token: Notifications.ExpoPushToken | undefined;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token?.data;
}
