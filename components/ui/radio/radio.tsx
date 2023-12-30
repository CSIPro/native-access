import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { FC, ReactNode, createContext, useContext } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface RadioContext {
  value: string;
  onChange: (value: string) => void;
}

const RadioContext = createContext<RadioContext | null>(null);

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}

export const RadioGroup: FC<RadioGroupProps> = ({
  value,
  onChange,
  children,
}) => {
  return (
    <View style={[styles.radioGroup]}>
      <RadioContext.Provider value={{ value, onChange }}>
        {children}
      </RadioContext.Provider>
    </View>
  );
};

const useRadioContext = () => {
  const context = useContext(RadioContext);

  if (!context) {
    throw new Error(
      "RadioGroup compound components cannot be rendered outside the RadioGroup component"
    );
  }

  return context;
};

interface RadioButtonProps {
  value: string;
  children: ReactNode;
}

export const RadioButton: FC<RadioButtonProps> = ({ value, children }) => {
  const { value: groupValue, onChange } = useRadioContext();
  const isLight = useColorScheme() === "light";

  const isSelected = groupValue === value;

  const progress = useDerivedValue(() =>
    isSelected ? withTiming(1) : withTiming(0)
  );

  const scale = useDerivedValue(() =>
    isSelected ? withSpring(1) : withTiming(0)
  );

  const itemStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [
        "transparent",
        isLight
          ? colors.default.tint.translucid[100]
          : colors.default.tint.translucid[200],
      ]
    );

    return {
      backgroundColor,
    };
  });

  const highlightStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const highlightColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[100];

  const textColor = isSelected
    ? isLight
      ? colors.default.tint[400]
      : colors.default.tint[100]
    : isLight
    ? colors.default.black[400]
    : colors.default.white[100];

  return (
    <Pressable onPress={() => onChange(value)} style={[{ width: "100%" }]}>
      <Animated.View style={[styles.radioItem, itemStyle]}>
        <View style={[styles.radioOutline, { borderColor: textColor }]}>
          <Animated.View
            style={[
              styles.currentRadio,
              highlightStyle,
              { backgroundColor: highlightColor },
            ]}
          />
        </View>
        <Text style={[styles.text, { color: textColor }]}>{children}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  radioGroup: {
    width: "100%",
    gap: 4,
  },
  radioItem: {
    padding: 4,
    paddingHorizontal: 8,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
  },
  text: {
    fontFamily: fonts.poppins,
    fontSize: 16,
    paddingTop: 4,
  },
  radioOutline: {
    borderRadius: 9999,
    height: 20,
    aspectRatio: 1,
    borderWidth: 2,
    padding: 3,
  },
  currentRadio: {
    width: "100%",
    height: "100%",
    borderRadius: 9999,
  },
});
