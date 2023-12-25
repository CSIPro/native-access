import { FC } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Device } from "react-native-ble-plx";

import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { useStore } from "../../store/store";
import { ScanState } from "../../store/ble-slice";

interface Props {
  device: Device;
}

export const PibleItem: FC<Props> = ({ device }) => {
  const scanState = useStore((state) => state.scanState);
  const startScan = useStore((state) => state.scan);
  const connect = useStore((state) => state.connect);

  const colorScheme = useColorScheme();

  const connectToDevice = () => {
    if (scanState === ScanState.enum.idle) {
      startScan();
      return;
    }

    connect(device);
  };

  const isStopped = scanState === ScanState.enum.idle;

  const isLight = colorScheme === "light";

  const bgColor = isLight
    ? colors.default.bluetooth.translucid[300]
    : colors.default.bluetooth.translucid[200];
  const borderColor = isLight
    ? colors.default.bluetooth[200]
    : colors.default.bluetooth[400];

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          opacity: isStopped ? 0.6 : 1,
          borderWidth: 2,
          borderColor,
        },
      ]}
      onPress={connectToDevice}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.roomName,
          {
            color: colors.default.white[100],
          },
        ]}
      >
        {device.localName?.replace("PiBLE-", "") ?? "Unknown"}
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
    paddingTop: 4,
    fontFamily: fonts.poppinsMedium,
  },
});
