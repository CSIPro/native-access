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

import { ScanState, useBLE } from "../../context/ble-context";
import colors from "../../constants/colors";
import { State } from "react-native-ble-plx";
import fonts from "../../constants/fonts";
import { PibleItem } from "./pible-item";
import { IonIcon } from "../icons/ion";

const ScanStateIcon: FC<{ state: ScanState }> = ({ state }) => {
  if (state === ScanState.stopped) {
    return <IonIcon name="stop" color="#fff" size={12} />;
  }

  if (state === ScanState.paused) {
    return <IonIcon name="pause" color="#fff" size={12} />;
  }

  return <ActivityIndicator size="small" color="#fff" />;
};

const ScanControlButton: FC<{ state: ScanState }> = ({ state }) => {
  const bleCtx = useBLE();

  const colorScheme = useColorScheme();

  const color = colors[colorScheme ?? "light"].tint;

  const icon =
    state === ScanState.stopped ? (
      <IonIcon name="play" color={color} size={16} />
    ) : (
      <IonIcon name="stop" color={color} size={16} />
    );

  const handlePress = () => {
    if (state === ScanState.stopped) {
      bleCtx?.startAutoScan();
    } else if (state === ScanState.scanning) {
      bleCtx?.stopScan();
    }
  };

  return (
    <Pressable style={[styles.scanControlButton]} onPress={handlePress}>
      {icon}
    </Pressable>
  );
};

export const PibleScanner = () => {
  const bleCtx = useBLE();
  const colorScheme = useColorScheme();

  const btState =
    bleCtx?.bluetoothState === State.PoweredOn
      ? "ON"
      : bleCtx?.bluetoothState === State.PoweredOff
      ? "OFF"
      : "ERROR";

  useEffect(() => {
    bleCtx?.startAutoScan();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[colorScheme ?? "light"].tint },
      ]}
    >
      <View style={[styles.row]}>
        <Text style={[styles.label]}>Nearby Rooms</Text>
        <View style={[styles.scanStateContainer]}>
          <IonIcons name="bluetooth" size={12} color="#fff" />
          <Text style={[styles.stateLabel]}>{btState}</Text>
        </View>
      </View>
      <FlatList
        horizontal
        data={bleCtx?.devices}
        keyExtractor={(item, index) =>
          `${item.id}-${item.localName}-${item.rssi}-${index}`
        }
        renderItem={({ item }) => <PibleItem device={item} />}
        contentContainerStyle={{ flexGrow: 1, gap: 8, paddingHorizontal: 8 }}
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
            <ScanStateIcon state={bleCtx?.scanState ?? ScanState.stopped} />
          </View>
          <Text style={[styles.stateLabel]}>
            {ScanState[bleCtx?.scanState ?? ScanState.stopped]}
          </Text>
        </View>
        <ScanControlButton state={bleCtx?.scanState ?? ScanState.stopped} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxHeight: 180,
  },
  label: {
    fontFamily: fonts.poppinsRegular,
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
    borderRadius: 4,
    backgroundColor: "#fff",
    padding: 4,
    height: "100%",
    maxHeight: 32,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyList: {
    alignItems: "center",
    justifyContent: "center",
  },
});
