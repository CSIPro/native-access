import { Link } from "expo-router";

import { Pressable, Text, View, useColorScheme } from "react-native";

import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { useAuth } from "reactfire";

export default function Settings() {
  const auth = useAuth();
  const colorScheme = useColorScheme();

  const isLight = colorScheme === "light";

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        backgroundColor: isLight
          ? colors.default.white[100]
          : colors.default.black[400],
      }}
    >
      <Link href="(auth)">Go to auth</Link>
      <Pressable
        onPress={() => auth.signOut()}
        style={[{ padding: 8, backgroundColor: "#7145d6" }]}
      >
        <Text
          style={[
            { fontFamily: fonts.poppinsMedium, fontSize: 16, color: "#fff" },
          ]}
        >
          Log out
        </Text>
      </Pressable>
    </View>
  );
}
