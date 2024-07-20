import { format } from "date-fns";

import { FC, ReactNode } from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";

import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import {
  useUserDataWithId,
  AccessUser,
  useUserData,
} from "../../hooks/use-user-data";
import { Timestamp } from "firebase/firestore";
import { useStore } from "@/store/store";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation } from "react-query";
import { deleteLog } from "@/lib/utils";
import { IonIcon } from "../icons/ion";
import { useRoles } from "@/hooks/use-roles";
import { useUserContext } from "@/context/user-context";

interface LogItemProps {
  id: string;
  known?: boolean;
  accessed?: boolean;
  wireless?: boolean;
  birthday?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const LogItem: FC<LogItemProps> = ({
  id,
  known = false,
  accessed = false,
  wireless = false,
  birthday,
  children,
  style,
}) => {
  const { user, membership } = useUserContext();

  const selectedLog = useStore((state) => state.selectedLog);
  const setSelectedLog = useStore((state) => state.setSelectedLog);
  const clearSelectedLog = useStore((state) => state.clearSelectedLog);

  const tapHandler = (event: GestureResponderEvent) => {
    if (!!selectedLog) {
      runOnJS(clearSelectedLog)();
      return;
    }

    runOnJS(setSelectedLog)(id);
  };

  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const backgroundColor = isLight
    ? known
      ? accessed
        ? wireless
          ? colors.default.bluetooth.translucid[800]
          : colors.default.tint.translucid[800]
        : colors.default.secondary.translucid[700]
      : colors.default.black.translucid[800]
    : known
    ? accessed
      ? wireless
        ? colors.default.bluetooth.translucid[200]
        : colors.default.tint.translucid[200]
      : colors.default.secondary.translucid[200]
    : colors.default.white.translucid[50];

  const borderColor = isLight
    ? known
      ? accessed
        ? wireless
          ? colors.default.bluetooth[600]
          : colors.default.tint[600]
        : colors.default.secondary[600]
      : colors.default.black[600]
    : known
    ? accessed
      ? wireless
        ? colors.default.bluetooth[300]
        : colors.default.tint[300]
      : colors.default.secondary[300]
    : colors.default.black[100];

  const canDeleteLogs = (user.isRoot || membership?.role.level >= 50) ?? false;

  const baseDate = new Date();
  const birthdayDate = birthday ? new Date(birthday) : null;

  const isBirthday = birthdayDate
    ? birthdayDate.getDate() === baseDate.getDate() &&
      birthdayDate.getMonth() === baseDate.getMonth()
    : false;

  if (isBirthday) {
    return (
      <Pressable onPress={tapHandler}>
        <LinearGradient
          colors={[
            "rgb(223,0,0)",
            "rgb(214,91,0)",
            "rgb(233,245,0)",
            "rgb(23,255,17)",
            "rgb(29,255,255)",
            "rgb(5,17,255)",
            "rgb(202,0,253)",
          ]}
          locations={[0.0, 0.15, 0.3, 0.45, 0.6, 0.75, 1.0]}
          start={[0.0, 0.5]}
          end={[0.9, 0.5]}
          style={[{ padding: 2, borderRadius: 10 }]}
        >
          <View
            style={[
              {
                backgroundColor: isLight
                  ? colors.default.white[100]
                  : colors.default.black[400],
                borderRadius: 8,
              },
            ]}
          >
            <View style={[styles.containerTest, { backgroundColor }]}>
              {children}
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={tapHandler}
      style={[styles.container, { backgroundColor, borderColor }, style]}
    >
      {children}
      {canDeleteLogs && <LogItemActions id={id} />}
    </Pressable>
  );
};

interface LogItemTitleProps {
  children: ReactNode;
}

export const LogItemTitle: FC<LogItemTitleProps> = ({ children }) => {
  return (
    <Text numberOfLines={1} style={[styles.title]}>
      {children}
    </Text>
  );
};

interface LogItemTimestampProps {
  timestamp: string;
}

export const LogItemTimestamp: FC<LogItemTimestampProps> = ({ timestamp }) => {
  const date = new Date(timestamp);

  return (
    <View style={[styles.timestampContainer]}>
      <Text style={[styles.timestamp]}>{format(date, "HH:mm:ss")}</Text>
      <Text style={[styles.timestamp]}>{format(date, "PPP")}</Text>
    </View>
  );
};

const LogItemActions: FC<{ id: string }> = ({ id }) => {
  const { mutate, isLoading, error } = useMutation<void, Error, string>(
    deleteLog
  );
  const selectedLog = useStore((state) => state.selectedLog);
  const authConfirmation = useStore((state) => state.deleteConfirmation);
  const confirmDeletion = useStore((state) => state.confirmDeletion);

  const sv = useDerivedValue(
    () => (selectedLog === id ? withTiming(1) : withTiming(0)),
    [selectedLog, id]
  );

  const rOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(sv.value, [0, 1], [0, 1]);

    return {
      opacity,
    };
  });

  const handleDelete = async (event: GestureResponderEvent) => {
    if (!!authConfirmation && new Date().getTime() < authConfirmation) {
      mutate(id);
    } else if (await confirmDeletion()) {
      mutate(id);
    }
  };

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          overflow: "hidden",
          flexDirection: "row",
        },
        rOpacity,
      ]}
    >
      <LinearGradient
        colors={["transparent", colors.default.black.translucid[800]]}
        locations={[0.0, 0.6]}
        style={[
          {
            padding: 8,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          },
        ]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1, y: 1 }}
      >
        <Pressable onPress={handleDelete}>
          <Animated.View
            style={[
              {
                height: "100%",
                padding: 4,
                backgroundColor: colors.default.secondary.translucid[200],
                borderRadius: 4,
                borderWidth: 2,
                borderColor: colors.default.secondary[400],
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <IonIcon
              name="trash"
              color={colors.default.secondary[400]}
              size={24}
            />
          </Animated.View>
        </Pressable>
      </LinearGradient>
    </Animated.View>
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
  containerTest: {
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
