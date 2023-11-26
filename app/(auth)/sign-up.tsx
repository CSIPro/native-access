import { Text, View, useColorScheme } from "react-native";

import { CustomSafeArea } from "../../components/custom-safe-area/custom-safe-area";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";

export default function SignUp() {
  const colorSchemeValue = useColorScheme();

  const colorScheme = colorSchemeValue ?? "light";

  return (
    <CustomSafeArea>
      <View style={{ flex: 1, backgroundColor: colors[colorScheme].tint }}>
        <Text
          style={{
            color: colors[colorScheme].text,
            fontFamily: fonts.poppinsBold,
          }}
        >
          Sign Up screen
        </Text>
      </View>
    </CustomSafeArea>
  );
}
