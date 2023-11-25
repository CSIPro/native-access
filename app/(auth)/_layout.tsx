import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { IonIcon } from "../../components/icons/ion";

import colors from "../../constants/colors";

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Sign in",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
