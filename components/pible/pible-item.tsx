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
  const { startAutoScan, connect, scanState } = useBLE();
  const colorScheme = useColorScheme();

  const connectToDevice = () => {
    if (scanState === ScanState.stopped) {
      startAutoScan();
      return;
    }

    connect(device);
  };

  const isStopped = scanState === ScanState.stopped;

  return (
    <Pressable
      style={[
        styles.container,
        { backgroundColor: "#fff", opacity: isStopped ? 0.6 : 1 },
      ]}
      onPress={connectToDevice}
    >
      <View
        style={[
          styles.containerHighlight,
          { backgroundColor: colors[colorScheme].bluetooth },
        ]}
      />
      <Text
        numberOfLines={1}
        style={[
          styles.roomName,
          { color: colors[colorScheme ?? "light"].tint },
        ]}
      >
        {device.localName.replace("PiBLE-", "")}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    maxWidth: 180,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
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
    fontFamily: fonts.poppinsBold,
  },
});
