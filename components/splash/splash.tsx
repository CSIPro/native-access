import Constants from "expo-constants";
import { Image } from "expo-image";
import { FC } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

const accessLogo = require("../../assets/access-logo.svg");

interface Props {
  loading?: boolean;
  message?: string;
}

export const SplashScreen: FC<Props> = ({ loading = false, message }) => {
  const isLight = useColorScheme() === "light";

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.default.black[400] }}
    >
      <LinearGradient
        colors={[
          colors.default.black[400],
          colors.default.tint.translucid[200],
        ]}
        locations={[0.9, 1.0]}
        style={{ ...StyleSheet.absoluteFillObject }}
      />
      <View style={[styles.container]}>
        <View style={[styles.centered]}>
          <Image source={accessLogo} style={[styles.logo]} />
        </View>
        <View style={[styles.feedback]}>
          {loading && <ActivityIndicator size="large" color="#fff" />}
          <Text style={[styles.feedbackMessage]}>{message}</Text>
        </View>
        <View style={[styles.branding]}>
          <Text style={[styles.brandingText]}>from</Text>
          <Image
            source={require("../../assets/csipro.svg")}
            style={[styles.brandingLogo]}
          />
          <Text style={[styles.brandingText]}>CSI PRO</Text>
        </View>
      </View>
      <View style={[{ paddingBottom: 16 }]}>
        <Text
          style={[
            styles.text,
            {
              textAlign: "center",
              color: isLight
                ? colors.default.black.translucid[400]
                : colors.default.white.translucid[400],
            },
          ]}
        >{`${Constants.expoConfig.name} v${Constants.expoConfig.version}`}</Text>
      </View>
      <StatusBar translucent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    paddingBottom: 32,
  },
  centered: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logo: {
    width: "50%",
    aspectRatio: 1,
  },
  feedback: {
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: 8,
    paddingBottom: 96,
  },
  feedbackMessage: {
    color: "#fff",
    fontFamily: fonts.poppins,
    fontSize: 16,
    textAlign: "center",
  },
  branding: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.default.tint.translucid[200],
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.default.tint[400],
    borderRadius: 9999,
  },
  brandingLogo: {
    width: 28,
    height: 20,
  },
  brandingText: {
    color: colors.default.white[100],
    fontFamily: fonts.poppins,
    fontSize: 14,
    textAlign: "center",
    paddingTop: 4,
  },
  text: {
    fontFamily: fonts.inter,
    fontSize: 12,
  },
});
