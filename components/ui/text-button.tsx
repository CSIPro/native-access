import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { FC, ReactNode } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const variants = {
  default: {
    view: {
      light: {
        blur: colors.default.tint.translucid[100],
        focus: colors.default.tint.translucid[200],
      },
      dark: {
        blur: colors.default.tint.translucid[100],
        focus: colors.default.tint.translucid[200],
      },
    },
    text: {
      light: { color: colors.default.tint[400] },
      dark: { color: colors.default.tint[100] },
    },
  },
  secondary: {
    view: {
      light: {
        blur: colors.default.secondary.translucid[100],
        focus: colors.default.secondary.translucid[200],
      },
      dark: {
        blur: colors.default.secondary.translucid[100],
        focus: colors.default.secondary.translucid[200],
      },
    },
    text: {
      light: { color: colors.default.secondary[400] },
      dark: { color: colors.default.secondary[100] },
    },
  },
};

interface Props extends PressableProps {
  variant?: keyof typeof variants;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
}

export const TextButton: FC<Props> = ({
  variant = "default",
  children,
  style,
  textStyle,
  wrapperStyle,
  onPress,
}) => {
  const sv = useSharedValue(0);
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const viewStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      sv.value,
      [0, 1],
      [
        variants[variant].view[colorScheme].blur,
        variants[variant].view[colorScheme].focus,
      ]
    );

    return { backgroundColor };
  });

  const onPressIn = () => {
    sv.value = withTiming(1, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const onPressOut = () => {
    sv.value = withTiming(0, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
  };

  return (
    <Pressable onPress={onPress} style={[wrapperStyle]}>
      <Animated.View
        style={[styles.textButton, viewStyles, style]}
        onTouchStart={onPressIn}
        onTouchEnd={onPressOut}
      >
        <Text
          style={[
            styles.text,
            variants[variant].text[colorScheme ?? "light"],
            textStyle,
          ]}
        >
          {children}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  textButton: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: fonts.poppinsMedium,
    paddingTop: 4,
    fontSize: 16,
  },
});
