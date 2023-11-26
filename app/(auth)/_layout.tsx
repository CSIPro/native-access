import { Stack, router } from "expo-router";

import { useEffect } from "react";

import { ActivityIndicator, Text, View, useColorScheme } from "react-native";

import { CustomSafeArea } from "../../components/custom-safe-area/custom-safe-area";
import { IonIcon } from "../../components/icons/ion";

import colors from "../../constants/colors";
import { useUserContext } from "../../context/user-context";
import { firebaseAuth } from "../../lib/firebase-config";
import { useSigninCheck } from "reactfire";

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  const {
    status: checkStatus,
    data: checkData,
    error: checkError,
  } = useSigninCheck();
  const { status: userStatus, user: userData } = useUserContext();

  useEffect(() => {
    if (checkStatus === "success" && userStatus === "success") {
      if (checkData.signedIn && userData) {
        router.replace("(root)");
      } else if (checkData.signedIn && !userData) {
        router.replace("(auth)/sign-up");
      }
    }
  }, [checkData, userData, checkStatus, userStatus]);

  if (checkStatus === "loading" || userStatus === "loading") {
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

  if (checkError || !checkData.signedIn) {
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
          <Text style={{ color: "#fff" }}>{checkError.message}</Text>
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
