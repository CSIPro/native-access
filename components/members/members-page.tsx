import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { RoleList } from "./role-list";
import { RoomPicker } from "../room-picker/room-picker";

import { useRoleContext } from "@/context/role-context";
import { useUserData } from "@/hooks/use-user-data";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

export const MembersPage = () => {
  const colorScheme = useColorScheme();
  const { status, roles } = useRoleContext();
  const { status: userStatus, data: userData } = useUserData();

  const isLight = colorScheme === "light";

  if (status === "loading" || userStatus === "loading") {
    return (
      <View style={[styles.centered]}>
        <ActivityIndicator
          size="large"
          color={isLight ? colors.default.tint[400] : colors.default.tint[200]}
        />
      </View>
    );
  }

  if (status === "error" || userStatus === "error") {
    return (
      <View style={[styles.centered]}>
        <Text
          style={[
            styles.centeredText,
            {
              color: isLight
                ? colors.default.black[400]
                : colors.default.white[100],
            },
          ]}
        >
          Something went wrong while retrieving roles
        </Text>
      </View>
    );
  }

  const userRole = roles.find((role) => role.id === userData?.role?.id);
  const isRoot = userData?.isRoot ?? false;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isLight
          ? colors.default.white[100]
          : colors.default.black[400],
      }}
    >
      <View style={[styles.roomPickerWrapper]}>
        <RoomPicker />
      </View>
      <RoleList roles={roles} userRole={userRole} isRoot={isRoot} />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredText: {
    textAlign: "center",
    fontFamily: fonts.poppins,
    fontSize: 14,
  },
  roomPickerWrapper: {
    paddingHorizontal: 4,
    paddingBottom: 8,
    paddingVertical: 4,
    width: "100%",
  },
});
