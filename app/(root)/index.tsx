import { Text, View } from "react-native";

import colors from "../../constants/colors";

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.light.background }}>
      <Text
        style={{ fontFamily: "Poppins_400Regular", color: colors.light.text }}
      >
        Home aaaaaa
      </Text>
    </View>
  );
}
