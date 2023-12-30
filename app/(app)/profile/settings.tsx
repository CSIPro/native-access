import { Stack } from "expo-router";
import { View, useColorScheme } from "react-native";

import { ThemePicker } from "@/components/theme-picker/theme-picker";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

//TODO: App language preferences
export default function Settings() {
  const isLight = useColorScheme() === "light";

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
          headerTitle: "Settings",
          headerStyle: {
            backgroundColor: colors.default.tint[400],
          },
          headerTitleStyle: {
            fontFamily: fonts.poppinsMedium,
            color: colors.default.white[100],
          },
        }}
      />
      <ThemePicker />
    </View>
  );
}
