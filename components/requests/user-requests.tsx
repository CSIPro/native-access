import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useNestUserRequests, useUserRequests } from "@/hooks/use-requests";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { RequestItem } from "./request-item";
import { useUserContext } from "@/context/user-context";

export const UserRequests = () => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const { user } = useUserContext();
  const { status, data } = useNestUserRequests(user.id);

  const tint = isLight ? colors.default.tint[400] : colors.default.tint[200];
  const textColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];

  if (status === "loading") {
    return (
      <View style={[styles.main, styles.centered]}>
        <ActivityIndicator size="large" color={tint} />
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={[styles.main, styles.centered]}>
        <Text style={[styles.errorText, { color: textColor }]}>Error</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: isLight
            ? colors.default.white[100]
            : colors.default.black[400],
        },
      ]}
    >
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1, padding: 4, gap: 4 }}
        renderItem={({ item: request }) => <RequestItem request={request} />}
        ListEmptyComponent={
          <View style={[styles.centered]}>
            <Text style={[styles.errorText, { color: textColor }]}>
              Quite empty here...
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: fonts.poppins,
    fontSize: 16,
    textAlign: "center",
  },
  text: {
    paddingTop: 4,
    fontFamily: fonts.poppins,
    fontSize: 16,
  },
});
