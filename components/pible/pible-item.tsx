import { FC } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Device } from "react-native-ble-plx";

import { IonIcon } from "../icons/ion";
import { ScanState, useBLE } from "../../context/ble-context";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";

interface Props {
  device: Device;
}

export const PibleItem: FC<Props> = ({ device }) => {
  const { startScan: startAutoScan, connect, scanState } = useBLE();
  const colorScheme = useColorScheme();

  const connectToDevice = () => {
    if (scanState === ScanState.stopped) {
      startAutoScan();
      return;
    }

    connect(device);
  };

  const isStopped = scanState === ScanState.stopped;

  const isLight = colorScheme === "light";

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: colors.default.white[100],
          opacity: isStopped ? 0.6 : 1,
        },
      ]}
      onPress={connectToDevice}
    >
      <View
        style={[
          styles.containerHighlight,
          {
            backgroundColor: isLight
              ? colors.default.bluetooth[400]
              : colors.default.bluetooth[200],
          },
        ]}
      />
      <Text
        numberOfLines={1}
        style={[
          styles.roomName,
          {
            color: isLight
              ? colors.default.tint[400]
              : colors.default.tint[200],
          },
        ]}
      >
        {device.localName.replace("PiBLE-", "")}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    maxWidth: 180,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  containerHighlight: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
  },
  roomName: {
    fontSize: 20,
    paddingTop: 2,
    fontFamily: fonts.poppinsMedium,
  },
});
