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
import {
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
} from "reactfire";
import { firebaseApp, firebaseAuth, firestore } from "../lib/firebase-config";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PoppinsLight: Poppins_300Light,
    Poppins: Poppins_400Regular,
    PoppinsMedium: Poppins_500Medium,
    PoppinsBold: Poppins_700Bold,
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
            <QueryClientProvider client={queryClient}>
              <Stack initialRouteName="(app)">
                <Stack.Screen name="sign-in" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(app)"
                  options={{ headerShown: false }}
                  initialParams={{ initialRouteName: "index" }}
                />
              </Stack>
            </QueryClientProvider>
          </FirestoreProvider>
        </AuthProvider>
      </FirebaseAppProvider>
    </ThemeProvider>
  );
}
