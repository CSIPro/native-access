import { FC } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useRoomMembersByRole } from "../../hooks/use-room-members";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { MemberItem } from "./member-item";

interface Props {
  roleId: string;
}

export const MembersList: FC<Props> = ({ roleId }) => {
  const colorScheme = useColorScheme();
  const { status, data } = useRoomMembersByRole(roleId);

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

  const members = data?.docs.map((doc) => doc.ref.parent.parent?.id);

  return (
    <View style={[styles.main]}>
      <FlatList
        data={members}
        keyExtractor={(item) => item}
        renderItem={({ item: uid }) => <MemberItem uid={uid} />}
        contentContainerStyle={{ flexGrow: 1, gap: 16 }}
        ListEmptyComponent={
          <View style={[styles.centered]}>
            <Text style={[styles.errorText]}>No members in this role</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    width: "100%",
  },
  centeredText: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 14,
  },
  errorText: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 14,
    textAlign: "center",
  },
});
