import { FC, ReactNode, useEffect } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

interface Props {
  logs: number;
  color: keyof typeof colors.default;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const DashboardItem: FC<Props> = ({ logs, color, children, style }) => {
  const sv = useSharedValue(0);
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  useEffect(() => {
    if (logs === 0) return;

    sv.value = withRepeat(withTiming(1, { duration: 500 }), 4, true);
  }, [logs]);

  const animatedItem = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      sv.value,
      [0, 1],
      [
        isLight
          ? colors.default[color].translucid[500]
          : colors.default[color].translucid[100],
        isLight
          ? colors.default[color].translucid[800]
          : colors.default[color].translucid[400],
      ]
    );

    return {
      backgroundColor,
    };
  });

  return (
    <Animated.View
      style={[
        styles.dataContainer,
        animatedItem,
        {
          borderWidth: 2,
          borderColor: colors.default[color][400],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

interface DashboardItemBackgroundProps {
  children: ReactNode;
}

export const DashboardItemBackground: FC<DashboardItemBackgroundProps> = ({
  children,
}) => {
  return (
    <View
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          height: "160%",
          width: "175%",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      {children}
    </View>
  );
};

interface ItemContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const DashboardItemContent: FC<ItemContentProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.dataTextContainer, style]}>{children}</View>;
};

interface ItemTextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export const DashboardItemValue: FC<ItemTextProps> = ({ children, style }) => {
  return (
    <Text
      style={[
        styles.bubbleText,
        {
          fontSize: 40,
          color: colors.default.white[100],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const DashboardItemTitle: FC<ItemTextProps> = ({ children, style }) => {
  const isLight = useColorScheme() === "light";

  return (
    <Text
      numberOfLines={1}
      style={[
        styles.bubbleText,
        {
          color: isLight
            ? colors.default.white[100]
            : colors.default.white.translucid[900],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  dashboardTitle: {
    fontFamily: fonts.inter,
    color: "#222222",
    fontSize: 24,
  },
  logsBubble: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    height: 200,
    width: 200,
  },
  successContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    gap: -28,
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },
  successShadow: {
    backgroundColor: "transparent",
    borderRadius: 100,
    shadowColor: "#222222",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },
  dashboardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  dataContainerShadow: {
    backgroundColor: "transparent",
    borderRadius: 8,
    shadowColor: "#222222",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
  dataContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    // width: 100,
    borderRadius: 8,
    flex: 1,
    padding: 8,
    overflow: "hidden",
    // aspectRatio: 1,
  },
  dataTextContainer: {
    alignItems: "center",
    gap: -8,
  },
  dataContainerHighlight: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
  },
  bubbleText: {
    textAlign: "center",
    fontFamily: fonts.interMedium,
    fontSize: 14,
  },
});
