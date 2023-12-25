import { format } from "date-fns";

import { FC, ReactNode, createContext, useContext } from "react";
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

interface LogItemContextProps {
  textColor: string;
}

const LogItemContext = createContext<LogItemContextProps>({
  textColor: colors.default.white[100],
});

const useLogItemContext = () => {
  const context = useContext(LogItemContext);

  if (!context) {
    throw new Error(
      "useLogItemContext must be used within a LogItemContext.Provider"
    );
  }

  return context;
};

export const LogItem: FC<LogItemProps> = ({
  known = false,
  accessed = false,
  bluetooth = false,
  children,
}) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const backgroundColor = isLight
    ? known
      ? accessed
        ? bluetooth
          ? colors.default.bluetooth.translucid[400]
          : colors.default.tint.translucid[500]
        : colors.default.secondary.translucid[400]
      : colors.default.black.translucid[500]
    : known
    ? accessed
      ? bluetooth
        ? colors.default.bluetooth.translucid[100]
        : colors.default.tint.translucid[100]
      : colors.default.secondary.translucid[100]
    : colors.default.white.translucid[50];

  const borderColor = isLight
    ? known
      ? accessed
        ? bluetooth
          ? colors.default.bluetooth[500]
          : colors.default.tint[500]
        : colors.default.secondary[500]
      : colors.default.black[500]
    : known
    ? accessed
      ? bluetooth
        ? colors.default.bluetooth[200]
        : colors.default.tint[200]
      : colors.default.secondary[200]
    : colors.default.black[50];

  const textColor = isLight
    ? known
      ? accessed
        ? bluetooth
          ? colors.default.bluetooth[500]
          : colors.default.tint[500]
        : colors.default.secondary[500]
      : colors.default.black[500]
    : known
    ? accessed
      ? bluetooth
        ? colors.default.bluetooth[200]
        : colors.default.tint[200]
      : colors.default.secondary[200]
    : colors.default.white[100];

  return (
    <LogItemContext.Provider value={{ textColor }}>
      <View style={[styles.container, { backgroundColor, borderColor }]}>
        {children}
      </View>
    </LogItemContext.Provider>
  );
};

interface LogItemTitleProps {
  user?: string;
}

export const LogItemTitle: FC<LogItemTitleProps> = ({ user }) => {
  const { textColor } = useLogItemContext();
  const { status, data } = useUserDataWithId(user ?? "undefined");

  if (status === "loading") {
    return <ActivityIndicator size="small" color="#fff" />;
  }

  if (status === "error") {
    return (
      <Text numberOfLines={1} style={[styles.title, { color: textColor }]}>
        Unknown user
      </Text>
    );
  }

  const userData = userSchema.safeParse(data);

  return (
    <Text numberOfLines={1} style={[styles.title, { color: textColor }]}>
      {userData.success ? userData.data.name : "Unknown user"}
    </Text>
  );
};

interface LogItemTimestampProps {
  timestamp: Timestamp;
}

export const LogItemTimestamp: FC<LogItemTimestampProps> = ({ timestamp }) => {
  const { textColor } = useLogItemContext();
  const date = timestamp.toDate();

  return (
    <View style={[styles.timestampContainer]}>
      <Text style={[styles.timestamp, { color: textColor }]}>
        {format(date, "HH:mm:ss")}
      </Text>
      <Text style={[styles.timestamp, { color: textColor }]}>
        {format(date, "PPP")}
      </Text>
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
    color: "#fff",
    fontFamily: fonts.poppinsMedium,
    fontSize: 20,
    paddingTop: 4,
  },
  timestampContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
  },
  timestamp: {
    color: "#fff",
    fontFamily: fonts.poppins,
    fontSize: 12,
  },
});
