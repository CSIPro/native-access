import { FC, ReactNode, useState } from "react";
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
  useUserData,
  useUserDataWithId,
  useUserRoleWithId,
} from "../../hooks/use-user-data";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { updateDoc } from "firebase/firestore";
import { useRoleContext } from "../../context/role-context";
import {
  MemberCard,
  MemberCardAuthorized,
  MemberCardBirthday,
  MemberCardName,
  MemberCardRole,
  MemberCardUniSonId,
} from "./member-card";
import { format } from "date-fns/esm";
import { MaterialIcon } from "../icons/material";

interface Props {
  uid?: string;
}

export const MemberItem: FC<Props> = ({ uid = "invalid" }) => {
  const [openDetails, setOpenDetails] = useState(false);

  const colorScheme = useColorScheme();
  const { status: rolesStatus, roles } = useRoleContext();
  const { status: userStatus, data: userData } = useUserData();
  const { status: memberStatus, data: memberData } = useUserDataWithId(uid);
  const {
    status: memberRoleStatus,
    data: memberRoleData,
    doc: memberRoleDoc,
  } = useUserRoleWithId(uid);

  const isLight = colorScheme === "light";

  const handleCloseDetails = () => setOpenDetails(false);

  if (
    memberStatus === "loading" ||
    memberRoleStatus === "loading" ||
    rolesStatus === "loading" ||
    userStatus === "loading"
  ) {
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

  if (
    memberStatus === "error" ||
    memberRoleStatus === "error" ||
    rolesStatus === "error" ||
    userStatus === "error"
  ) {
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

  const memberHasAccess = !!memberRoleData?.accessGranted ?? false;

  const iconColor = isLight
    ? memberHasAccess
      ? colors.default.tint[600]
      : colors.default.secondary[600]
    : memberHasAccess
    ? colors.default.tint[200]
    : colors.default.secondary[200];

  const isRoot = userData?.isRoot ?? false;
  const memberRole = roles.find((role) => role?.id === memberRoleData?.roleId);
  const userRole = roles.find((role) => role?.id === userData?.role?.roleId);
  const canSetAccess =
    isRoot ||
    ((userRole?.canGrantOrRevokeAccess ?? false) &&
      userRole?.level > memberRole?.level);
  const canSetRoles =
    isRoot ||
    ((userRole?.canSetRoles ?? false) && userRole?.level > memberRole?.level);
  const canKickMembers =
    isRoot ||
    ((userRole?.canKickMembers ?? false) &&
      userRole?.level > memberRole?.level);

  const handleUpdateAccess = async (value: boolean) => {
    if (!memberRoleDoc || !canSetAccess) return;

    try {
      await updateDoc(memberRoleDoc, { accessGranted: value });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ paddingHorizontal: 4 }}>
      <Pressable onPress={() => setOpenDetails(true)}>
        <MemberWrapper memberHasAccess={memberHasAccess}>
          <View style={[styles.iconWrapper]}>
            <MaterialIcon name="visibility" size={24} color={iconColor} />
          </View>
          <MemberName>{memberData?.name ?? "Unknown"}</MemberName>
          <MemberAccess
            accessGranted={!!memberRoleData?.accessGranted}
            setAccess={handleUpdateAccess}
            disabled={!canSetAccess}
          />
        </MemberWrapper>
      </Pressable>
      <MemberCard
        open={openDetails}
        onClose={handleCloseDetails}
        kickable={canKickMembers}
        doc={memberRoleDoc}
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
          roleDoc={memberRoleDoc}
          roleData={memberRoleData}
        >
          {memberRole?.name}
        </MemberCardRole>
        <MemberCardAuthorized authorized={memberHasAccess} />
      </MemberCard>
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

  const backgroundColor = isLight
    ? memberHasAccess
      ? colors.default.tint.translucid[700]
      : colors.default.secondary.translucid[600]
    : memberHasAccess
    ? colors.default.tint.translucid[200]
    : colors.default.secondary.translucid[200];

  const borderColor = isLight
    ? memberHasAccess
      ? colors.default.tint[600]
      : colors.default.secondary[600]
    : memberHasAccess
    ? colors.default.tint[300]
    : colors.default.secondary[300];

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
