import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PibleScanner } from "../../components/pible/pible-scanner";

import colors from "../../constants/colors";
import {
  useBluetoothLogs,
  useFailedLogs,
  useSuccessfulLogs,
  useUnknownLogs,
  useUserBluetoothLogs,
  useUserFailedLogs,
  useUserSuccessfulLogs,
} from "../../hooks/use-logs";
import fonts from "../../constants/fonts";
import { PasscodePromptModal } from "../../components/passcode-prompt/passcode-prompt";
import { FC } from "react";
import { RoomPicker } from "../../components/room-picker/room-picker";
import { DashboardItem } from "../../components/ui/dashboard/item";
import { StatusBar } from "expo-status-bar";
import { useStore } from "../../store/store";

export default function Home() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const openModal = useStore((state) => state.openPasscodeModal);
  const closeModal = useStore((state) => state.onClosePasscodeModal);

  const palette = colors[colorScheme];

  const isLight = colorScheme === "light";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: palette.tint,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
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
    </View>
  );
}

interface DashboardItemProps {
  isLight?: boolean;
}

const SuccessfulLogs: FC<DashboardItemProps> = ({ isLight = false }) => {
  const { logs } = useSuccessfulLogs();

  return (
    <View
      style={[
        styles.successContainer,
        {
          backgroundColor: isLight
            ? colors.default.tint.translucid[100]
            : colors.default.tint.translucid[100],
          borderWidth: 2,
          borderColor: isLight
            ? colors.default.tint[400]
            : colors.default.tint[400],
        },
      ]}
    >
      <Text
        style={[
          styles.bubbleText,
          {
            color: isLight
              ? colors.default.tint[500]
              : colors.default.tint[200],
            fontSize: 72,
            fontFamily: fonts.poppins,
          },
        ]}
      >
        {logs.length}
      </Text>
      <Text
        style={[
          styles.bubbleText,
          {
            color: isLight
              ? colors.default.tint[300]
              : colors.default.tint[200],
            fontSize: 16,
          },
        ]}
      >
        Entries
      </Text>
    </View>
  );
};

const BluetoothLogs = () => {
  const { logs } = useBluetoothLogs();

  return (
    <DashboardItem
      icon="bluetooth"
      title="Wireless"
      color="bluetooth"
      logs={logs}
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
      logs={logs}
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
      logs={logs}
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
      logs={logs}
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
      logs={logs}
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
      logs={logs}
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
