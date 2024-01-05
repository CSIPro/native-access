import { Link, Stack } from "expo-router";
import { View, useColorScheme } from "react-native";
import { useAuth } from "reactfire";

import { IonIcon } from "@/components/icons/ion";
import { ProfileCard } from "@/components/profile-card/profile-card";
import { ProfileMenu } from "@/components/profile-menu/profile-menu";
import { TextButton } from "@/components/ui/text-button";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { deleteAllFromStorage } from "@/lib/utils";

export default function Settings() {
  const auth = useAuth();
  const colorScheme = useColorScheme();

  const isLight = colorScheme === "light";

  const handleSignOut = () => {
    deleteAllFromStorage();
    auth.signOut();
  };

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
              <Link
                {...props}
                href="/(app)/profile/settings"
                style={[{ padding: 4 }]}
              >
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
      <ProfileMenu />
      <TextButton
        variant="secondary"
        onPress={handleSignOut}
        style={[{ alignSelf: "center" }]}
      >
        Log out
      </TextButton>
    </View>
  );
}
