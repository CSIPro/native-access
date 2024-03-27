import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useRoomContext } from "@/context/room-context";
import { Room } from "@/hooks/use-rooms";
import {
  ActivityIndicator,
  FlatList,
  SectionList,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { RoomItem } from "./room-item";

export const RoomList = () => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const { status, rooms, userRooms } = useRoomContext();

  const tintColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  const textColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];

  if (status === "loading") {
    return (
      <View style={[styles.centered]}>
        <ActivityIndicator size="large" color={tintColor} />
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={[styles.centered]}>
        <Text style={[styles.text, { color: textColor }]}>
          Error fetching rooms
        </Text>
      </View>
    );
  }

  const availableRooms = rooms.filter(
    (room) => !userRooms.some((r) => r.id === room.id)
  );

  const sectionedRooms = rooms.reduce(
    (acc, room) => {
      const isAvailable = availableRooms.some((r) => r.id === room.id);
      const section = isAvailable ? "Available" : "Joined";

      if (!acc[section]) {
        acc[section] = [];
      }

      acc[section].push(room);

      return acc;
    },
    { Available: [] as Room[], Joined: [] as Room[] }
  );

  const sectionedData = Object.entries(sectionedRooms)
    .map(([title, data]) => ({
      title,
      data,
    }))
    .sort((a, _) => (a.title === "Available" ? 1 : -1));

  return (
    <SectionList
      sections={sectionedData}
      keyExtractor={(item) => item.id}
      renderSectionHeader={({ section: { title } }) => (
        <View style={[styles.section]}>
          <Text
            style={[
              styles.text,
              {
                color: colors.default.white[100],
                fontFamily: fonts.interBold,
              },
            ]}
          >
            {title}
          </Text>
        </View>
      )}
      renderItem={({ section, item, index }) => (
        <View style={[{ paddingHorizontal: 4 }]}>
          <RoomItem room={item} isAvailable={section.title === "Available"} />
        </View>
      )}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 4,
        paddingVertical: 8,
        gap: 4,
      }}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: fonts.inter,
    fontSize: 16,
  },
  section: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: colors.default.tint[400],
  },
});
