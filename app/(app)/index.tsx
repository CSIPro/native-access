import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import {
  Canvas,
  Group,
  LinearGradient as SkiaGradient,
  Rect,
  RoundedRect,
  useCanvasRef,
  vec,
} from "@shopify/react-native-skia";

import { PibleScanner } from "@/components/pible/pible-scanner";
import { RoomPicker } from "@/components/room-picker/room-picker";
import { DashboardItem } from "@/components/ui/dashboard/item";

import {
  useBluetoothLogs,
  useFailedLogs,
  useSuccessfulLogs,
  useUnknownLogs,
  useUserBluetoothLogs,
  useUserFailedLogs,
  useUserSuccessfulLogs,
} from "@/hooks/use-logs";

import fonts from "@/constants/fonts";
import colors from "@/constants/colors";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useUserContext } from "@/context/user-context";
import { LogsList } from "@/components/logs/logs-list";
import { BrandingHeader } from "@/components/ui/branding-header";

export default function Home() {
  const { user } = useUserContext();
  const colorScheme = useColorScheme();
  const tabsHeight = useBottomTabBarHeight() + 4;

  const isLight = colorScheme === "light";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isLight
          ? colors.default.white[100]
          : colors.default.tint[400],
      }}
    >
      <View style={[{ paddingVertical: 8 }]}>
        <BrandingHeader
          highlight="ACCESS"
          highlightStyle={[{ backgroundColor: colors.default.white[100] }]}
          highlightTextStyle={[
            { color: colors.default.tint[400], fontFamily: fonts.poppinsBold },
          ]}
        >
          CSI PRO
        </BrandingHeader>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: isLight
            ? colors.default.white[100]
            : colors.default.black[400],
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            width: "100%",
            alignItems: "center",
            padding: 8,
            paddingBottom: tabsHeight + 112,
            gap: 6,
            borderRadius: 24,
          }}
        >
          <View style={[{ paddingVertical: 8 }]}>
            <BrandingHeader highlight="STATS">ROOM</BrandingHeader>
          </View>
          <View style={[{ flexDirection: "row", gap: 6 }]}>
            <SuccessfulLogs />
            <View style={[{ gap: 6, flex: 1 }]}>
              <BluetoothLogs />
              <FailedLogs />
            </View>
          </View>
          <View
            style={[
              {
                flex: 1,
                minHeight: 200,
                width: "100%",
                padding: 4,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: colors.default.tint[400],
                backgroundColor: colors.default.tint.translucid[100],
              },
            ]}
          >
            <LogsList disableScroll limit={3} />
          </View>
          <View style={[{ paddingVertical: 8 }]}>
            <BrandingHeader highlight="STATS">PERSONAL</BrandingHeader>
          </View>
          <View style={[{ flexDirection: "row", gap: 6 }]}>
            <View style={[{ gap: 6, flex: 1 }]}>
              <BluetoothPersonalLogs />
              <FailedPersonalLogs />
            </View>
            <SuccessfulPersonalLogs />
          </View>
        </ScrollView>
        <PibleScanner />
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const SuccessfulLogs = () => {
  const isLight = useColorScheme() === "light";
  const { logs: successfulLogs } = useSuccessfulLogs();
  const sv = useSharedValue(0);

  useEffect(() => {
    sv.value = withRepeat(withTiming(1, { duration: 500 }), 2, true);
  }, [successfulLogs?.length]);

  const animatedItem = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      sv.value,
      [0, 1],
      [
        isLight
          ? colors.default.tint.translucid[500]
          : colors.default.tint.translucid[100],
        isLight
          ? colors.default.tint.translucid[400]
          : colors.default.tint.translucid[400],
      ]
    );

    return {
      backgroundColor,
    };
  });

  return (
    <Animated.View
      style={[
        styles.successContainer,
        animatedItem,
        {
          borderColor: colors.default.tint[400],
        },
      ]}
    >
      <Text
        style={[
          styles.bubbleText,
          {
            color: colors.default.white[100],
            fontSize: 72,
            fontFamily: fonts.poppins,
          },
        ]}
      >
        {successfulLogs?.length.toString().padStart(2, "0") ?? "00"}
      </Text>
      <Text
        style={[
          styles.bubbleText,
          {
            color: isLight
              ? colors.default.white[100]
              : colors.default.white.translucid[900],
            fontSize: 16,
          },
        ]}
      >
        Entries
      </Text>
    </Animated.View>
  );
};

const BluetoothLogs = () => {
  const { logs } = useBluetoothLogs();

  return (
    <DashboardItem
      icon="bluetooth"
      title="Wireless"
      color="bluetooth"
      logs={logs?.length ?? 0}
    />
  );
};

const UnknownLogs = () => {
  const { logs } = useUnknownLogs();

  return (
    <DashboardItem
      icon="help-circle"
      color="tintAccent"
      title="Unknown"
      logs={logs?.length ?? 0}
    />
  );
};

const FailedLogs = () => {
  const { logs } = useFailedLogs();

  return (
    <DashboardItem
      icon="close-circle"
      color="secondary"
      title="Failed"
      logs={logs?.length ?? 0}
    />
  );
};

const SuccessfulPersonalLogs = () => {
  const isLight = useColorScheme() === "light";
  const { logs: successfulLogs } = useUserSuccessfulLogs();
  const sv = useSharedValue(0);

  useEffect(() => {
    sv.value = withRepeat(withTiming(1, { duration: 500 }), 2, true);
  }, [successfulLogs?.length]);

  const animatedItem = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      sv.value,
      [0, 1],
      [
        isLight
          ? colors.default.tint.translucid[500]
          : colors.default.tint.translucid[100],
        isLight
          ? colors.default.tint.translucid[400]
          : colors.default.tint.translucid[400],
      ]
    );

    return {
      backgroundColor,
    };
  });

  return (
    <Animated.View
      style={[
        styles.successContainer,
        animatedItem,
        {
          borderColor: colors.default.tint[400],
        },
      ]}
    >
      <Text
        style={[
          styles.bubbleText,
          {
            color: colors.default.white[100],
            fontSize: 72,
            fontFamily: fonts.poppins,
          },
        ]}
      >
        {successfulLogs?.length.toString().padStart(2, "0") ?? "00"}
      </Text>
      <Text
        style={[
          styles.bubbleText,
          {
            color: isLight
              ? colors.default.white[100]
              : colors.default.white.translucid[900],
            fontSize: 16,
          },
        ]}
      >
        Entries
      </Text>
    </Animated.View>
  );
};

const BluetoothPersonalLogs = () => {
  const { logs } = useUserBluetoothLogs();

  return (
    <DashboardItem
      icon="bluetooth"
      title="Wireless"
      color="bluetooth"
      logs={logs?.length ?? 0}
    />
  );
};

const FailedPersonalLogs = () => {
  const { logs } = useUserFailedLogs();

  return (
    <DashboardItem
      icon="close-circle"
      title="Failed"
      color="secondary"
      logs={logs?.length ?? 0}
    />
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
    flex: 2,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: -36,
    borderWidth: 2,
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
    gap: 12,
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
    alignItems: "center",
    backgroundColor: "#fff",
    width: 100,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: "hidden",
  },
  dataTextContainer: {
    alignItems: "center",
    gap: -12,
  },
  dataContainerHighlight: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
  },
  bubbleText: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 14,
  },
});
