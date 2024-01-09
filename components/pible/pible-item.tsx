import { FC, useEffect } from "react";
import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Device } from "react-native-ble-plx";

import { ScanState } from "@/store/ble-slice";
import { useStore } from "@/store/store";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

interface Props {
  device: Device;
}

export const PibleItem: FC<Props> = ({ device }) => {
  const sv = useSharedValue(0);
  const scanState = useStore((state) => state.scanState);
  const startScan = useStore((state) => state.scan);
  const connect = useStore((state) => state.connect);

  const colorScheme = useColorScheme();

  useEffect(() => {
    sv.value = withRepeat(withTiming(1, { duration: 1000 }), -1);
  }, []);

  const animatedItem = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      sv.value,
      [0, 1],
      [colors.default.bluetooth[200], colors.default.bluetooth[400]]
    );

    return { backgroundColor };
  });

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
    <Pressable style={[styles.wrapper]} onPress={connectToDevice}>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: bgColor,
            opacity: isStopped ? 0.6 : 1,
            borderWidth: 2,
            borderColor,
          },
        ]}
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
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 180,
  },
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
