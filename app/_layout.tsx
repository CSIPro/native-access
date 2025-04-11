import * as Notifications from "expo-notifications";
import { SplashScreen, Stack } from "expo-router";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useCallback, useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme, View } from "react-native";
import {
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
} from "reactfire";
import { QueryClient, QueryClientProvider } from "react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SplashScreen as Splash } from "@/components/splash/splash";

import { firebaseApp, firebaseAuth, firestore } from "../lib/firebase-config";
import { ToastProvider } from "@/context/toast-context";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const [loaded, error] = useFonts({
    PoppinsLight: Poppins_300Light,
    Poppins: Poppins_400Regular,
    PoppinsMedium: Poppins_500Medium,
    PoppinsBold: Poppins_700Bold,
    InterLight: Inter_300Light,
    Inter: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterBold: Inter_700Bold,
    GeistMonoBold: require("../assets/fonts/GeistMono-Bold.otf"),
    GeistMonoLight: require("../assets/fonts/GeistMono-Light.otf"),
    GeistMono: require("../assets/fonts/GeistMono-Regular.otf"),
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  useEffect(() => {
    setAppIsReady(true);
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  if (!loaded) {
    return <Splash loading message="Loading assets" />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <RootLayoutNav />
    </View>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <FirebaseAppProvider firebaseApp={firebaseApp}>
        <AuthProvider sdk={firebaseAuth}>
          <FirestoreProvider sdk={firestore}>
            <QueryClientProvider client={queryClient}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                  <ToastProvider>
                    <Stack initialRouteName="(app)">
                      <Stack.Screen
                        name="sign-in"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="(app)"
                        options={{ headerShown: false }}
                        initialParams={{ initialRouteName: "index" }}
                      />
                    </Stack>
                  </ToastProvider>
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </QueryClientProvider>
          </FirestoreProvider>
        </AuthProvider>
      </FirebaseAppProvider>
    </ThemeProvider>
  );
}
