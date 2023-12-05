import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useRoleContext } from "../../context/role-context";
import colors from "../../constants/colors";
import { MembersList } from "./members-list";
import fonts from "../../constants/fonts";

export const RoleList = () => {
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
    <View style={[styles.main]}>
      {/* {roles.map((role) => (
        <View key={role.id} style={[{ gap: 4 }]}>
          <View
            style={[
              styles.roleNameWrapper,
              {
                backgroundColor: isLight
                  ? colors.default.tint[400]
                  : colors.default.tint[400],
              },
            ]}
          >
            <Text style={[styles.roleName]}>{role.name}</Text>
          </View>
          <MembersList roleId={role.id} />
        </View>
      ))} */}
      <FlatList
        data={roles}
        keyExtractor={(item) => item.id}
        renderItem={({ item: role }) => (
          <View style={[{ gap: 4 }]}>
            <View
              style={[
                styles.roleNameWrapper,
                {
                  backgroundColor: isLight
                    ? colors.default.tint[400]
                    : colors.default.tint[400],
                },
              ]}
            >
              <Text style={[styles.roleName]}>{role.name}</Text>
            </View>
            <MembersList roleId={role.id} />
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1, padding: 4, gap: 4 }}
        ListEmptyComponent={
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
              No roles found
            </Text>
          </View>
        }
      />
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
    fontFamily: fonts.poppinsRegular,
    fontSize: 14,
  },
  main: {
    flex: 1,
    width: "100%",
    gap: 8,
    flexGrow: 1,
  },
  roleNameWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    borderRadius: 4,
  },
  roleName: {
    fontFamily: fonts.poppinsBold,
    fontSize: 16,
    color: colors.default.white[100],
  },
});
