import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  LogItem,
  LogItemTimestamp,
  LogItemTitle,
} from "@/components/logs/log-item";
import { RoomPicker } from "@/components/room-picker/room-picker";

import { useLogs } from "@/hooks/use-logs";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

export default function AccessLogs() {
  const colorScheme = useColorScheme();
  const { status: logsStatus, data: logs } = useLogs({ today: false });

  const palette = colors[colorScheme];
  const isLight = colorScheme === "light";

  const backgroundColor = isLight
    ? colors.default.white[100]
    : colors.default.black[400];

  if (logsStatus === "loading") {
    return (
      <SafeAreaView
        style={[styles.main, { backgroundColor: colors.default.tint[400] }]}
      >
        <View style={[styles.centered, { backgroundColor }]}>
          <ActivityIndicator size="large" color={palette.tint} />
        </View>
      </SafeAreaView>
    );
  }

  if (logsStatus === "error") {
    return (
      <SafeAreaView
        style={[styles.main, { backgroundColor: colors.default.tint[400] }]}
      >
        <View style={[styles.centered, { backgroundColor }]}>
          <Text style={[styles.errorText, { color: palette.text }]}>
            Error loading logs
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          },
        ]}
      >
        <View style={[styles.roomPickerWrapper]}>
          <RoomPicker />
        </View>
        <FlatList
          data={logs}
          keyExtractor={(item) => `${item.timestamp}-${item.room}-${item.user}`}
          contentContainerStyle={[
            { flexGrow: 1, paddingHorizontal: 8, gap: 4 },
          ]}
          renderItem={({ item: log }) => (
            <LogItem
              known={!!log.user}
              accessed={log.accessed}
              bluetooth={log.bluetooth}
            >
              <LogItemTitle user={log.user} />
              <LogItemTimestamp timestamp={log.timestamp} />
            </LogItem>
          )}
          ListEmptyComponent={
            <View style={[styles.centered]}>
              <Text style={[styles.errorText, { color: palette.text }]}>
                No logs found
              </Text>
            </View>
          }
        />
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
    paddingHorizontal: 4,
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
