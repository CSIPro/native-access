import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { BLEContextProvider } from "../context/ble-context";
import {
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
} from "reactfire";
import bcrypt from "react-native-bcrypt";
import isaac from "isaac";
import { firebaseApp, firebaseAuth, firestore } from "../lib/firebase-config";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

bcrypt.setRandomFallback((len) => {
  const buf = new Uint8Array(len);
  return buf.map(() => Math.floor(isaac.random() * 256));
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <FirebaseAppProvider firebaseApp={firebaseApp}>
        <AuthProvider sdk={firebaseAuth}>
          <FirestoreProvider sdk={firestore}>
            <BLEContextProvider>
              <QueryClientProvider client={queryClient}>
                <Stack initialRouteName="(app)">
                  <Stack.Screen
                    name="sign-in"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="(app)" options={{ headerShown: false }} />
                </Stack>
              </QueryClientProvider>
            </BLEContextProvider>
          </FirestoreProvider>
        </AuthProvider>
      </FirebaseAppProvider>
    </ThemeProvider>
  );
}
