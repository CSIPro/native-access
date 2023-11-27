import { Link, router } from "expo-router";

import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

import { CustomSafeArea } from "../components/custom-safe-area/custom-safe-area";

import colors from "../constants/colors";
import { firebaseAuth } from "../lib/firebase-config";
import {
  GoogleSigninButton,
  GoogleSignin,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "1050055617140-39t9pnkben51i9dlsj472p6vug65p0sk.apps.googleusercontent.com",
});

export default function SignIn() {
  const colorSchemeValue = useColorScheme();

  const colorScheme = colorSchemeValue ?? "light";

  const handleGoogleSignIn = async () => {
    await GoogleSignin.hasPlayServices();
    const userData = await GoogleSignin.signIn();
    const credential = GoogleAuthProvider.credential(userData.idToken);

    await signInWithCredential(firebaseAuth, credential);
  };

  return (
    <CustomSafeArea>
      <View
        style={{
          flex: 1,
          backgroundColor: colors[colorScheme].tint,
        }}
      >
        <Text style={{ color: colors[colorScheme].text }}>Sign In screen</Text>
        <Link
          href="(root)/settings"
          replace
          style={{ color: colors[colorScheme].text }}
        >
          Navigate to app
        </Link>
        <GoogleSigninButton onPress={handleGoogleSignIn} />
      </View>
    </CustomSafeArea>
  );
}
