import { format } from "date-fns";

import { FC, ReactNode } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";

import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { useUserDataWithId, AccessUser } from "../../hooks/use-user-data";
import { Timestamp } from "firebase/firestore";

interface LogItemProps {
  known?: boolean;
  accessed?: boolean;
  bluetooth?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const LogItem: FC<LogItemProps> = ({
  known = false,
  accessed = false,
  bluetooth = false,
  children,
  style,
}) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const backgroundColor = isLight
    ? known
      ? accessed
        ? bluetooth
          ? colors.default.bluetooth.translucid[800]
          : colors.default.tint.translucid[800]
        : colors.default.secondary.translucid[700]
      : colors.default.black.translucid[800]
    : known
    ? accessed
      ? bluetooth
        ? colors.default.bluetooth.translucid[200]
        : colors.default.tint.translucid[200]
      : colors.default.secondary.translucid[200]
    : colors.default.white.translucid[50];

  const borderColor = isLight
    ? known
      ? accessed
        ? bluetooth
          ? colors.default.bluetooth[600]
          : colors.default.tint[600]
        : colors.default.secondary[600]
      : colors.default.black[600]
    : known
    ? accessed
      ? bluetooth
        ? colors.default.bluetooth[300]
        : colors.default.tint[300]
      : colors.default.secondary[300]
    : colors.default.black[100];

  return (
    <View style={[styles.container, { backgroundColor, borderColor }, style]}>
      {children}
    </View>
  );
};

interface LogItemTitleProps {
  user?: string;
}

export const LogItemTitle: FC<LogItemTitleProps> = ({ user }) => {
  const { status, data } = useUserDataWithId(user ?? "undefined");

  if (status === "loading") {
    return <ActivityIndicator size="small" color="#fff" />;
  }

  if (status === "error") {
    return (
      <Text numberOfLines={1} style={[styles.title]}>
        Unknown user
      </Text>
    );
  }

  const userData = AccessUser.safeParse(data);

  return (
    <Text numberOfLines={1} style={[styles.title]}>
      {userData.success ? userData.data.name : "Unknown user"}
    </Text>
  );
};

interface LogItemTimestampProps {
  timestamp: Timestamp;
}

export const LogItemTimestamp: FC<LogItemTimestampProps> = ({ timestamp }) => {
  const date = timestamp.toDate();

  return (
    <View style={[styles.timestampContainer]}>
      <Text style={[styles.timestamp]}>{format(date, "HH:mm:ss")}</Text>
      <Text style={[styles.timestamp]}>{format(date, "PPP")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    gap: 16,
    borderWidth: 2,
  },
  title: {
    maxWidth: "65%",
    color: colors.default.white[100],
    fontFamily: fonts.interMedium,
    fontSize: 18,
  },
  timestampContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
  },
  timestamp: {
    color: colors.default.white[100],
    fontFamily: fonts.inter,
    fontSize: 12,
  },
});
