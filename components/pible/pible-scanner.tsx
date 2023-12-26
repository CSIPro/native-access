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

import colors from "../../constants/colors";
import { State } from "react-native-ble-plx";
import fonts from "../../constants/fonts";
import { PibleItem } from "./pible-item";
import { IonIcon } from "../icons/ion";
import {
  useBLEDevices,
  useBLEScan,
  useBLEScanState,
  useBLEState,
  useBLEStopScan,
} from "../../store/store";
import { ScanState } from "../../store/ble-slice";

const ScanStateIcon: FC<{ state: ScanState }> = ({ state }) => {
  if (state === ScanState.enum.idle) {
    return <IonIcon name="stop" color="#fff" size={12} />;
  }

  return <ActivityIndicator size="small" color="#fff" />;
};

const ScanControlButton: FC<{ state: ScanState }> = ({ state }) => {
  const startScan = useBLEScan();
  const stopScan = useBLEStopScan();

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
    </Pressable>
  );
};

export const PibleScanner = () => {
  const devices = useBLEDevices();
  const bleState = useBLEState();
  const scanState = useBLEScanState();

  const colorScheme = useColorScheme();

  const btState =
    bleState === State.PoweredOn
      ? "ON"
      : bleState === State.PoweredOff
      ? "OFF"
      : "ERROR";

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
        data={devices}
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
            <ScanStateIcon state={scanState} />
          </View>
          <Text style={[styles.stateLabel]}>{scanState}</Text>
        </View>
        <ScanControlButton state={scanState} />
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
