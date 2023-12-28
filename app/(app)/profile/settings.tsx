import { View } from "react-native";
import colors from "../../../constants/colors";
import { Stack } from "expo-router";
import fonts from "../../../constants/fonts";

//TODO: App theme preferences
//TODO: App language preferences
export default function Settings() {
  return (
    <View
      style={[
        { backgroundColor: colors.default.tint[400], flex: 1, width: "100%" },
      ]}
    >
      <Stack.Screen
        options={{
          headerTitle: "Settings",
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
