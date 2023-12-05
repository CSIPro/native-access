import { FC, ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import {
  useUserDataWithId,
  useUserRoleWithId,
} from "../../hooks/use-user-data";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";

interface Props {
  uid?: string;
}

export const MemberItem: FC<Props> = ({ uid = "invalid" }) => {
  const colorScheme = useColorScheme();
  const { status: userDataStatus, data: userData } = useUserDataWithId(uid);
  const {
    status: userRoleStatus,
    data: userRoleData,
    doc: userRoleDoc,
  } = useUserRoleWithId(uid);

  const isLight = colorScheme === "light";

  if (userDataStatus === "loading" || userRoleStatus === "loading") {
    return (
      <View style={[styles.memberItem]}>
        <ActivityIndicator
          size="small"
          color={isLight ? colors.default.tint[400] : colors.default.tint[200]}
        />
      </View>
    );
  }

  if (userDataStatus === "error" || userRoleStatus === "error") {
    return (
      <View style={[styles.memberItem]}>
        <Text style={[styles.errorText, { color: colors.default.white[100] }]}>
          Something went wrong
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.memberItem,
        {
          backgroundColor: isLight
            ? colors.default.tint.translucid[600]
            : colors.default.tint.translucid[300],
        },
      ]}
    >
      <MemberName>{userData?.name ?? "Name not found"}</MemberName>
    </View>
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

const styles = StyleSheet.create({
  memberItem: {
    marginBottom: 4,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: 4,
    paddingTop: 8,
    borderRadius: 4,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: fonts.poppinsRegular,
  },
  nameWrapper: {
    maxWidth: "70%",
  },
  missingName: {
    fontSize: 14,
    fontFamily: fonts.poppinsLight,
    color: colors.default.white[100],
  },
  memberName: {
    fontSize: 16,
    fontFamily: fonts.poppinsRegular,
    color: colors.default.white[100],
  },
});
