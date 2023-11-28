import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useLogs } from "../../hooks/use-logs";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import {
  LogItem,
  LogItemTimestamp,
  LogItemTitle,
} from "../../components/logs/log-item";

export default function AccessLogs() {
  const colorScheme = useColorScheme();
  const { status: logsStatus, data: logs } = useLogs({ today: false });

  const palette = colors[colorScheme];

  if (logsStatus === "loading") {
    return (
      <View style={[styles.centered]}>
        <ActivityIndicator size="large" color={palette.tint} />
      </View>
    );
  }

  if (logsStatus === "error") {
    return (
      <View style={[styles.centered]}>
        <Text style={[styles.errorText, { color: palette.text }]}>
          Error loading logs
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={logs}
      keyExtractor={(item) => `${item.timestamp}-${item.room}-${item.user}`}
      contentContainerStyle={{ flexGrow: 1, padding: 4, gap: 4 }}
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
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  errorText: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 14,
    textAlign: "center",
  },
});
