import { View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PibleScanner } from "../../components/pible/pible-scanner";

import colors from "../../constants/colors";

export default function Home() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors[colorScheme ?? "light"].tint,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        gap: 8,
      }}
    >
      <PibleScanner />
      <View
        style={{
          flex: 4,
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
      </View>
    </View>
  );
}
