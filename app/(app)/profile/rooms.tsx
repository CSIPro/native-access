import { Stack } from "expo-router";
import { View, useColorScheme } from "react-native";

import { RoomList } from "@/components/rooms/room-list";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

export default function Rooms() {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const pageBg = isLight
    ? colors.default.white[100]
    : colors.default.black[400];

  return (
    <View style={[{ backgroundColor: pageBg, flex: 1, width: "100%" }]}>
      <Stack.Screen
        options={{
          headerTitle: "Your rooms",
          headerStyle: {
            backgroundColor: colors.default.tint[400],
          },
          headerTitleStyle: {
            fontFamily: fonts.poppinsMedium,
            color: colors.default.white[100],
          },
        }}
      />
      <RoomList />
    </View>
  );
}
