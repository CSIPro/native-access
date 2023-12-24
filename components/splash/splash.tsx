import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import colors from "../../constants/colors";
import { FC } from "react";
import fonts from "../../constants/fonts";
import { Image } from "expo-image";

const accessLogo = require("../../assets/access-logo.svg");

interface Props {
  loading?: boolean;
  message?: string;
}

export const SplashScreen: FC<Props> = ({ loading = false, message }) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.default.tint[400] }}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: colors[colorScheme].tint },
        ]}
      >
        <View style={[styles.centered]}>
          <Image source={accessLogo} style={[styles.logo]} />
        </View>
        <View style={[styles.feedback]}>
          {loading && <ActivityIndicator size="large" color="#fff" />}
          <Text style={[styles.feedbackMessage]}>{message}</Text>
        </View>
      </View>
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
    width: "70%",
    aspectRatio: 1,
  },
  feedback: {
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: 8,
    paddingBottom: 32,
  },
  feedbackMessage: {
    color: "#fff",
    fontFamily: fonts.poppins,
    fontSize: 16,
    textAlign: "center",
  },
});
