import { IonIcon } from "@/components/icons/ion";
import { MaterialIcon } from "@/components/icons/material";
import { Input } from "@/components/ui/input";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Stack } from "expo-router";
import { Text, View, useColorScheme } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const isLight = useColorScheme() === "light";

  const backgroundColor = isLight
    ? colors.default.white[100]
    : colors.default.black[400];

  return (
    <SafeAreaView style={{ flex: 1, width: "100%", backgroundColor }}>
      <Stack.Screen
        options={{
          headerTitle: "Sign up",
          headerTitleStyle: {
            fontFamily: fonts.poppinsMedium,
            color: colors.default.white[100],
          },
          headerStyle: {
            backgroundColor: colors.default.tint[400],
          },
        }}
      />
      <View style={[{ padding: 4 }]}>
        <Input
          label="Name"
          icon={
            <IonIcon name="person" size={24} color={colors.default.tint[400]} />
          }
        />
      </View>
      <View style={[{ padding: 4 }]}>
        <Input
          label="UniSon ID"
          icon={
            <MaterialIcon
              name="badge"
              size={24}
              color={colors.default.tint[400]}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}
