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
  textStyle?: StyleProp<TextStyle>;
  highlight: string;
  highlightStyle?: StyleProp<ViewStyle>;
  highlightTextStyle?: StyleProp<TextStyle>;
  fontSize?: number;
}

export const BrandingHeader: FC<Props> = ({
  textStyle,
  highlight,
  highlightStyle,
  highlightTextStyle,
  fontSize = 24,
  children,
}) => {
  const isLight = useColorScheme() === "light";

  const commonStyle = { fontSize };

  return (
    <View style={[styles.brandingWrapper]}>
      <Text
        style={[
          styles.title,
          commonStyle,
          {
            color: isLight
              ? colors.default.black[400]
              : colors.default.white[100],
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
      <View style={[styles.highlight, highlightStyle]}>
        <Text style={[styles.highlightedText, commonStyle, highlightTextStyle]}>
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
