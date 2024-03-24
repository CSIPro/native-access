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
  highlight: string;
  highlightStyle?: StyleProp<ViewStyle>;
  highlightTextStyle?: StyleProp<TextStyle>;
}

export const BrandingHeader: FC<Props> = ({
  highlight,
  highlightStyle,
  highlightTextStyle,
  children,
}) => {
  const isLight = useColorScheme() === "light";

  return (
    <View style={[styles.brandingWrapper]}>
      <Text
        style={[
          styles.title,
          {
            color: isLight
              ? colors.default.black[400]
              : colors.default.white[100],
          },
        ]}
      >
        {children}
      </Text>
      <View style={[styles.highlight, highlightStyle]}>
        <Text style={[styles.highlightedText, highlightTextStyle]}>
          {highlight}
        </Text>
      </View>
    </View>
  );
};

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
