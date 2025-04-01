import { Stack } from "expo-router";

export default function RestrictionsLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
