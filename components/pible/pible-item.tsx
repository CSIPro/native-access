import { FC } from "react";
import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";
import { Device } from "react-native-ble-plx";

import { IonIcon } from "../icons/ion";
import { ScanState, useBLE } from "../../context/ble-context";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";

interface Props {
  device: Device;
}

export const PibleItem: FC<Props> = ({ device }) => {
  const { connect, scanState } = useBLE();
  const colorScheme = useColorScheme();

  const connectToDevice = async () => {
    await connect(device);
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
      <IonIcon
        name="lock-closed"
        size={20}
        color={colors[colorScheme ?? "light"].tint}
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
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    height: 48,
    maxWidth: 180,
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
  },
  roomName: {
    fontSize: 20,
    paddingTop: 2,
    fontFamily: fonts.poppinsBold,
  },
});
