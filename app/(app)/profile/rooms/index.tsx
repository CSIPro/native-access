import { Link, Stack } from "expo-router";
import { View, useColorScheme } from "react-native";

import { RoomList } from "@/components/rooms/room-list";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { IonIcon } from "@/components/icons/ion";
import { useUserContext } from "@/context/user-context";

export default function Rooms() {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";
  const { user } = useUserContext();

  const pageBg = isLight
    ? colors.default.white[100]
    : colors.default.black[400];

  return (
    <View style={[{ backgroundColor: pageBg, flex: 1, width: "100%" }]}>
      <Stack.Screen
        options={{
          headerTitle: "Tus salones",
          headerStyle: {
            backgroundColor: colors.default.tint[400],
          },
          headerTitleStyle: {
            fontFamily: fonts.poppinsMedium,
            color: colors.default.white[100],
          },
          headerRight: user.isRoot
            ? () => (
                <Link href="/(app)/profile/rooms/create">
                  <IonIcon
                    name="add"
                    color={colors.default.white[100]}
                    size={24}
                  />
                </Link>
              )
            : null,
        }}
      />
      <RoomList />
    </View>
  );
}
