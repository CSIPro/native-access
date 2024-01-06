import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSigninCheck } from "reactfire";

import { SplashScreen } from "@/components/splash/splash";

import { firebaseAuth } from "@/lib/firebase-config";

import colors from "@/constants/colors";
import { Branding } from "@/components/branding/branding";
import { z } from "zod";

const accessBanner = require("../assets/banner.png");
const accessLogo = require("../assets/access-logo.svg");
const googleLogo = require("../assets/auth/google-g.png");
const githubLogo = require("../assets/auth/github-mark.png");

GoogleSignin.configure({
  webClientId:
    "1050055617140-39t9pnkben51i9dlsj472p6vug65p0sk.apps.googleusercontent.com",
});

const githubBaseUrl = "https://github.com/login/oauth/authorize";

const GithubResponse = z.object({
  accessToken: z.string(),
});
type GithubResponse = z.infer<typeof GithubResponse>;

export default function SignIn() {
  const { status, data } = useSigninCheck();
  const colorSchemeValue = useColorScheme();

  Linking.addEventListener("url", (event) => {
    handleURL(event.url);
  });

  const handleURL = (url: string) => {
    if (url) {
      const { queryParams } = Linking.parse(url);

      const params = GithubResponse.parse(queryParams);

      const token = params.accessToken;

      if (!token) {
        throw new Error("No token provided");
      }

      const credential = GithubAuthProvider.credential(token);
      signInWithCredential(firebaseAuth, credential);
    }
  };

  const colorScheme = colorSchemeValue ?? "light";

  const palette = colors[colorScheme];

  const handleGoogleSignIn = async () => {
    await GoogleSignin.hasPlayServices();
    const userData = await GoogleSignin.signIn();
    const credential = GoogleAuthProvider.credential(userData.idToken);

    await signInWithCredential(firebaseAuth, credential);
  };

  const handleGithubSignIn = async () => {
    const clientId = Constants.expoConfig.extra?.githubClientId;
    const apiUrl = Constants.expoConfig.extra?.authApiUrl;
    const redirectUri = `${apiUrl}oauth/callback/native`;

    if (!clientId) {
      throw new Error("No GitHub client ID provided");
    }

    const githubAuthUrl = `${githubBaseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    Linking.openURL(githubAuthUrl);
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
          <Image
            source={accessBanner}
            style={[{ width: "90%", aspectRatio: 1091 / 160 }]}
          />
          <Image source={accessLogo} style={[styles.logo]} />
        </View>
        <View style={[styles.loginOptions]}>
          <Pressable onPress={handleGoogleSignIn} style={[styles.button]}>
            <View style={[styles.iconWrapper]}>
              <Image
                source={googleLogo}
                style={[{ height: 24, aspectRatio: 1 }]}
              />
            </View>
            <Text style={[styles.signinLabel]}>Sign in with Google</Text>
          </Pressable>
          <Pressable onPress={handleGithubSignIn} style={[styles.button]}>
            <View style={[styles.iconWrapper]}>
              <Image
                source={githubLogo}
                style={[{ height: 24, aspectRatio: 1 }]}
              />
            </View>
            <Text style={[styles.signinLabel]}>Sign in with GitHub</Text>
          </Pressable>
        </View>
      </View>
      <View style={[styles.branding]}>
        <Branding />
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 4,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 32,
    padding: 8,
    paddingTop: 48,
  },
  header: {
    alignItems: "center",
    gap: 32,
  },
  logo: {
    width: "40%",
    aspectRatio: 1,
  },
  loginOptions: {
    width: "100%",
    paddingVertical: 16,
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "75%",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.default.white[100],
    borderWidth: 1,
    borderColor: "#747775",
  },
  signinLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  iconWrapper: {
    position: "absolute",
    left: 16,
  },
  branding: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
});
