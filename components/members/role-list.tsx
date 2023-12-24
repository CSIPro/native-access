import {
  ActivityIndicator,
  FlatList,
  SectionList,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useRoleContext } from "../../context/role-context";
import colors from "../../constants/colors";
import { MembersList } from "./members-list";
import fonts from "../../constants/fonts";
import { FC } from "react";
import { useReducedMembersByRole } from "../../hooks/use-room-members";
import { MemberItem } from "./member-item";
import { Role } from "../../hooks/use-roles";

interface Props {
  roles: Role[];
}

export const RoleList: FC<Props> = ({ roles }) => {
  const colorScheme = useColorScheme();
  const { status, data } = useReducedMembersByRole(roles);

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
          Something went wrong while retrieving members
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.main]}>
      <SectionList
        sections={data}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={[{ paddingHorizontal: 4 }]}>
            <MemberItem uid={item} />
          </View>
        )}
        renderSectionHeader={({ section: { roleData } }) => (
          <View style={[{ paddingHorizontal: 4 }]}>
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
              <Text style={[styles.roleName]}>{roleData.name}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1, gap: 4 }}
        ListEmptyComponent={
          <View style={[styles.centered]}>
            <Text
              style={[
                styles.errorText,
                {
                  color: isLight
                    ? colors.default.black[400]
                    : colors.default.white[100],
                },
              ]}
            >
              No members in this room
            </Text>
          </View>
        }
        stickySectionHeadersEnabled={true}
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
    fontFamily: fonts.poppins,
    fontSize: 14,
  },
  errorText: {
    fontFamily: fonts.poppins,
    fontSize: 14,
    textAlign: "center",
  },
  main: {
    flex: 1,
    width: "100%",
    gap: 4,
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
    paddingTop: 4,
    fontFamily: fonts.poppinsBold,
    fontSize: 16,
    color: colors.default.white[100],
  },
});
