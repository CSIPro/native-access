import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { PasscodePromptModal } from "@/components/passcode-prompt/passcode-prompt";
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

import { useStore } from "@/store/store";

import fonts from "@/constants/fonts";
import colors from "@/constants/colors";

export default function Home() {
  const colorScheme = useColorScheme();
  const openModal = useStore((state) => state.openPasscodeModal);
  const closeModal = useStore((state) => state.onClosePasscodeModal);

  const palette = colors[colorScheme];

  const isLight = colorScheme === "light";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: palette.tint,
        gap: 8,
      }}
    >
      <PibleScanner />
      <View
        style={{
          flex: 3,
          backgroundColor:
            colorScheme === "light"
              ? colors.default.white[100]
              : colors.default.black[400],
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            width: "100%",
            alignItems: "center",
            padding: 8,
            gap: 4,
          }}
        >
          <RoomPicker />
          <Text
            style={[
              styles.dashboardTitle,
              {
                color: isLight
                  ? colors.default.black[400]
                  : colors.default.white[100],
              },
            ]}
          >
            Room stats
          </Text>
          <SuccessfulLogs />
          <View style={[styles.dashboardRow, { paddingTop: 4 }]}>
            <BluetoothLogs />
            <FailedLogs />
            <UnknownLogs />
          </View>
          <Text
            style={[
              styles.dashboardTitle,
              {
                color: isLight
                  ? colors.default.black[400]
                  : colors.default.white[100],
              },
            ]}
          >
            Personal stats
          </Text>
          <View style={[styles.dashboardRow, { width: "100%" }]}>
            <BluetoothPersonalLogs />
            <FailedPersonalLogs />
            <SuccessfulPersonalLogs />
          </View>
        </ScrollView>
      </View>
      <PasscodePromptModal isOpen={openModal} onClose={closeModal} />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const SuccessfulLogs = () => {
  const isLight = useColorScheme() === "light";
  const { logs } = useSuccessfulLogs();
  const sv = useSharedValue(0);

  useEffect(() => {
    if (!logs || logs?.length === 0) return;

    sv.value = withRepeat(withTiming(1, { duration: 500 }), 2, true);
  }, [logs?.length]);

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
          borderWidth: 2,
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
        {logs?.length ?? 0}
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
  const { logs } = useUserSuccessfulLogs();

  return (
    <DashboardItem
      icon="checkmark-circle"
      title="Entries"
      color="success"
      logs={logs?.length ?? 0}
    />
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
    flex: 1,
    height: 200,
    aspectRatio: 1,
    borderRadius: 100,
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
