import { EventsList } from "@/components/events/events-list";
import { IonIcon } from "@/components/icons/ion";
import {
  BrandingHeader,
  BrandingHeaderHighlight,
  BrandingHeaderTitle,
} from "@/components/ui/branding-header";
import { TextButton } from "@/components/ui/text-button";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
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
        <BrandingHeader>
          <BrandingHeaderTitle style={[{ color: colors.default.white[100] }]}>
            CSI PRO
          </BrandingHeaderTitle>
          <BrandingHeaderHighlight
            textStyle={[styles.headerHighlight]}
            highlightStyle={[{ backgroundColor: colors.default.white[100] }]}
          >
            EVENTS
          </BrandingHeaderHighlight>
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
            <BrandingHeader>
              <BrandingHeaderTitle>INCOMING</BrandingHeaderTitle>
              <BrandingHeaderHighlight>EVENTS</BrandingHeaderHighlight>
            </BrandingHeader>
          </View>
          <EventsList />
          <View style={[{ paddingVertical: 8 }]}>
            <BrandingHeader>
              <BrandingHeaderTitle>PAST</BrandingHeaderTitle>
              <BrandingHeaderHighlight>EVENTS</BrandingHeaderHighlight>
            </BrandingHeader>
          </View>
          <EventsList past />
          <Link href="/events/create" asChild>
            <TextButton
              icon={
                <IonIcon
                  name="add"
                  size={24}
                  color={colors.default.tint[100]}
                />
              }
            >
              Crear evento
            </TextButton>
          </Link>
        </ScrollView>
      </View>
      <StatusBar style="light" />
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
    paddingVertical: 8,
    gap: 6,
    borderRadius: 24,
  },
  textButton: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.default.tint.translucid[100],
  },
  textButtonLabel: {
    fontFamily: fonts.poppinsMedium,
    paddingTop: 4,
    fontSize: 16,
    color: colors.default.tint[100],
  },
});
