import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { FC, ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  useColorScheme,
} from "react-native";
import { IonIcon } from "../icons/ion";

interface CheckboxProps {
  disabled?: boolean;
  checked?: boolean;
  onChange: () => void;
  children: ReactNode;
}

export const Checkbox: FC<CheckboxProps> = ({
  disabled = false,
  checked = false,
  onChange,
  children,
}) => {
  const isLight = useColorScheme() === "light";

  const borderColor = isLight
    ? checked
      ? colors.default.tint[400]
      : colors.default.white[100]
    : checked
    ? colors.default.tint[400]
    : colors.default.white[100];
  const backgroundColor = checked
    ? colors.default.tint.translucid[400]
    : "transparent";
  const iconColor = isLight
    ? colors.default.white[100]
    : colors.default.white[100];

  return (
    <Pressable
      style={[styles.container, disabled && styles.disabled]}
      onPress={disabled ? null : onChange}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderColor,
            backgroundColor,
          },
        ]}
      >
        {checked && <IonIcon name="checkmark" color={iconColor} size={16} />}
      </View>
      {children}
    </Pressable>
  );
};

interface CheckboxLabelProps {
  style?: StyleProp<TextStyle>;
  children: ReactNode;
}

export const CheckboxLabel: FC<CheckboxLabelProps> = ({ children, style }) => {
  const isLight = useColorScheme() === "light";

  return (
    <Text
      style={[
        styles.label,
        {
          color: isLight
            ? colors.default.black[400]
            : colors.default.white[100],
        },
        style,
      ]}
      numberOfLines={1}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 4,
  },
  checkbox: {
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    aspectRatio: 1,
    borderRadius: 4,
    borderWidth: 2,
  },
  label: {
    fontFamily: fonts.poppins,
    fontSize: 16,
    paddingTop: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
