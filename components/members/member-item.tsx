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

import { Role } from "@/hooks/use-roles";
import { useAccessUpdate, useMemberQuery } from "@/hooks/use-user-data";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

interface Props {
  uid?: string;
  role: Role;
  userRole: Role;
  isRoot: boolean;
}

export const MemberItem: FC<Props> = ({
  uid = "invalid",
  role,
  userRole,
  isRoot,
}) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [localAccess, setLocalAccess] = useState(false);

  const colorScheme = useColorScheme();
  const {
    status: memberStatus,
    data: memberData,
    doc: memberDoc,
  } = useMemberQuery(uid);
  const { accessMutation } = useAccessUpdate(uid);

  const isLight = colorScheme === "light";

  const handleCloseDetails = () => setOpenDetails(false);

  useEffect(() => {
    if (memberStatus !== "success") return;

    setLocalAccess(memberData?.role?.accessGranted ?? false);
  }, [memberStatus, memberData]);

  if (memberStatus === "loading") {
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

  if (memberStatus === "error") {
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
    isRoot ||
    ((userRole?.canGrantOrRevokeAccess ?? false) &&
      userRole?.level > role?.level);
  const canSetRoles =
    isRoot || ((userRole?.canSetRoles ?? false) && userRole.level > role?.level);
  const canKickMembers =
    isRoot ||
    ((userRole?.canKickMembers ?? false) && userRole.level > role?.level);

  const handleUpdateAccess = async (value: boolean) => {
    if (!memberDoc || !canSetAccess) return;

    try {
      setLocalAccess(value);
      accessMutation.mutate(value);
    } catch (error) {
      setLocalAccess(!value);
      console.error(error);
    }
  };

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
        <MemberName>{memberData?.name ?? "Unknown"}</MemberName>
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
          kickable={canKickMembers}
          doc={memberDoc}
        >
          <MemberCardName>
            {memberData?.name}
            {" \u2022 "}
            {memberData?.csiId}
          </MemberCardName>
          <MemberCardUniSonId>{memberData?.unisonId}</MemberCardUniSonId>
          <MemberCardBirthday>
            {format(memberData?.dateOfBirth.toDate(), "MMMM dd")}
          </MemberCardBirthday>
          <MemberCardRole
            canSetRoles={canSetRoles}
            roleDoc={memberDoc}
            roleData={memberData}
          >
            {role?.name}
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
    fontFamily: fonts.poppins,
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
    fontFamily: fonts.poppinsLight,
    color: colors.default.white[100],
    paddingTop: 4,
  },
  memberName: {
    fontSize: 18,
    fontFamily: fonts.poppinsMedium,
    color: colors.default.white[100],
    paddingTop: 4,
  },
  switchWrapper: {
    borderRadius: 100,
  },
});
