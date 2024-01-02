import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

const csiproLogo = require("@/assets/csipro.svg");

export const Branding = () => {
  return (
    <View style={[styles.wrapper]}>
      <Text
        style={[
          styles.text,
          {
            fontFamily: fonts.poppinsLight,
            color: colors.default.white.translucid[900],
          },
        ]}
      >
        from
      </Text>
      <View style={[styles.csipro]}>
        <Image source={csiproLogo} style={[styles.logo]} />
        <Text style={[styles.text]}>CSI PRO</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
    fontFamily: fonts.poppins,
    color: colors.default.white[100],
    fontSize: 16,
    paddingTop: 4,
  },
  csipro: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyConent: "center",
  },
  logo: {
    width: 24,
    aspectRatio: 569 / 398,
  },
});
