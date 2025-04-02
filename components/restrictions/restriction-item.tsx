import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { PopulatedRestriction } from "@/hooks/use-restrictions";
import { Link } from "expo-router";
import { createContext, FC, ReactNode, useContext } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

const RestrictionContext = createContext<PopulatedRestriction | null>(null);

interface Props {
  restriction: PopulatedRestriction;
}

export const RestrictionItem: FC<Props> = ({ restriction }) => {
  const sv = useDerivedValue(() => (restriction.isActive ? 1 : 0));
  const isLight = useColorScheme() === "light";

  const viewStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      sv.value,
      [0, 1],
      [
        isLight
          ? colors.default.secondary.translucid[400]
          : colors.default.secondary.translucid[100],
        isLight
          ? colors.default.tint.translucid[400]
          : colors.default.tint.translucid[100],
      ]
    );

    const borderColor = interpolateColor(
      sv.value,
      [0, 1],
      [
        isLight ? colors.default.secondary[600] : colors.default.secondary[400],
        isLight ? colors.default.tint[600] : colors.default.tint[400],
      ]
    );

    return {
      backgroundColor,
      borderColor,
    };
  });

  const timeslotStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      sv.value,
      [0, 1],
      [
        isLight
          ? colors.default.secondary.translucid[400]
          : colors.default.secondary.translucid[600],
        isLight
          ? colors.default.tint.translucid[400]
          : colors.default.tint.translucid[600],
      ]
    );

    return {
      backgroundColor,
    };
  });

  const startTime = restriction.startTime.substring(0, 5);
  const endTime = restriction.endTime.substring(0, 5);

  return (
    <Link href={`members/restrictions/${restriction.id}/update`} asChild>
      <Pressable style={[{ width: "100%" }]}>
        <Animated.View style={[styles.container, viewStyles]}>
          <RestrictionContext.Provider value={restriction}>
            <RestrictionRoleName>{restriction.role.name}</RestrictionRoleName>
            <RestrictionRoom>{restriction.room.name}</RestrictionRoom>
            <View style={[styles.restrictionData]}>
              <RestrictionDays bitmask={restriction.daysBitmask} />
              <View style={[styles.restrictionTime]}>
                <Animated.View style={[styles.timeslot, timeslotStyles]}>
                  <Text style={[styles.text, styles.monoText]}>
                    {startTime}
                  </Text>
                </Animated.View>
                <Text style={[styles.text, styles.monoText]}>-</Text>
                <Animated.View style={[styles.timeslot, timeslotStyles]}>
                  <Text style={[styles.text, styles.monoText]}>{endTime}</Text>
                </Animated.View>
              </View>
            </View>
          </RestrictionContext.Provider>
        </Animated.View>
      </Pressable>
    </Link>
  );
};

interface RestrictionRoleNameProps {
  children: ReactNode;
}

export const RestrictionRoleName: FC<RestrictionRoleNameProps> = ({
  children,
}) => {
  return <Text style={[styles.roleName]}>{children}</Text>;
};

interface RestrictionRoomProps {
  children: ReactNode;
}

export const RestrictionRoom: FC<RestrictionRoomProps> = ({ children }) => {
  const restriction = useContext(RestrictionContext);
  const sv = useDerivedValue(() => (restriction?.isActive ? 1 : 0));
  const isLight = useColorScheme() === "light";

  const viewStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      sv.value,
      [0, 1],
      [
        isLight ? colors.default.secondary[600] : colors.default.secondary[400],
        isLight ? colors.default.tint[600] : colors.default.tint[400],
      ]
    );

    return {
      backgroundColor,
    };
  });

  if (!restriction) {
    return null;
  }

  return (
    <Animated.View style={[styles.roomNameContainer, viewStyles]}>
      <Text numberOfLines={1} style={[styles.text, styles.roomName]}>
        {children}
      </Text>
    </Animated.View>
  );
};

interface RestrictionDaysProps {
  bitmask: number;
}

export const RestrictionDays: FC<RestrictionDaysProps> = ({ bitmask }) => {
  const days = ["D", "L", "M", "X", "J", "V", "S"];

  const selectedDays = [];

  for (let i = 0; i < 7; i++) {
    if (bitmask & (1 << i)) {
      selectedDays.push(days[i]);
    }
  }

  return (
    <View style={[styles.daysContainer]}>
      {days.map((d) => (
        <DayRestriction key={d} day={d} isActive={selectedDays.includes(d)} />
      ))}
    </View>
  );
};

interface DayRestrictionProps {
  day: string;
  isActive?: boolean;
}

const DayRestriction: FC<DayRestrictionProps> = ({ day, isActive = false }) => {
  const restriction = useContext(RestrictionContext);
  const sv = useDerivedValue(() => (restriction?.isActive ? 1 : 0));
  const isLight = useColorScheme() === "light";

  const viewStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      sv.value,
      [0, 1],
      [
        isLight
          ? colors.default.secondary.translucid[600]
          : colors.default.secondary.translucid[400],
        isLight
          ? colors.default.tint.translucid[600]
          : colors.default.tint.translucid[400],
      ]
    );

    return {
      backgroundColor,
    };
  });

  const backgroundColor = colors.default.tint.translucid[600];
  const opacity = isActive ? 1 : 0.3;

  return (
    <Animated.View
      style={[
        {
          backgroundColor,
          borderRadius: 4,
          padding: 4,
          opacity,
          width: 24,
          alignItems: "center",
          justifyContent: "center",
        },
        viewStyles,
      ]}
    >
      <Text style={[styles.text, styles.monoText]}>{day}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8,
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    overflow: "hidden",
    position: "relative",
  },
  text: {
    fontFamily: fonts.interMedium,
    fontSize: 16,
    color: colors.default.white[100],
  },
  roleName: {
    fontSize: 18,
    fontFamily: fonts.interMedium,
    color: colors.default.white[100],
  },
  roomName: {
    fontSize: 14,
    fontFamily: fonts.interBold,
    color: colors.default.white[100],
  },
  monoText: {
    fontFamily: fonts.monoBold,
  },
  roomNameContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 2,
    paddingHorizontal: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: colors.default.tint[400],
    alignItems: "center",
    width: "90%",
    maxWidth: "50%",
  },
  daysContainer: {
    flexDirection: "row",
    gap: 4,
  },
  restrictionData: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  restrictionTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  timeslot: {
    backgroundColor: colors.default.tint.translucid[600],
    borderRadius: 4,
    padding: 4,
  },
});
