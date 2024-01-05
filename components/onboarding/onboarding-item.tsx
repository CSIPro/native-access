import { Image } from "expo-image";
import { FC } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

interface Props {
  item: {
    id: string;
    title: string;
    description: string;
    image: number;
  };
}

export const OnboardingItem: FC<Props> = ({ item }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.wrapper, { width }]}>
      <View style={[styles.imageContainer]}>
        <Image source={item.image} style={{ flex: 1, aspectRatio: 9 / 20 }} />
      </View>
      <View style={[{ flex: 1, gap: 8, paddingHorizontal: 16 }]}>
        <Text style={[styles.text, styles.centeredText, styles.title]}>
          {item.title}
        </Text>
        <Text style={[styles.text, styles.centeredText]}>
          {item.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 3,
  },
  text: {
    fontFamily: fonts.poppins,
    fontSize: 16,
    paddingTop: 4,
    color: colors.default.white[100],
  },
  centeredText: {
    textAlign: "center",
  },
  title: {
    fontFamily: fonts.poppinsBold,
    fontSize: 24,
  },
});
