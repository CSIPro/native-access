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

const variants = {
  default: {
    view: {
      light: { backgroundColor: colors.default.tint.translucid[100] },
      dark: { backgroundColor: colors.default.tint.translucid[100] },
    },
    text: {
      light: { color: colors.default.tint[400] },
      dark: { color: colors.default.tint[100] },
    },
  },
  secondary: {
    view: {
      light: { backgroundColor: colors.default.secondary.translucid[100] },
      dark: { backgroundColor: colors.default.secondary.translucid[100] },
    },
    text: {
      light: { color: colors.default.secondary[400] },
      dark: { color: colors.default.secondary[100] },
    },
  },
};

interface Props {
  variant?: keyof typeof variants;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export const TextButton: FC<Props> = ({
  variant = "default",
  children,
  style,
  textStyle,
  wrapperStyle,
  onPress,
}) => {
  const colorScheme = useColorScheme();

  return (
    <Pressable onPress={onPress} style={[wrapperStyle]}>
      <View
        style={[
          styles.textButton,
          variants[variant].view[colorScheme ?? "light"],
          style,
        ]}
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
      </View>
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
