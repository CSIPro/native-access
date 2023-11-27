import { Link } from "expo-router";

import { View, useColorScheme } from "react-native";

import colors from "../../constants/colors";

export default function Settings() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        gap: 8,
      }}
    >
      <Link href="(auth)">Go to auth</Link>
    </View>
  );
}
