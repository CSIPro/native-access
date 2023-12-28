import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useAuth } from "reactfire";

import { ProfileCard } from "../../../components/profile-card/profile-card";

import colors from "../../../constants/colors";
import fonts from "../../../constants/fonts";
import { Link, Stack } from "expo-router";
import { IonIcon } from "../../../components/icons/ion";
import { ProfileMenu } from "@/components/profile-menu/profile-menu";

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
      <ProfileMenu />
      <Pressable
        onPress={() => auth.signOut()}
        style={[
          styles.buttonWrapper,
          {
            backgroundColor: isLight
              ? colors.default.secondary.translucid[400]
              : colors.default.secondary.translucid[200],
          },
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: isLight
                ? colors.default.secondary[300]
                : colors.default.secondary[500],
            },
          ]}
        >
          Log out
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    paddingTop: 4,
    fontFamily: fonts.poppinsMedium,
    fontSize: 16,
  },
});
