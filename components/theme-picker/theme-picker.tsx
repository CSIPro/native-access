import {
  Appearance,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import fonts from "@/constants/fonts";

import { Card, CardBody, CardFooter, CardHeader } from "../ui/card";
import { useStore } from "@/store/store";
import { RadioButton, RadioGroup } from "../ui/radio/radio";
import colors from "@/constants/colors";

export const ThemePicker = () => {
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const colorScheme = useColorScheme();

  const isLight = colorScheme === "light";

  const disclaimerColor = isLight
    ? colors.default.black.translucid[500]
    : colors.default.gray[400];

  return (
    <View style={[{ padding: 4 }]}>
      <Card>
        <CardHeader>Theme</CardHeader>
        <CardBody>
          <RadioGroup value={theme} onChange={setTheme}>
            <RadioButton value="light">Light</RadioButton>
            <RadioButton value="dark">Dark</RadioButton>
            <RadioButton value="system">Follow system</RadioButton>
          </RadioGroup>
        </CardBody>
        <CardFooter style={[{ justifyContent: "flex-start" }]}>
          <Text style={[styles.text, { color: disclaimerColor, fontSize: 14 }]}>
            You might need to restart the app for the theme to apply properly
          </Text>
        </CardFooter>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 18,
  },
  text: {
    fontFamily: fonts.poppins,
    fontSize: 16,
  },
});
