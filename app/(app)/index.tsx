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
import { useState } from "react";
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
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <SuccessfulLogs />
          </View>
          <View style={styles.dashboardRow}>
            <BluetoothLogs />
            <FailedLogs />
            <UnknownLogs />
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
              <BluetoothPersonalLogs />
              <FailedPersonalLogs />
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

const SuccessfulLogs = () => {
  const colorScheme = useColorScheme();

  const { logs } = useSuccessfulLogs();

  const palette = colors[colorScheme];

  const isLight = colorScheme === "light";

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
              borderBlockEndColor: palette.tint,
              borderBottomWidth: 3,
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
                  : colors.default.white[600],
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

const BluetoothLogs = () => {
  const { logs } = useBluetoothLogs();

  return (
    <DashboardItem
      icon="bluetooth"
      primaryColor={colors.default.bluetooth[400]}
      title="Bluetooth"
      logs={logs}
    />
  );

  // return (
  //   <View style={[styles.dataContainerShadow]}>
  //     <View
  //       style={[
  //         styles.dataContainer,
  //         {
  //           backgroundColor:
  //             colorScheme === "light"
  //               ? colors.default.white[100]
  //               : colors.default.black[300],
  //         },
  //       ]}
  //     >
  //       <View
  //         style={[
  //           styles.dataContainerHighlight,
  //           { backgroundColor: colors[colorScheme].bluetooth },
  //         ]}
  //       />
  //       <IonIcon
  //         name="bluetooth"
  //         color={colors[colorScheme].bluetooth}
  //         size={24}
  //       />
  //       <View style={[styles.dataTextContainer]}>
  //         <Text style={[styles.bubbleText, { fontSize: 28 }]}>
  //           {logs.length}
  //         </Text>
  //         <Text
  //           style={[
  //             styles.bubbleText,
  //             {
  //               color:
  //                 colorScheme === "light"
  //                   ? colors.default.gray[600]
  //                   : colors.default.white[100],
  //             },
  //           ]}
  //         >
  //           Bluetooth
  //         </Text>
  //       </View>
  //     </View>
  //   </View>
  // );
};

const UnknownLogs = () => {
  const { logs } = useUnknownLogs();

  return (
    <DashboardItem
      icon="help-circle"
      primaryColor={colors.default.tintAccent[400]}
      title="Unknown"
      logs={logs}
    />
  );

  // return (
  //   <View style={[styles.dataContainerShadow]}>
  //     <View style={[styles.dataContainer]}>
  //       <View
  //         style={[
  //           styles.dataContainerHighlight,
  //           { backgroundColor: colors[colorScheme].tintAccent },
  //         ]}
  //       />
  //       <IonIcon
  //         name="help-circle"
  //         color={colors[colorScheme].tintAccent}
  //         size={24}
  //       />
  //       <View style={[styles.dataTextContainer]}>
  //         <Text style={[styles.bubbleText, { fontSize: 28 }]}>
  //           {logs.length}
  //         </Text>
  //         <Text
  //           style={[
  //             styles.bubbleText,
  //             {
  //               color:
  //                 colorScheme === "light"
  //                   ? colors.default.gray[600]
  //                   : colors.default.white[100],
  //             },
  //           ]}
  //         >
  //           Unknown
  //         </Text>
  //       </View>
  //     </View>
  //   </View>
  // );
};

const FailedLogs = () => {
  const { logs } = useFailedLogs();

  return (
    <DashboardItem
      icon="close-circle"
      primaryColor={colors.default.secondary[400]}
      title="Failed"
      logs={logs}
    />
  );

  // return (
  //   <View style={[styles.dataContainerShadow]}>
  //     <View style={[styles.dataContainer]}>
  //       <View
  //         style={[
  //           styles.dataContainerHighlight,
  //           { backgroundColor: colors[colorScheme].secondary },
  //         ]}
  //       />
  //       <IonIcon
  //         name="close-circle"
  //         color={colors[colorScheme].secondary}
  //         size={24}
  //       />
  //       <View style={[styles.dataTextContainer]}>
  //         <Text style={[styles.bubbleText, { fontSize: 28 }]}>
  //           {logs.length}
  //         </Text>
  //         <Text style={[styles.bubbleText, { color: "#a1a1a1" }]}>Failed</Text>
  //       </View>
  //     </View>
  //   </View>
  // );
};

const SuccessfulPersonalLogs = () => {
  const { logs } = useUserSuccessfulLogs();

  return (
    <DashboardItem
      icon="checkmark-circle"
      primaryColor={colors.default.success[400]}
      title="Entrances"
      logs={logs}
    />
  );

  // return (
  //   <View style={[styles.dataContainerShadow]}>
  //     <View style={[styles.dataContainer]}>
  //       <View
  //         style={[
  //           styles.dataContainerHighlight,
  //           { backgroundColor: colors[colorScheme].success },
  //         ]}
  //       />
  //       <IonIcon
  //         name="checkmark-circle"
  //         color={colors[colorScheme].success}
  //         size={24}
  //       />
  //       <View style={[styles.dataTextContainer]}>
  //         <Text style={[styles.bubbleText, { fontSize: 28 }]}>
  //           {logs.length}
  //         </Text>
  //         <Text style={[styles.bubbleText, { color: "#a1a1a1" }]}>
  //           Entrances
  //         </Text>
  //       </View>
  //     </View>
  //   </View>
  // );
};

const BluetoothPersonalLogs = () => {
  const { logs } = useUserBluetoothLogs();

  return (
    <DashboardItem
      icon="bluetooth"
      primaryColor={colors.default.bluetooth[400]}
      title="Bluetooth"
      logs={logs}
    />
  );

  // return (
  //   <View style={[styles.dataContainerShadow]}>
  //     <View style={[styles.dataContainer]}>
  //       <View
  //         style={[
  //           styles.dataContainerHighlight,
  //           { backgroundColor: colors[colorScheme].bluetooth },
  //         ]}
  //       />
  //       <IonIcon
  //         name="bluetooth"
  //         color={colors[colorScheme].bluetooth}
  //         size={24}
  //       />
  //       <View style={[styles.dataTextContainer]}>
  //         <Text style={[styles.bubbleText, { fontSize: 28 }]}>
  //           {logs.length}
  //         </Text>
  //         <Text style={[styles.bubbleText, { color: "#a1a1a1" }]}>
  //           Bluetooth
  //         </Text>
  //       </View>
  //     </View>
  //   </View>
  // );
};

const FailedPersonalLogs = () => {
  const { logs } = useUserFailedLogs();

  return (
    <DashboardItem
      icon="close-circle"
      primaryColor={colors.default.secondary[400]}
      title="Failed"
      logs={logs}
    />
  );

  // return (
  //   <View style={[styles.dataContainerShadow]}>
  //     <View style={[styles.dataContainer]}>
  //       <View
  //         style={[
  //           styles.dataContainerHighlight,
  //           { backgroundColor: colors[colorScheme].secondary },
  //         ]}
  //       />
  //       <IonIcon
  //         name="close-circle"
  //         color={colors[colorScheme].secondary}
  //         size={24}
  //       />
  //       <View style={[styles.dataTextContainer]}>
  //         <Text style={[styles.bubbleText, { fontSize: 28 }]}>
  //           {logs.length}
  //         </Text>
  //         <Text style={[styles.bubbleText, { color: "#a1a1a1" }]}>Failed</Text>
  //       </View>
  //     </View>
  //   </View>
  // );
};

const styles = StyleSheet.create({
  dashboardTitle: {
    fontFamily: fonts.poppinsRegular,
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
    fontFamily: fonts.poppinsRegular,
    fontSize: 14,
  },
});
