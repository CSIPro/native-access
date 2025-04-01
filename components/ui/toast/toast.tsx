import { FC, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { IonIcon } from "@/components/icons/ion";
import Animated, {
  Easing,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { usePathname } from "expo-router";

interface Props {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration: number;
  hide?: () => void;
}

const variantIcons = {
  success: (
    <IonIcon
      name="checkmark-circle"
      size={24}
      color={colors.default.tint[300]}
    />
  ),
  error: (
    <IonIcon
      name="close-circle"
      size={24}
      color={colors.default.secondary[400]}
    />
  ),
  warning: (
    <IonIcon name="warning" size={24} color={colors.default.tintAccent[400]} />
  ),
  info: (
    <IonIcon
      name="information-circle"
      size={24}
      color={colors.default.tint[300]}
    />
  ),
};

export const Toast: FC<Props> = ({
  variant,
  title,
  description,
  duration,
  hide,
}) => {
  const pathname = usePathname();
  const Icon = variantIcons[variant];

  const bottom =
    pathname === "/" ? 150 : pathname.startsWith("/events") ? 16 : 80;

  return (
    <Animated.View
      entering={SlideInDown}
      exiting={SlideOutDown}
      style={[styles.wrapper, { bottom }]}
    >
      <View style={[styles.content]}>
        {Icon}
        <View style={[styles.textContainer]}>
          <Text numberOfLines={2} style={[styles.text, styles.title]}>
            {title}
          </Text>
          {description ? (
            <Text numberOfLines={3} style={[styles.text, styles.description]}>
              {description}
            </Text>
          ) : null}
        </View>
        <ToastDuration duration={duration} />
      </View>
    </Animated.View>
  );
};

interface ToastDurationProps {
  duration: number;
}

const ToastDuration: FC<ToastDurationProps> = ({ duration }) => {
  const sv = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: `${sv.value * 100}%`,
    };
  });

  useEffect(() => {
    sv.value = withTiming(0, { duration, easing: Easing.out(Easing.ease) });
  }, []);

  return (
    <View style={[styles.progressWrapper]}>
      <Animated.View style={[styles.progress, animatedStyles]}></Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 999,
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 4,
    backgroundColor: colors.default.black[400],
    overflow: "hidden",
  },
  content: {
    flex: 1,
    backgroundColor: colors.default.tint.translucid[50],
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
  },
  textContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 2,
  },
  text: {
    color: colors.default.white[100],
    fontSize: 16,
    fontFamily: fonts.inter,
  },
  title: {
    fontFamily: fonts.interMedium,
  },
  description: {
    color: colors.default.gray[300],
    fontSize: 14,
  },
  progressWrapper: {
    height: 4,
    backgroundColor: colors.default.black[300],
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  progress: {
    height: "100%",
    width: "100%",
    backgroundColor: colors.default.tint[300],
  },
});
