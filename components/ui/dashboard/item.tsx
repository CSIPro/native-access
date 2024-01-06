import { ComponentProps, FC, useEffect } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { IonIcon } from "@/components/icons/ion";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

interface Props {
  logs: number;
  title: string;
  color: keyof typeof colors.default;
  icon: ComponentProps<typeof IonIcon>["name"];
}

export const DashboardItem: FC<Props> = ({ logs, title, icon, color }) => {
  const sv = useSharedValue(0);
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  useEffect(() => {
    if (logs === 0) return;

    sv.value = withRepeat(withTiming(1, { duration: 500 }), 2, true);
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

  const iconColor = colors.default[color].translucid[600];

  return (
    <Animated.View
      style={[
        styles.dataContainer,
        animatedItem,
        {
          borderWidth: 2,
          borderColor: colors.default[color][400],
        },
      ]}
    >
      <View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            height: "160%",
            width: "175%",
            // backgroundColor: "red",
            // top: 12,
            // left: 24,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <IonIcon name={icon} color={iconColor} size={112} />
      </View>
      <View style={[styles.dataTextContainer]}>
        <Text
          style={[
            styles.bubbleText,
            {
              fontSize: 40,
              color: colors.default.white[100],
            },
          ]}
        >
          {logs}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            styles.bubbleText,
            {
              color: isLight
                ? colors.default.white[100]
                : colors.default.white.translucid[900],
            },
          ]}
        >
          {title}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dashboardTitle: {
    fontFamily: fonts.poppins,
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
    gap: -20,
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
    fontFamily: fonts.poppinsMedium,
    fontSize: 14,
  },
});
