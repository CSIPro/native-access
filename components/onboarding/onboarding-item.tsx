import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { FC } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

interface Props {
  item: {
    id: string;
    title: string;
    description: string;
  };
}

export const OnboardingItem: FC<Props> = ({ item }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.wrapper, { width }]}>
      <View style={[styles.imageContainer]}></View>
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
