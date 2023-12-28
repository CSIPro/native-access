import { Pressable, Text, View, useColorScheme } from "react-native";
import { useAuth } from "reactfire";

import { ProfileCard } from "../../../components/profile-card/profile-card";

import colors from "../../../constants/colors";
import fonts from "../../../constants/fonts";
import { Link, Stack } from "expo-router";
import { IonIcon } from "../../../components/icons/ion";

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
      <Stack.Screen
        options={{
          headerRight: (props) => {
            return (
              <Link {...props} href="/(app)/profile/settings">
                <IonIcon
                  name="settings-outline"
                  size={24}
                  color={colors.default.white[100]}
                />
              </Link>
            );
          },
          headerShown: true,
          headerTitle: "Profile",
          headerStyle: { backgroundColor: colors.default.tint[400] },
          headerTitleStyle: {
            fontFamily: fonts.poppinsMedium,
            color: colors.default.white[100],
          },
        }}
      />
      <ProfileCard />
      <Link href="/(app)/profile/requests" asChild>
        <Pressable
          style={[
            {
              backgroundColor: isLight
                ? colors.default.tint.translucid[100]
                : colors.default.tint.translucid[400],
              padding: 8,
              borderRadius: 8,
              width: "100%",
            },
          ]}
        >
          <Text
            style={[
              {
                fontFamily: fonts.poppinsMedium,
                color: isLight
                  ? colors.default.tint[400]
                  : colors.default.tint[200],
                fontSize: 16,
              },
            ]}
          >
            Your requests
          </Text>
        </Pressable>
      </Link>
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
