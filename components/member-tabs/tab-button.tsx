import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { TabTriggerSlotProps } from "expo-router/ui";
import { forwardRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

export const TabButton = forwardRef<View, TabTriggerSlotProps>(
  ({ style, children, ...props }, ref) => {
    const sv = useDerivedValue(
      () =>
        props.isFocused
          ? withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) })
          : withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) }),
      [props.isFocused]
    );

    const wrapperStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        sv.value,
        [0, 1],
        ["transparent", colors.default.tint.translucid[600]]
      );

      return { backgroundColor };
    });

    return (
      <Pressable ref={ref} style={[styles.container]} {...props}>
        <Animated.View style={[styles.innerView, wrapperStyle]}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.text,
              props.isFocused && { fontFamily: fonts.poppinsMedium },
            ]}
          >
            {children}
          </Text>
        </Animated.View>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 1,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    width: "100%",
  },
  text: {
    fontSize: 16,
    paddingTop: 4,
    fontFamily: fonts.poppins,
    textTransform: "capitalize",
    color: colors.default.white[100],
  },
});
