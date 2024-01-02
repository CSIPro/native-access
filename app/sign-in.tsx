import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import {
  GoogleSigninButton,
  GoogleSignin,
} from "@react-native-google-signin/google-signin";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSigninCheck } from "reactfire";

import { SplashScreen } from "@/components/splash/splash";

import { firebaseAuth } from "@/lib/firebase-config";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { IonIcon } from "@/components/icons/ion";

const accessLogo = require("../assets/access-logo.svg");
const googleLogo = require("../assets/auth/google-g.png");
const githubLogo = require("../assets/auth/github-mark.png");

GoogleSignin.configure({
  webClientId:
    "1050055617140-39t9pnkben51i9dlsj472p6vug65p0sk.apps.googleusercontent.com",
});

export default function SignIn() {
  const { status, data } = useSigninCheck();
  const colorSchemeValue = useColorScheme();

  const colorScheme = colorSchemeValue ?? "light";

  const palette = colors[colorScheme];

  const handleGoogleSignIn = async () => {
    await GoogleSignin.hasPlayServices();
    const userData = await GoogleSignin.signIn();
    const credential = GoogleAuthProvider.credential(userData.idToken);

    await signInWithCredential(firebaseAuth, credential);
  };

  if (status === "loading") {
    return <SplashScreen loading message="Checking authentication..." />;
  }

  if (status === "error") {
    return <SplashScreen message="Unable to check authentication" />;
  }

  if (data.signedIn) {
    return <Redirect href="(app)" />;
  }

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: palette.tint }]}>
      <View style={[styles.container]}>
        <View style={[styles.header]}>
          <View style={[styles.titleContainer]}>
            <Text style={[styles.title]}>CSI PRO</Text>
            <Text style={[styles.titleEmphasis, { color: palette.tint }]}>
              ACCESS
            </Text>
          </View>
          <Image source={accessLogo} style={[styles.logo]} />
        </View>
        <Pressable style={[styles.button]}>
          <View style={[styles.iconWrapper]}>
            <Image source={googleLogo} />
          </View>
          <Text>Sign in with Google</Text>
        </Pressable>
        <GoogleSigninButton onPress={handleGoogleSignIn} />
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 32,
  },
  header: {
    alignItems: "center",
    gap: 24,
  },
  logo: {
    width: "40%",
    aspectRatio: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  title: {
    fontSize: 36,
    fontFamily: fonts.poppins,
    color: "#fff",
    paddingTop: 4,
  },
  titleEmphasis: {
    fontSize: 36,
    fontFamily: fonts.poppinsBold,
    backgroundColor: "#fff",
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  button: {
    width: 300,
    height: 52,
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.default.white[100],
  },
  iconWrapper: {
    position: "absolute",
    left: 12,
  },
});
