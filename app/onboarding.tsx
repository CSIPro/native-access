import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FC, ReactNode, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  scrollTo,
  useAnimatedRef,
  useDerivedValue,
} from "react-native-reanimated";

import { IonIcon } from "@/components/icons/ion";
import { OnboardingIndicator } from "@/components/onboarding/onboarding-indicator";
import { OnboardingItem } from "@/components/onboarding/onboarding-item";

import { useStore } from "@/store/store";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { slides } from "@/constants/slides";

export default function Onboarding() {
  const aRef =
    useAnimatedRef<
      Animated.FlatList<{
        id: string;
        title: string;
        description: string;
        image: number;
      }>
    >();

  const [index, setIndex] = useState(0);
  const scroll = useDerivedValue(() => index, [index]);
  const { width } = useWindowDimensions();

  useDerivedValue(() => scrollTo(aRef, scroll.value * width, 0, true));

  const setOnboarding = useStore((state) => state.setSeenOnboarding);

  const handleBack = () => {
    setIndex((prev) => (prev - 1 < 0 ? prev : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1 >= slides.length ? prev : prev + 1));
  };

  const handleFinishOnboarding = () => {
    setOnboarding(true);

    router.replace("/(app)");
  };

  const finished = index === slides.length - 1;

  return (
    <SafeAreaView style={[styles.main]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[{ flex: 4 }]}>
        <Animated.FlatList
          ref={aRef}
          data={slides}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
      <View style={[styles.actions, { width }]}>
        <OnboardingIndicator length={slides.length} value={index} />
        <View style={[styles.navigation]}>
          <BackButton onPress={handleBack} />
          <NextButton onPress={finished ? handleFinishOnboarding : handleNext}>
            {finished ? "Get started" : "Next"}
          </NextButton>
        </View>
        <SkipButton onPress={handleFinishOnboarding} />
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const NextButton: FC<{ onPress: () => void; children: ReactNode }> = ({
  onPress,
  children,
}) => {
  const isLight = useColorScheme() === "light";

  const backgroundColor = colors.default.tint.translucid[100];
  const color = isLight ? colors.default.tint[400] : colors.default.tint[100];

  return (
    <Pressable
      onPress={onPress}
      style={[styles.nextButton, { backgroundColor }]}
    >
      <Text style={[styles.text, { color, fontSize: 20 }]}>{children}</Text>
    </Pressable>
  );
};

const BackButton: FC<{ onPress: () => void }> = ({ onPress }) => {
  const isLight = useColorScheme() === "light";

  const backgroundColor = colors.default.secondary.translucid[100];
  const color = isLight
    ? colors.default.secondary[400]
    : colors.default.secondary[100];

  return (
    <Pressable
      onPress={onPress}
      style={[styles.backButton, { backgroundColor }]}
    >
      <IonIcon name="chevron-back" size={20} color={color} />
    </Pressable>
  );
};

const SkipButton: FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress} style={[styles.skipButton]}>
      <Text style={[styles.text, styles.skipText]}>Skip</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.default.black[400],
    paddingVertical: 16,
  },
  text: {
    fontFamily: fonts.poppins,
    fontSize: 16,
    paddingTop: 4,
  },
  centeredText: {
    textAlign: "center",
  },
  title: {
    fontFamily: fonts.poppinsBold,
    fontSize: 24,
  },
  actions: {
    gap: 8,
    alignItems: "center",
  },
  navigation: {
    height: 64,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  nextButton: {
    flexGrow: 1,
    height: "100%",
    borderRadius: 9999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    height: "100%",
    aspectRatio: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  skipButton: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    fontFamily: fonts.poppinsLight,
    fontSize: 14,
    color: colors.default.gray[500],
  },
});
