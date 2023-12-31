import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useStore } from "@/store/store";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Onboarding() {
  const setOnboarding = useStore((state) => state.setSeenOnboarding);

  const handleFinishOnboarding = () => {
    setOnboarding(true);

    router.replace("/(app)");
  };

  return (
    <SafeAreaView
      style={[styles.main, { backgroundColor: colors.default.tint[400] }]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={[styles.text, { color: colors.default.white[100] }]}>
        Onboarding
      </Text>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: fonts.poppins,
    fontSize: 16,
    paddingTop: 4,
  },
});
