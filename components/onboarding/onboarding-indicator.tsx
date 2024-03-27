import colors from "@/constants/colors";
import { FC } from "react";
import { FlatList, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  length: number;
  translateX: Animated.SharedValue<number>;
}

export const OnboardingIndicator: FC<Props> = ({ length, translateX }) => {
  return (
    <FlatList
      data={Array(length)}
      renderItem={({ index }) => (
        <IndicatorItem index={index} translateX={translateX} />
      )}
      contentContainerStyle={[styles.wrapper]}
    />
  );
};

interface IndicatorItemProps {
  index: number;
  translateX: Animated.SharedValue<number>;
}

const IndicatorItem: FC<IndicatorItemProps> = ({ index, translateX }) => {
  const { width } = useWindowDimensions();
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        translateX.value,
        inputRange,
        [10, 32, 10],
        Extrapolate.CLAMP
      ),
      opacity: interpolate(
        translateX.value,
        inputRange,
        [0.4, 1, 0.4],
        Extrapolate.CLAMP
      ),
      backgroundColor: interpolateColor(translateX.value, inputRange, [
        colors.default.tint[400],
        colors.default.tint[300],
        colors.default.tint[400],
      ]),
    };
  });

  return <Animated.View style={[styles.indicator, indicatorStyle]} />;
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 8,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 9999,
    backgroundColor: colors.default.tint[400],
  },
});
