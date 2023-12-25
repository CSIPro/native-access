import {
  KeyboardAvoidingView,
  Platform,
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
  useUserLogs,
  useUserSuccessfulLogs,
} from "../../hooks/use-logs";
import fonts from "../../constants/fonts";
import { IonIcon } from "../../components/icons/ion";
import { PasscodePromptModal } from "../../components/passcode-prompt/passcode-prompt";
import { FC, useState } from "react";
import { useBLE } from "../../context/ble-context";
import { RoomPicker } from "../../components/room-picker/room-picker";
import { DashboardItem } from "../../components/ui/dashboard/item";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { openModal, closeModal } = useBLE();

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
            gap: 8,
          }}
        >
          <RoomPicker />
          <View style={{ alignItems: "center", gap: 4, width: "100%" }}>
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
              Summary
            </Text>
            <SuccessfulLogs isLight={isLight} />
          </View>
          <View style={styles.dashboardRow}>
            <BluetoothLogs isLight={isLight} />
            <FailedLogs isLight={isLight} />
            <UnknownLogs isLight={isLight} />
          </View>
          <View style={{ alignItems: "center", gap: 4, width: "100%" }}>
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
              Personal
            </Text>
            <View style={[styles.dashboardRow, { width: "100%" }]}>
              <BluetoothPersonalLogs isLight={isLight} />
              <FailedPersonalLogs isLight={isLight} />
              <SuccessfulPersonalLogs />
            </View>
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
    <View style={styles.successShadow}>
      <View
        style={[
          styles.logsBubble,
          {
            backgroundColor: isLight
              ? colors.default.white[100]
              : colors.default.black[300],
          },
        ]}
      >
        <View
          style={[
            styles.successContainer,
            {
              backgroundColor: isLight
                ? colors.default.white[100]
                : colors.default.black[300],
              borderColor: isLight
                ? colors.default.gray[100]
                : colors.default.black[100],
              borderBlockEndColor: isLight
                ? colors.default.tint[400]
                : colors.default.tint[200],
              borderBottomWidth: 4,
            },
          ]}
        >
          <Text
            style={[
              styles.bubbleText,
              {
                color: isLight
                  ? colors.default.black[400]
                  : colors.default.white[100],
                fontSize: 60,
                fontFamily: fonts.poppinsLight,
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
                  ? colors.default.tint[400]
                  : colors.default.tint[100],
                fontSize: 16,
              },
            ]}
          >
            Entrances
          </Text>
        </View>
      </View>
    </View>
  );
};

const BluetoothLogs: FC<DashboardItemProps> = ({ isLight = false }) => {
  const { logs } = useBluetoothLogs();

  return (
    <DashboardItem
      icon="bluetooth"
      primaryColor={
        isLight ? colors.default.bluetooth[400] : colors.default.bluetooth[300]
      }
      title="Bluetooth"
      color="bluetooth"
      logs={logs}
    />
  );
};

const UnknownLogs: FC<DashboardItemProps> = ({ isLight = false }) => {
  const { logs } = useUnknownLogs();

  return (
    <DashboardItem
      icon="help-circle"
      primaryColor={
        isLight
          ? colors.default.tintAccent[400]
          : colors.default.tintAccent[300]
      }
      color="tintAccent"
      title="Unknown"
      logs={logs}
    />
  );
};

const FailedLogs: FC<DashboardItemProps> = ({ isLight = false }) => {
  const { logs } = useFailedLogs();

  return (
    <DashboardItem
      icon="close-circle"
      primaryColor={
        isLight ? colors.default.secondary[400] : colors.default.secondary[300]
      }
      color="secondary"
      title="Failed"
      logs={logs}
    />
  );
};

const SuccessfulPersonalLogs: FC<DashboardItemProps> = () => {
  const { logs } = useUserSuccessfulLogs();

  return (
    <DashboardItem
      icon="checkmark-circle"
      primaryColor={colors.default.success[400]}
      title="Entrances"
      color="success"
      logs={logs}
    />
  );
};

const BluetoothPersonalLogs: FC<DashboardItemProps> = ({ isLight = false }) => {
  const { logs } = useUserBluetoothLogs();

  return (
    <DashboardItem
      icon="bluetooth"
      primaryColor={
        isLight ? colors.default.bluetooth[400] : colors.default.bluetooth[300]
      }
      title="Bluetooth"
      color="bluetooth"
      logs={logs}
    />
  );
};

const FailedPersonalLogs: FC<DashboardItemProps> = ({ isLight = false }) => {
  const { logs } = useUserFailedLogs();

  return (
    <DashboardItem
      icon="close-circle"
      primaryColor={
        isLight ? colors.default.secondary[400] : colors.default.secondary[300]
      }
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
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    gap: -28,
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
    fontFamily: fonts.poppins,
    fontSize: 14,
  },
});
