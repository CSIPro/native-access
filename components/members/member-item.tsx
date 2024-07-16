import { format } from "date-fns/esm";
import { FC, ReactNode, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import {
  MemberCard,
  MemberCardAuthorized,
  MemberCardBirthday,
  MemberCardName,
  MemberCardRole,
  MemberCardUniSonId,
} from "./member-card";
import { MaterialIcon } from "../icons/material";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Member, useAccessUpdate } from "@/hooks/use-room-members";
import { useNestUser } from "@/hooks/use-user-data";
import { formatBirthday, formatUserName } from "@/lib/utils";
import { useUserContext } from "@/context/user-context";

interface Props {
  member: Member;
}

export const MemberItem: FC<Props> = ({ member }) => {
  const user = useUserContext();

  const [openDetails, setOpenDetails] = useState(false);
  const [localAccess, setLocalAccess] = useState(member.canAccess);

  const colorScheme = useColorScheme();

  const memberQuery = useNestUser(member.user.id);

  const accessMutation = useAccessUpdate(member.user.id);

  const isLight = colorScheme === "light";

  const handleCloseDetails = () => setOpenDetails(false);

  if (memberQuery.status === "loading") {
    return (
      <View>
        <View style={[styles.memberItem, { justifyContent: "center" }]}>
          <ActivityIndicator
            size="small"
            color={
              isLight ? colors.default.tint[400] : colors.default.tint[200]
            }
          />
        </View>
      </View>
    );
  }

  if (memberQuery.status === "error") {
    return (
      <View>
        <View style={[styles.memberItem]}>
          <Text
            style={[styles.errorText, { color: colors.default.white[100] }]}
          >
            Something went wrong
          </Text>
        </View>
      </View>
    );
  }

  const iconColor = isLight
    ? localAccess
      ? colors.default.tint[600]
      : colors.default.secondary[600]
    : localAccess
    ? colors.default.tint[200]
    : colors.default.secondary[200];

  const canSetAccess =
    user.user.isRoot ||
    (user.membership.role.canManageAccess &&
      user.membership.role.level > member.role.level);
  const canManageRoles =
    user.user.isRoot ||
    (user.membership.role.canManageRoles &&
      user.membership.role.level > member.role.level);

  const handleUpdateAccess = async (value: boolean) => {
    if (!canSetAccess) return;

    try {
      setLocalAccess(value);
      accessMutation.mutate(value);
    } catch (error) {
      setLocalAccess(!value);
      console.error(error);
    }
  };

  const memberName = formatUserName(member.user);

  const memberData = memberQuery.data;

  return (
    <View style={{ paddingHorizontal: 4 }}>
      <MemberWrapper memberHasAccess={localAccess}>
        <Pressable
          onPress={() => setOpenDetails(true)}
          style={[{ padding: 4 }]}
        >
          <View style={[styles.iconWrapper]}>
            <MaterialIcon name="visibility" size={24} color={iconColor} />
          </View>
        </Pressable>
        <MemberName>{memberName}</MemberName>
        <MemberAccess
          accessGranted={localAccess}
          setAccess={handleUpdateAccess}
          disabled={!canSetAccess}
        />
      </MemberWrapper>
      {openDetails && (
        <MemberCard
          open={openDetails}
          onClose={handleCloseDetails}
          kickable={canManageRoles}
        >
          <MemberCardName>
            {memberName}
            {" \u2022 "}
            {memberData.csiId}
          </MemberCardName>
          <MemberCardUniSonId>{memberData.unisonId}</MemberCardUniSonId>
          <MemberCardBirthday>
            {formatBirthday(memberData.dateOfBirth)}
          </MemberCardBirthday>
          <MemberCardRole
            canManageRoles={canManageRoles}
            roleId={member.role.id}
            userId={member.user.id}
          >
            {member.role.name ?? "Unknown"}
          </MemberCardRole>
          <MemberCardAuthorized authorized={localAccess} />
        </MemberCard>
      )}
    </View>
  );
};

interface MemberWrapperProps {
  memberHasAccess?: boolean;
  children: ReactNode;
}

const MemberWrapper: FC<MemberWrapperProps> = ({
  memberHasAccess = false,
  children,
}) => {
  const progress = useDerivedValue(
    () => (memberHasAccess ? withTiming(1) : withTiming(0)),
    [memberHasAccess]
  );

  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const wrapperStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [
        isLight
          ? colors.default.secondary.translucid[600]
          : colors.default.secondary.translucid[200],
        isLight
          ? colors.default.tint.translucid[700]
          : colors.default.tint.translucid[200],
      ]
    );

    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [
        isLight ? colors.default.secondary[600] : colors.default.secondary[300],
        isLight ? colors.default.tint[600] : colors.default.tint[300],
      ]
    );

    return { backgroundColor, borderColor };
  });

  return (
    <Animated.View
      style={[
        styles.memberItem,
        {
          borderRadius: 8,
          borderWidth: 2,
        },
        wrapperStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
};

const MemberName = ({ children }: { children: ReactNode }) => {
  if (!children) {
    return (
      <View style={[styles.nameWrapper]}>
        <Text style={[styles.missingName]}>Name not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.nameWrapper]}>
      <Text numberOfLines={1} style={[styles.memberName]}>
        {children}
      </Text>
    </View>
  );
};

interface MemberAccessProps {
  accessGranted?: boolean;
  setAccess: (value: boolean) => void;
  disabled?: boolean;
}

const MemberAccess: FC<MemberAccessProps> = ({
  accessGranted = false,
  setAccess,
  disabled = false,
}) => {
  return (
    <View
      style={[
        styles.switchWrapper,
        {
          backgroundColor: !disabled
            ? accessGranted
              ? colors.default.tint[400]
              : colors.default.secondary[400]
            : colors.default.gray[600],
        },
      ]}
    >
      <Switch
        disabled={disabled}
        value={accessGranted}
        onValueChange={setAccess}
        thumbColor={
          !disabled ? colors.default.white[100] : colors.default.gray[200]
        }
        trackColor={{
          false: disabled ? "transparent" : colors.default.secondary[200],
          true: disabled ? "transparent" : colors.default.tint[200],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  memberItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: 8,
    paddingVertical: 6,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: fonts.inter,
  },
  iconWrapper: {
    minWidth: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  nameWrapper: {
    flexGrow: 1,
    maxWidth: "70%",
  },
  missingName: {
    fontSize: 14,
    fontFamily: fonts.interLight,
    color: colors.default.white[100],
  },
  memberName: {
    fontSize: 18,
    fontFamily: fonts.interMedium,
    color: colors.default.white[100],
  },
  switchWrapper: {
    borderRadius: 100,
  },
});
