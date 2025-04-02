import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { FC, ReactNode } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  useColorScheme,
  ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

interface Props extends PressableProps {
  isActive?: boolean;
  style?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export const RestrictionDayButton: FC<Props> = ({
  children,
  isActive = false,
  onPress,
  style,
  wrapperStyle,
  ...props
}) => {
  const sv = useDerivedValue(() =>
    isActive
      ? withTiming(1, { easing: Easing.in(Easing.ease), duration: 250 })
      : withTiming(0, { easing: Easing.out(Easing.ease), duration: 250 })
  );
  const isLight = useColorScheme() === "light";

  const viewStyles = useAnimatedStyle(() => {
    const opacity = interpolate(sv.value, [0, 1], [0.3, 1]);

    const backgroundColor = isLight
      ? colors.default.tint.translucid[600]
      : colors.default.tint.translucid[400];

    return { backgroundColor, opacity };
  });

  return (
    <Pressable onPress={onPress} style={wrapperStyle} {...props}>
      <Animated.View style={[styles.container, viewStyles, style]}>
        <Text style={[styles.text]}>{children}</Text>
      </Animated.View>
    </Pressable>
  );
};

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    color: colors.default.white[100],
  },
});
