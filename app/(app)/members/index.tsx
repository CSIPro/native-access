import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { RoleList } from "@/components/members/role-list";
import { RoomPicker } from "@/components/room-picker/room-picker";

import { useRoleContext } from "@/context/role-context";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useUserContext } from "@/context/user-context";

export default function MembersPage() {
  const colorScheme = useColorScheme();
  const { roles } = useRoleContext();
  const user = useUserContext();

  const isLight = colorScheme === "light";

  const userRole = roles.find((role) => role.id === user.membership.role.id);
  const isRoot = user.user.isRoot ?? false;

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
}

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
