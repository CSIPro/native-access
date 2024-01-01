import colors from "@/constants/colors";
import { FC } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  value: number;
  length: number;
}

export const OnboardingIndicator: FC<Props> = ({ value, length }) => {
  return (
    <FlatList
      data={Array(length)}
      renderItem={({ index }) => <IndicatorItem active={index === value} />}
      contentContainerStyle={[styles.wrapper]}
    />
  );
};

interface IndicatorItemProps {
  active?: boolean;
}

const IndicatorItem: FC<IndicatorItemProps> = ({ active = false }) => {
  const sv = useDerivedValue(
    () => (active ? withTiming(1) : withTiming(0)),
    [active]
  );

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(sv.value, [0, 1], [10, 32]),
      opacity: interpolate(sv.value, [0, 1], [0.4, 1]),
      backgroundColor: interpolateColor(
        sv.value,
        [0, 1],
        [colors.default.tint[400], colors.default.tint[300]]
      ),
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
