import { format } from "date-fns";

import { FC, ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { useUserDataWithId, userSchema } from "../../hooks/use-user-data";
import { Timestamp } from "firebase/firestore";

interface LogItemProps {
  known?: boolean;
  accessed?: boolean;
  bluetooth?: boolean;
  children: ReactNode;
}

export const LogItem: FC<LogItemProps> = ({
  known = false,
  accessed = false,
  bluetooth = false,
  children,
}) => {
  const colorScheme = useColorScheme();

  const palette = colors[colorScheme];

  const backgroundColor = known
    ? accessed
      ? bluetooth
        ? palette.bluetooth
        : palette.tint
      : palette.secondary
    : palette.black;

  return (
    <View style={[styles.container, { backgroundColor }]}>{children}</View>
  );
};

interface LogItemTitleProps {
  user?: string;
}

export const LogItemTitle: FC<LogItemTitleProps> = ({ user }) => {
  const colorScheme = useColorScheme();

  const { status, data } = useUserDataWithId(user ?? "undefined");

  const palette = colors[colorScheme];

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

  const userData = userSchema.safeParse(data);

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
  },
  title: {
    maxWidth: "65%",
    color: "#fff",
    fontFamily: fonts.poppinsMedium,
    fontSize: 20,
  },
  timestampContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
  },
  timestamp: {
    color: "#fff",
    fontFamily: fonts.poppinsRegular,
    fontSize: 12,
  },
});
