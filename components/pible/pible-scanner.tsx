import IonIcons from "@expo/vector-icons/Ionicons";

import { FC, useEffect } from "react";
import {
  useColorScheme,
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { State } from "react-native-ble-plx";

import { PibleItem } from "./pible-item";
import { IonIcon } from "../icons/ion";

import { ScanState } from "@/store/ble-slice";
import { useStore } from "@/store/store";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Checkbox, CheckboxLabel } from "../ui/checkbox";
import { RoomPicker } from "../room-picker/room-picker";
import Animated, {
  FadeOut,
  StretchInX,
  StretchOutX,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const accessLogo = require("@/assets/access-logo.svg");

const ScanStateIcon: FC<{ state: ScanState }> = ({ state }) => {
  if (state === ScanState.enum.idle) {
    return <IonIcon name="stop" color="#fff" size={16} />;
  }

  return <ActivityIndicator size="small" color="#fff" />;
};

const ScanControlButton: FC<{ state: ScanState }> = ({ state }) => {
  const startScan = useStore((state) => state.scan);
  const stopScan = useStore((state) => state.stopScan);

  const colorScheme = useColorScheme();

  const color = colors[colorScheme ?? "light"].tint;

  const icon =
    state === ScanState.enum.idle ? (
      <IonIcon name="play" color={color} size={16} />
    ) : (
      <IonIcon name="stop" color={color} size={16} />
    );

  const handlePress = () => {
    if (state === ScanState.enum.idle) {
      startScan();
    } else if (state === ScanState.enum.scanning) {
      stopScan({ immediate: true });
    }
  };

  return (
    <Pressable style={[styles.scanControlButton]} onPress={handlePress}>
      {icon}
      <Text
        style={[
          styles.stateLabel,
          { paddingTop: 2, color: colors.default.tint[400] },
        ]}
      >
        {state === ScanState.enum.idle ? "start" : "stop"}
      </Text>
    </Pressable>
  );
};

export const PibleScanner = () => {
  const connect = useStore((state) => state.connect);
  const devices = useStore((state) => state.devices);
  const bleState = useStore((state) => state.bluetoothState);
  const autoConnect = useStore((state) => state.autoConnect);
  const setAutoConnect = useStore((state) => state.setAutoConnect);
  const selectedRoom = useStore((state) => state.selectedRoom);
  const scanState = useStore((state) => state.scanState);
  const isScanning = scanState === "scanning";
  const isConnecting = scanState === "connecting";

  const sv = useSharedValue(0);

  useEffect(() => {
    if (isScanning) {
      sv.value = withRepeat(withTiming(1, { duration: 1500 }), 0, true);
    } else if (isConnecting) {
      sv.value = withTiming(1);
    } else {
      sv.value = withTiming(0);
    }
  }, [isScanning, isConnecting]);

  useEffect(() => {
    if (autoConnect) {
      if (devices.length > 0) {
        setTimeout(() => {
          const device = devices.find((d) =>
            d.localName?.includes(selectedRoom)
          );

          if (device) {
            connect(device);
          }
        }, 750);
      }
    }
  }, [autoConnect, devices]);

  const animatedItemStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      sv.value,
      [0, 1],
      [colors.default.tint.translucid[200], colors.default.tint.translucid[700]]
    );

    return { backgroundColor };
  });

  const isLight = useColorScheme() === "light";
  const tabsHeight = useBottomTabBarHeight() + 4;

  const btState =
    bleState === State.PoweredOn
      ? "ON"
      : bleState === State.PoweredOff
      ? "OFF"
      : "ERR";

  const showDevices =
    devices.length > 0 && (isScanning || isConnecting) && !autoConnect;

  return (
    <View
      style={[styles.wrapper, { alignItems: "center", bottom: tabsHeight + 4 }]}
    >
      {showDevices ? (
        <Animated.View
          entering={StretchInX}
          exiting={StretchOutX}
          style={[
            styles.container,
            {
              height: 64,
              borderWidth: 2,
              borderColor: colors.default.tint[400],
            },
          ]}
        >
          <FlatList
            horizontal
            data={devices}
            keyExtractor={(item, index) =>
              `${item.id}-${item.localName}-${item.rssi}-${index}`
            }
            renderItem={({ item }) => <PibleItem device={item} />}
            contentContainerStyle={{
              flexGrow: 1,
              gap: 4,
              alignItems: "center",
            }}
          />
        </Animated.View>
      ) : (
        <View style={[{ height: 64 }]} />
      )}
      <Animated.View style={[styles.container, animatedItemStyle]}>
        <BlurView intensity={24} tint="dark" style={[styles.blur]} />
        <PibleButton />
        <View style={[styles.actionsContainer]}>
          <View style={[styles.actions]}>
            <View
              style={[
                styles.actionButton,
                {
                  width: "100%",
                  flexDirection: "row",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Checkbox
                checked={autoConnect}
                onChange={() => setAutoConnect(!autoConnect)}
                disabled={scanState !== "idle"}
              >
                <CheckboxLabel style={[styles.actionLabel]}>
                  Auto-connect
                </CheckboxLabel>
              </Checkbox>
            </View>
          </View>
          <View style={[styles.actions]}>
            <View
              style={[
                styles.actionButton,
                { height: "100%", flex: 3, padding: 0 },
              ]}
            >
              <RoomPicker
                compact
                style={[
                  {
                    backgroundColor: colors.default.tint.translucid[100],
                    borderRadius: 4,
                    borderWidth: 1,
                    height: "100%",
                  },
                ]}
                textStyle={[{ fontSize: 10 }]}
              />
            </View>
            <View
              style={[
                styles.actionButton,
                {
                  backgroundColor:
                    bleState === State.PoweredOn
                      ? isLight
                        ? colors.default.tint.translucid[400]
                        : colors.default.tint.translucid[100]
                      : "transparent",
                  borderTopRightRadius: 24,
                  borderBottomRightRadius: 24,
                },
              ]}
            >
              <IonIcons
                name="bluetooth"
                size={16}
                color={colors.default.white[100]}
              />
              <Text
                style={[
                  styles.actionLabel,
                  { color: colors.default.white[100] },
                ]}
                numberOfLines={1}
              >
                {btState}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const PibleButton = () => {
  const startScan = useStore((state) => state.scan);
  const scanState = useStore((state) => state.scanState);
  const isScanning = scanState === "scanning";
  const isConnecting = scanState === "connecting";

  const sv = useSharedValue(0);

  useEffect(() => {
    if (isScanning) {
      sv.value = withRepeat(withTiming(1, { duration: 1500 }), 0, true);
    } else if (isConnecting) {
      sv.value = withTiming(1);
    } else {
      sv.value = withTiming(0);
    }
  }, [isScanning, isConnecting]);

  const animatedItemStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      sv.value,
      [0, 1],
      [colors.default.tint.translucid[200], colors.default.tint.translucid[700]]
    );

    return { backgroundColor };
  });

  return (
    <Pressable onPress={startScan} style={[styles.scanButtonWrapper]}>
      <Animated.View style={[styles.scanButton, animatedItemStyle]}>
        <BlurView
          intensity={24}
          tint="dark"
          style={[styles.blur, { borderRadius: 9999 }]}
        />
        <Image
          source={accessLogo}
          alt="CSI PRO ACCESS Logo"
          style={[{ width: "100%", aspectRatio: 1 }]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: "100%",
    gap: 12,
    paddingHorizontal: 4,
    zIndex: 10,
  },
  container: {
    backgroundColor: colors.default.tint.translucid[200],
    padding: 8,
    borderRadius: 32,
    height: 64,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    alignItems: "center",
    padding: 8,
    borderWidth: 2,
    borderRadius: 32,
    borderColor: colors.default.tint[400],
  },
  scanButtonWrapper: {
    position: "absolute",
    zIndex: 20,
    top: -40,
    borderRadius: 9999,
    width: 96,
  },
  scanButton: {
    backgroundColor: colors.default.tint.translucid[200],
    borderRadius: 9999,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 96,
    aspectRatio: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    gap: 104,
  },
  actions: {
    flexDirection: "row",
    flex: 1,
    gap: 4,
  },
  actionButton: {
    height: "100%",
    flex: 1,
    padding: 4,
    borderRadius: 4,
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionLabel: {
    paddingTop: 4,
    fontFamily: fonts.poppins,
    fontSize: 10,
    color: "#fff",
  },
  label: {
    fontFamily: fonts.poppins,
    fontSize: 20,
    color: "#fff",
  },
  stateLabel: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 14,
    color: "#fff",
  },
  scanStateContainer: {
    borderWidth: 1,
    borderColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    maxHeight: 32,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxHeight: 48,
    padding: 8,
  },
  scanControlButton: {
    gap: 4,
    flexDirection: "row",
    borderRadius: 4,
    backgroundColor: "#fff",
    padding: 4,
    paddingRight: 6,
    height: "100%",
    maxHeight: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyList: {
    alignItems: "center",
    justifyContent: "center",
  },
});
