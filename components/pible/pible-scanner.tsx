import { useColorScheme, StyleSheet, View, Text, FlatList } from "react-native";
import IonIcons from "@expo/vector-icons/Ionicons";

import { useBLE } from "../../context/ble-context";
import colors from "../../constants/colors";
import { State } from "react-native-ble-plx";
import fonts from "../../constants/fonts";
import { useEffect } from "react";
import { PibleItem } from "./pible-item";

export const PibleScanner = () => {
  const bleCtx = useBLE();
  const colorScheme = useColorScheme();

  const btState =
    bleCtx?.state === State.PoweredOn
      ? "on"
      : bleCtx?.state === State.PoweredOff
      ? "off"
      : "error";

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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          padding: 8,
        }}
      >
        <Text style={[styles.label]}>nearby rooms</Text>
        <View
          style={[
            styles.stateContainer,
            { backgroundColor: colors[colorScheme ?? "light"].bluetooth },
          ]}
        >
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  label: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 20,
    color: "#fff",
  },
  stateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    paddingLeft: 4,
    paddingRight: 8,
    gap: 2,
  },
  stateLabel: {
    textTransform: "lowercase",
    fontFamily: fonts.poppinsRegular,
    fontSize: 14,
    color: "#fff",
  },
});
