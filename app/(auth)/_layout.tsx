import { Stack, router } from "expo-router";

import { useEffect } from "react";

import { ActivityIndicator, Text, View, useColorScheme } from "react-native";

import { useAuthState } from "react-firebase-hooks/auth";

import { CustomSafeArea } from "../../components/custom-safe-area/custom-safe-area";
import { IonIcon } from "../../components/icons/ion";

import { firebaseAuth } from "../../lib/firebase-config";
import colors from "../../constants/colors";
import { useUser } from "../../context/user-context";

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  const [user, loading, error] = useAuthState(firebaseAuth);
  const {
    user: userData,
    loading: userDataLoading,
    error: userDataError,
  } = useUser();

  useEffect(() => {
    if (!loading && !userDataLoading) {
      if (user && userData) {
        router.replace("(root)");
      } else if (user && !userData) {
        router.replace("(auth)/sign-up");
      }
    }
  }, [user, userData, loading, userDataLoading]);

  if (loading || userDataLoading) {
    return (
      <CustomSafeArea>
        <View
          style={{
            flex: 1,
            backgroundColor: colors[colorScheme].tint,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </CustomSafeArea>
    );
  }

  if (error || userDataError) {
    return (
      <CustomSafeArea>
        <View
          style={{
            flex: 1,
            backgroundColor: colors[colorScheme].tint,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IonIcon name="alert-circle-outline" size={32} color="#fff" />
          <Text style={{ color: "#fff" }}>{error.message}</Text>
        </View>
      </CustomSafeArea>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Sign in",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: "Sign up",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
