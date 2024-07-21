import { FC } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";

import { LogItem, LogItemTimestamp, LogItemTitle } from "./log-item";

import { useNestLogs } from "@/hooks/use-logs";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

interface Props {
  disableScroll?: boolean;
  today?: boolean;
  limit?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}

export const LogsList: FC<Props> = ({
  disableScroll = false,
  today = false,
  limit = 40,
  contentContainerStyle,
  itemStyle,
}) => {
  const isLight = useColorScheme() === "light";
  const { status: logsStatus, data: logs } = useNestLogs({ limitTo: limit });

  const backgroundColor = isLight
    ? colors.default.white[100]
    : colors.default.black[400];

  if (logsStatus === "loading") {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <ActivityIndicator size="large" color={colors.default.tint[400]} />
      </View>
    );
  }

  if (logsStatus === "error") {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <Text
          style={[
            styles.errorText,
            {
              color: isLight
                ? colors.default.black[400]
                : colors.default.white[100],
            },
          ]}
        >
          Error loading logs
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={logs}
      scrollEnabled={!disableScroll}
      keyExtractor={(item) => `${item.id}`}
      contentContainerStyle={[{ flexGrow: 1, gap: 4 }, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      renderItem={({ item: log }) => {
        const userName = log.user
          ? `${log.user.firstName} ${log.user.lastName}`
          : "Unknown user";

        return (
          <LogItem
            key={log.id}
            id={log.id}
            known={!!log.user}
            accessed={log.accessed}
            wireless={log.wireless}
            birthday={log.user?.dateOfBirth}
            style={[itemStyle]}
          >
            <LogItemTitle>{userName}</LogItemTitle>
            <LogItemTimestamp timestamp={log.createdAt} />
          </LogItem>
        );
      }}
      ListEmptyComponent={
        <View style={[styles.centered]}>
          <Text
            style={[
              styles.errorText,
              {
                color: isLight
                  ? colors.default.black[400]
                  : colors.default.white[100],
              },
            ]}
          >
            No logs found
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
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
