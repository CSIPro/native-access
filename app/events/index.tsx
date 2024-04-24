import { BrandingHeader } from "@/components/ui/branding-header";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const accessLogo = require("../../assets/access-logo.svg");

export default function EventsHome() {
  const isLight = useColorScheme() === "light";

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header]}>
        <BrandingHeader
          highlight="EVENTS"
          textStyle={[{ color: colors.default.white[100] }]}
          highlightStyle={[{ backgroundColor: colors.default.white[100] }]}
          highlightTextStyle={[styles.headerHighlight]}
        >
          CSI PRO
        </BrandingHeader>
        <View style={[styles.accessLink]}>
          <Link href="/(app)" replace style={[{ padding: 4 }]}>
            <Image source={accessLogo} style={[styles.accessLogo]} />
          </Link>
        </View>
      </View>
      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: isLight
              ? colors.default.white[100]
              : colors.default.black[400],
          },
        ]}
      >
        <ScrollView contentContainerStyle={[styles.scrollContainer]}>
          <View style={[{ paddingVertical: 8 }]}>
            <BrandingHeader highlight="EVENTS">INCOMING</BrandingHeader>
          </View>
          <View style={[{ paddingVertical: 8 }]}>
            <BrandingHeader highlight="EVENTS">PAST</BrandingHeader>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.default.tint[400],
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  headerHighlight: {
    color: colors.default.tint[400],
    fontFamily: fonts.poppinsBold,
  },
  accessLink: {
    ...StyleSheet.absoluteFillObject,
    right: 4,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  accessLogo: {
    width: 32,
    height: 32,
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    width: "100%",
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    padding: 8,
    gap: 6,
    borderRadius: 24,
  },
});
