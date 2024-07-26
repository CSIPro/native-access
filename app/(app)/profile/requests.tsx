import { Stack } from "expo-router";
import { View, useColorScheme } from "react-native";

import { UserRequests } from "@/components/requests/user-requests";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

export default function Requests() {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  return (
    <View
      style={[
        {
          backgroundColor: isLight
            ? colors.default.white[100]
            : colors.default.black[400],
          flex: 1,
          width: "100%",
        },
      ]}
    >
      <Stack.Screen
        options={{
          headerTitle: "Tus solicitudes",
          headerStyle: {
            backgroundColor: colors.default.tint[400],
          },
          headerTitleStyle: {
            fontFamily: fonts.poppinsMedium,
            color: colors.default.white[100],
          },
        }}
      />
      <UserRequests />
    </View>
  );
}
