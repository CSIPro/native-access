import { Pressable, Text, View, useColorScheme } from "react-native";
import { useAuth } from "reactfire";

import { ProfileCard } from "../../components/profile-card/profile-card";

import colors from "../../constants/colors";
import fonts from "../../constants/fonts";

export default function Settings() {
  const auth = useAuth();
  const colorScheme = useColorScheme();

  const isLight = colorScheme === "light";

  return (
    <View
      style={{
        flex: 1,
        padding: 8,
        gap: 8,
        backgroundColor: isLight
          ? colors.default.white[100]
          : colors.default.black[400],
      }}
    >
      <ProfileCard />
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
