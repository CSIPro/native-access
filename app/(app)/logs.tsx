import { StyleSheet, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { LogsList } from "@/components/logs/logs-list";
import { RoomPicker } from "@/components/room-picker/room-picker";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

export default function AccessLogs() {
  const isLight = useColorScheme() === "light";
  const tabsHeight = useBottomTabBarHeight() + 8;

  return (
    <SafeAreaView
      style={[
        styles.main,
        {
          backgroundColor: colors.default.tint[400],
        },
      ]}
    >
      <View
        style={[
          {
            flex: 1,
            backgroundColor: isLight
              ? colors.default.white[100]
              : colors.default.black[400],
            paddingHorizontal: 8,
          },
        ]}
      >
        <View style={[styles.roomPickerWrapper]}>
          <RoomPicker />
        </View>
        <LogsList contentContainerStyle={[{ paddingBottom: tabsHeight }]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
  },
  header: {
    backgroundColor: "transparent",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "red",
  },
  roomPickerWrapper: {
    paddingVertical: 4,
    width: "100%",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  errorText: {
    fontFamily: fonts.poppins,
    fontSize: 14,
    textAlign: "center",
  },
});
