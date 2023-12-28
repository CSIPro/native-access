import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Rooms() {
  return (
    <View
      style={[
        { backgroundColor: colors.default.tint[400], flex: 1, width: "100%" },
      ]}
    >
      <Stack.Screen
        options={{
          headerTitle: "Your rooms",
          headerStyle: {
            backgroundColor: colors.default.tint[400],
          },
          headerTitleStyle: {
            fontFamily: fonts.poppinsMedium,
            color: colors.default.white[100],
          },
        }}
      />
    </View>
  );
}
