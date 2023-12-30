import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
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

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Card: FC<Props> = ({ style, children }) => {
  const isLight = useColorScheme() === "light";

  const backgroundColor = isLight
    ? colors.default.white[100]
    : colors.default.black[300];

  const borderColor = isLight
    ? colors.default.gray[400]
    : colors.default.black[100];

  return (
    // <View style={[styles.cardShadow]}>
    <View style={[styles.card, { borderColor, backgroundColor }, style]}>
      {children}
    </View>
    // </View>
  );
};

interface CardHeaderProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: ReactNode;
}

export const CardHeader: FC<CardHeaderProps> = ({
  style,
  textStyle,
  children,
}) => {
  const isLight = useColorScheme() === "light";

  const textColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];

  const borderBottomColor = isLight
    ? colors.default.gray[400]
    : colors.default.black[100];

  return (
    <View style={[styles.cardHeader, { borderBottomColor }, style]}>
      <Text style={[styles.cardHeaderText, { color: textColor }, textStyle]}>
        {children}
      </Text>
    </View>
  );
};

interface CardBodyProps {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export const CardBody: FC<CardBodyProps> = ({ style, children }) => {
  return <View style={[styles.cardBody, style]}>{children}</View>;
};

interface CardFooterProps {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export const CardFooter: FC<CardFooterProps> = ({ style, children }) => {
  const isLight = useColorScheme() === "light";

  const borderTopColor = isLight
    ? colors.default.gray[400]
    : colors.default.black[100];

  return (
    <View style={[styles.cardFooter, { borderTopColor }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
  },
  cardHeader: {
    width: "100%",
    padding: 8,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  cardHeaderText: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 18,
  },
  cardBody: {
    padding: 8,
    gap: 4,
    width: "100%",
  },
  cardFooter: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 8,
    gap: 4,
    borderTopWidth: 1,
  },
});
