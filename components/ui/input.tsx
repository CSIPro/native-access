import { FC, ReactNode, forwardRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

interface Props extends TextInputProps {
  label: string;
  icon?: ReactNode;
  helperText?: string;
  errorText?: string;
}

export const Input = forwardRef<TextInput, Props>(function (
  { label, icon: Icon, helperText, errorText, style, ...props },
  ref
) {
  const [focused, setFocused] = useState(false);
  const progress = useDerivedValue(
    () => (focused ? withTiming(1) : withTiming(0)),
    [focused]
  );

  const isLight = useColorScheme() === "light";

  const viewStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [
        isLight
          ? colors.default.gray.translucid[100]
          : colors.default.gray.translucid[50],
        colors.default.tint.translucid[100],
      ]
    );

    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [
        isLight
          ? colors.default.tint.translucid[500]
          : colors.default.tint.translucid[600],
        isLight ? colors.default.tint[300] : colors.default.tint[200],
      ]
    );

    return {
      backgroundColor,
      borderColor,
    };
  });

  const labelStyles = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [
        isLight ? colors.default.black[400] : colors.default.white[100],
        isLight ? colors.default.tint[300] : colors.default.tint[100],
      ]
    );

    return { color };
  });

  const color = isLight ? colors.default.black[400] : colors.default.white[100];

  const placeholderColor = isLight
    ? colors.default.gray[600]
    : colors.default.gray.translucid[500];
  const selectionColor = isLight
    ? colors.default.secondary.translucid[400]
    : colors.default.secondary.translucid[500];

  return (
    <View style={[styles.wrapper]}>
      <View style={[styles.labelWrapper]}>
        <Animated.Text style={[styles.text, labelStyles]}>
          {label}
        </Animated.Text>
      </View>
      <Animated.View style={[styles.inputWrapper, viewStyles]}>
        {!!Icon && <View style={[styles.iconWrapper]}>{Icon}</View>}
        <TextInput
          ref={ref}
          {...props}
          selectionColor={selectionColor}
          placeholderTextColor={placeholderColor}
          onFocus={(_) => setFocused(true)}
          onBlur={(_) => setFocused(false)}
          style={[styles.input, styles.text, { color }, style]}
        />
      </Animated.View>
      {!!errorText ? (
        <InputErrorText>{errorText}</InputErrorText>
      ) : (
        !!helperText && <InputHelperText>{helperText}</InputHelperText>
      )}
    </View>
  );
});

export const InputHelperText: FC<{ children: ReactNode }> = ({ children }) => {
  const isLight = useColorScheme() === "light";

  const helperTextColor = isLight
    ? colors.default.black.translucid[600]
    : colors.default.gray.translucid[800];

  return (
    <View style={[styles.infoWrapper]}>
      <Text
        style={[styles.text, styles.helperText, { color: helperTextColor }]}
      >
        {children}
      </Text>
    </View>
  );
};

export const InputErrorText: FC<{ children: ReactNode }> = ({ children }) => {
  const isLight = useColorScheme() === "light";

  const errorTextColor = isLight
    ? colors.default.secondary[400]
    : colors.default.secondary[200];

  return (
    <View style={[styles.infoWrapper]}>
      <Text style={[styles.text, styles.errorText, { color: errorTextColor }]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: -4,
  },
  inputWrapper: {
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrapper: {
    width: 24,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  labelWrapper: {
    paddingHorizontal: 8,
  },
  input: {
    width: "100%",
  },
  text: {
    fontFamily: fonts.poppins,
    fontSize: 16,
    paddingTop: 4,
  },
  infoWrapper: {
    paddingTop: 4,
    paddingHorizontal: 8,
  },
  helperText: {
    fontSize: 14,
    fontFamily: fonts.poppinsLight,
  },
  errorText: {
    fontSize: 14,
    fontFamily: fonts.poppinsLight,
  },
});
