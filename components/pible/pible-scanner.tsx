import IonIcons from "@expo/vector-icons/Ionicons";

import { FC } from "react";
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

const accessLogo = require("@/assets/access-logo.svg");

const ScanStateIcon: FC<{ state: ScanState }> = ({ state }) => {
  if (state === ScanState.enum.idle) {
    return <IonIcon name="stop" color="#fff" size={12} />;
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
  const devices = useStore((state) => state.devices);
  const bleState = useStore((state) => state.bluetoothState);
  const scanState = useStore((state) => state.scanState);

  const colorScheme = useColorScheme();
  const tabsHeight = useBottomTabBarHeight() + 4;

  const btState =
    bleState === State.PoweredOn
      ? "ON"
      : bleState === State.PoweredOff
      ? "OFF"
      : "ERROR";

  return (
    <View style={[styles.container, { bottom: tabsHeight + 4 }]}>
      <BlurView intensity={24} tint="dark" style={[styles.blur]} />
      <View style={[styles.scanButton]}>
        <BlurView intensity={24} tint="dark" style={[styles.blur]} />
        <Image
          source={accessLogo}
          alt="CSI PRO ACCESS Logo"
          style={[{ width: "100%", aspectRatio: 1 }]}
        />
      </View>
      <View style={[styles.actionsContainer]}>
        <View style={[styles.actions]}></View>
        <View style={[styles.actions]}></View>
      </View>
      {/* <View style={[styles.row]}>
        <Text style={[styles.label]}>Nearby Rooms</Text>
        <View style={[styles.scanStateContainer]}>
          <IonIcons name="bluetooth" size={12} color="#fff" />
          <Text style={[styles.stateLabel]}>{btState}</Text>
        </View>
      </View>
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
          paddingHorizontal: 8,
          alignItems: "center",
        }}
        ListEmptyComponent={
          <View style={[styles.emptyList, { flex: 1 }]}>
            <Text style={[styles.stateLabel]}>No rooms available</Text>
          </View>
        }
      />
      <View style={[styles.row]}>
        <View style={[styles.scanStateContainer]}>
          <View
            style={{
              width: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ScanStateIcon state={scanState} />
          </View>
          <Text style={[styles.stateLabel]}>{scanState}</Text>
        </View>
        <ScanControlButton state={scanState} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.default.tint.translucid[200],
    position: "absolute",
    right: 4,
    left: 4,
    zIndex: 10,
    padding: 8,
    borderRadius: 80,
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
    borderRadius: 80,
    borderColor: colors.default.tint[400],
  },
  scanButton: {
    position: "absolute",
    flex: 1,
    top: -40,
    backgroundColor: colors.default.tint.translucid[200],
    // borderWidth: 2,
    // borderColor: colors.default.tint[400],
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
    gap: 64,
  },
  actions: {
    flex: 1,
    borderWidth: 1,
    borderColor: "red",
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
