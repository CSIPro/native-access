import { Image } from "expo-image";
import { Redirect, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSigninCheck, useUser } from "reactfire";

import { IonIcon } from "@/components/icons/ion";
import { SplashScreen } from "@/components/splash/splash";

import { RoleProvider } from "@/context/role-context";
import { RoomProvider } from "@/context/room-context";
import { UserContextProvider } from "@/context/user-context";
import { useRoles } from "@/hooks/use-roles";
import { useUserData } from "@/hooks/use-user-data";

import { useStore } from "@/store/store";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { BlurView } from "expo-blur";

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
  const { status: userDataStatus, data: userData } = useUserData();
  const { status: rolesStatus, data: rolesData } = useRoles();

  const seenOnboarding = useStore((state) => state.seenOnboarding);

  const isLight = colorScheme === "light";

  if (
    userDataStatus === "loading" ||
    authUserStatus === "loading" ||
    rolesStatus === "loading"
  ) {
    return <SplashScreen loading message="Retrieving user data..." />;
  }

  if (
    userDataStatus === "error" ||
    authUserStatus === "error" ||
    rolesStatus === "error"
  ) {
    return <SplashScreen message="Unable to fetch data from Firestore" />;
  }

  if (!authUserData) {
    return <Redirect href="/sign-in" />;
  }

  if (!userData) {
    return <Redirect href="/sign-up" />;
  }

  if (!rolesData) {
    return (
      <SplashScreen message="Something went wrong. Please, try again later" />
    );
  }

  if (!seenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  const userRole = rolesData.find((role) => role.id === userData.role?.roleId);
  const canSeeMembers =
    userRole?.canGrantOrRevokeAccess ||
    userRole?.canSetRoles ||
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
            ? colors.default.tint.translucid[100]
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
                  backgroundColor: "transparent",
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
                      ? colors.default.tint.translucid[100]
                      : colors.default.tint.translucid[50],
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
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <IonIcon name={focused ? "list" : "list-outline"} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="members"
          options={{
            title: "Members",
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

const styles = StyleSheet.create({
  tabLabelBase: {
    fontFamily: fonts.poppins,
    fontSize: 12,
  },
});
