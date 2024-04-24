import { FC, ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

interface Props {
  children: ReactNode;
}

export const BrandingHeader: FC<Props> = ({ children }) => (
  <View style={[styles.brandingWrapper]}>{children}</View>
);

interface TitleProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export const BrandingHeaderTitle: FC<TitleProps> = ({ children, style }) => {
  const isLight = useColorScheme() === "light";

  return (
    <Text
      style={[
        styles.title,
        {
          color: isLight
            ? colors.default.black[400]
            : colors.default.white[100],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

interface HighlightProps {
  children: ReactNode;
  textStyle?: StyleProp<TextStyle>;
  highlightStyle?: StyleProp<ViewStyle>;
}

export const BrandingHeaderHighlight: FC<HighlightProps> = ({
  children,
  textStyle,
  highlightStyle,
}) => (
  <View style={[styles.highlight, highlightStyle]}>
    <Text style={[styles.highlightedText, textStyle]}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  brandingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  title: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 24,
    paddingTop: 4,
    textTransform: "uppercase",
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  highlight: {
    paddingHorizontal: 4,
    backgroundColor: colors.default.tint[400],
    borderRadius: 4,
  },
  highlightedText: {
    textTransform: "uppercase",
    fontFamily: fonts.poppinsMedium,
    fontSize: 24,
    paddingTop: 4,
    color: colors.default.white[100],
  },
});
