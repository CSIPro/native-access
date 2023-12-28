import { Stack } from "expo-router";

import colors from "@/constants/colors";

export default function ProfileLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerTintColor: colors.default.white[100],
      }}
    />
  );
}
