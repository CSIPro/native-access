import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { RequestItem } from "@/components/requests/request-item";
import { RoomPicker } from "@/components/room-picker/room-picker";

import { useNestRoomRequests } from "@/hooks/use-requests";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

export default function RequestsPage() {
  const requests = useNestRoomRequests();
  const tabsHeight = useBottomTabBarHeight() + 64;
  const colorScheme = useColorScheme();

  const isLight = colorScheme === "light";

  const tint = isLight ? colors.default.tint[400] : colors.default.tint[200];
  const textColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];

  if (requests.status === "loading") {
    return (
      <View
        style={[
          styles.centered,
          {
            backgroundColor: isLight
              ? colors.default.white[100]
              : colors.default.black[400],
          },
        ]}
      >
        <ActivityIndicator size="large" color={tint} />
      </View>
    );
  }

  if (requests.status === "error") {
    return (
      <View
        style={[
          styles.centered,
          {
            backgroundColor: isLight
              ? colors.default.white[100]
              : colors.default.black[400],
          },
        ]}
      >
        <Text style={[styles.errorText, { color: textColor }]}>
          Ocurrió un error al cargar las solicitudes
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
        data={requests.data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 4,
          gap: 4,
          paddingBottom: tabsHeight,
        }}
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
}

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
