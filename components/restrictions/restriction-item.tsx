import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { PopulatedRestriction } from "@/hooks/use-restrictions";
import { FC, ReactNode } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

interface Props {
  restriction: PopulatedRestriction;
}

export const RestrictionItem: FC<Props> = ({ restriction }) => {
  const isLight = useColorScheme() === "light";

  const backgroundColor = isLight
    ? colors.default.tint.translucid[400]
    : colors.default.tint.translucid[100];

  const borderColor = isLight
    ? colors.default.tint[600]
    : colors.default.tint[400];

  const startTime = restriction.startTime.substring(0, 5);
  const endTime = restriction.endTime.substring(0, 5);

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <RestrictionRoleName>{restriction.role.name}</RestrictionRoleName>
      <RestrictionRoom>{restriction.room.name}</RestrictionRoom>
      <View style={[styles.restrictionData]}>
        <RestrictionDays bitmask={restriction.daysBitmask} />
        <View style={[styles.restrictionTime]}>
          <View style={[styles.timeslot]}>
            <Text style={[styles.text, styles.monoText]}>{startTime}</Text>
          </View>
          <Text style={[styles.text, styles.monoText]}>-</Text>
          <View style={[styles.timeslot]}>
            <Text style={[styles.text, styles.monoText]}>{endTime}</Text>
          </View>
        </View>
      </View>
    </View>
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
  return (
    <View style={[styles.roomNameContainer]}>
      <Text numberOfLines={1} style={[styles.text, styles.roomName]}>
        {children}
      </Text>
    </View>
  );
};

interface RestrictionDaysProps {
  bitmask: number;
}

export const RestrictionDays: FC<RestrictionDaysProps> = ({ bitmask }) => {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

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
  const backgroundColor = colors.default.tint.translucid[600];
  const opacity = isActive ? 1 : 0.3;

  return (
    <View
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
      ]}
    >
      <Text style={[styles.text, styles.monoText]}>{day.charAt(0)}</Text>
    </View>
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
