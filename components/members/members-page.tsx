import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useRoleContext } from "../../context/role-context";
import colors from "../../constants/colors";
import { RoleList } from "./role-list";
import fonts from "../../constants/fonts";
import { RoomPicker } from "../room-picker/room-picker";

export const MembersPage = () => {
  const colorScheme = useColorScheme();
  const { status, roles } = useRoleContext();

  const isLight = colorScheme === "light";

  if (status === "loading") {
    return (
      <View style={[styles.centered]}>
        <ActivityIndicator
          size="large"
          color={isLight ? colors.default.tint[400] : colors.default.tint[200]}
        />
      </View>
    );
  }

  if (status === "error") {
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
      <RoleList roles={roles} />
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
