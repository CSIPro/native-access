import { Image } from "expo-image";
import { FC } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

interface Props {
  item: {
    id: string;
    title: string;
    description: string;
    image: number;
  };
  index: number;
  translateX: Animated.SharedValue<number>;
}

export const OnboardingItem: FC<Props> = ({ item, index, translateX }) => {
  const { width } = useWindowDimensions();
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolate.CLAMP
    );

    return { transform: [{ scale }] };
  });

  return (
    <View style={[styles.wrapper, { width }]}>
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <Image source={item.image} style={{ flex: 1, aspectRatio: 9 / 20 }} />
      </Animated.View>
      <View style={[{ gap: 4, paddingHorizontal: 16 }]}>
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
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingBottom: 16,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 3,
  },
  text: {
    fontFamily: fonts.inter,
    fontSize: 16,
    paddingTop: 4,
    color: colors.default.white[100],
  },
  centeredText: {
    textAlign: "center",
  },
  title: {
    fontFamily: fonts.interBold,
    fontSize: 24,
  },
});
