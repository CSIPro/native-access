import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { FC, forwardRef, ReactNode } from "react";
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
  icon?: ReactNode;
}

export const TextButton = forwardRef<View, Props>(function (
  {
    variant = "default",
    children,
    style,
    textStyle,
    wrapperStyle,
    onPress,
    icon: Icon,
    ...props
  },
  ref
) {
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
    <Pressable ref={ref} onPress={onPress} style={[wrapperStyle]}>
      <Animated.View
        style={[
          styles.textButton,
          viewStyles,
          { paddingHorizontal: Icon ? 8 : 16 },
          style,
        ]}
        onTouchStart={onPressIn}
        onTouchEnd={onPressOut}
      >
        {Icon ? (
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: isLight
                  ? colors.default.tint.translucid[200]
                  : colors.default.black.translucid[200],
              },
            ]}
          >
            {Icon}
          </View>
        ) : null}
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
});

const styles = StyleSheet.create({
  iconWrapper: {
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    padding: 4,
  },
  textButton: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  text: {
    fontFamily: fonts.poppinsMedium,
    paddingTop: 4,
    fontSize: 16,
  },
});
