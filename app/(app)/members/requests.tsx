import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { RequestItem } from "@/components/requests/request-item";
import { RoomPicker } from "@/components/room-picker/room-picker";

import { useRoomRequests } from "@/hooks/use-requests";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

export default function RequestsPage() {
  const { status: reqStatus, data: requests } = useRoomRequests();
  const colorScheme = useColorScheme();

  const isLight = colorScheme === "light";

  const tint = isLight ? colors.default.tint[400] : colors.default.tint[200];
  const textColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];

  if (reqStatus === "loading") {
    return (
      <View style={[styles.centered]}>
        <ActivityIndicator size="large" color={tint} />
      </View>
    );
  }

  if (reqStatus === "error") {
    return (
      <View style={[styles.centered]}>
        <Text style={[styles.errorText, { color: textColor }]}>
          Error loading requests
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: isLight
            ? colors.default.white[100]
            : colors.default.black[400],
        },
      ]}
    >
      <View style={[styles.roomPickerWrapper]}>
        <RoomPicker />
      </View>
      <FlatList
        data={requests}
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: fonts.poppins,
    fontSize: 18,
  },
  main: {
    flex: 1,
  },
  roomPickerWrapper: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    width: "100%",
  },
});
