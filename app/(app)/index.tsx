import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { FC, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Easing,
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { PibleScanner } from "@/components/pible/pible-scanner";
import {
  DashboardItem,
  DashboardItemBackground,
  DashboardItemContent,
  DashboardItemTitle,
  DashboardItemValue,
} from "@/components/ui/dashboard/item";

import fonts from "@/constants/fonts";
import colors from "@/constants/colors";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LogsList } from "@/components/logs/logs-list";
import {
  BrandingHeader,
  BrandingHeaderHighlight,
  BrandingHeaderTitle,
} from "@/components/ui/branding-header";
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { Link } from "expo-router";
import { MaterialIcon } from "@/components/icons/material";
import { useRoomStats } from "@/hooks/use-room-stats";
import { useUserStats } from "@/hooks/use-user-stats";
import { useUserContext } from "@/context/user-context";
import { Image } from "expo-image";
import { IonIcon } from "@/components/icons/ion";
import { useToast } from "@/context/toast-context";

const hornet = require("@/assets/hornet.svg");

export default function Home() {
  const { user } = useUserContext();
  const [sound, setSound] = useState<Audio.Sound>(null);
  const translationY = useSharedValue(0);
  const shouldPlaySound = useRef(false);
  const toast = useToast();

  const tabsHeight = useBottomTabBarHeight() + 4;
  const window = useWindowDimensions();
  const isLight = useColorScheme() === "light";

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/audio/shaw.mp3")
    );
    setSound(sound);

    await sound.playAsync();
    setTimeout(() => {
      sound.stopAsync();
    }, 1000);
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    if (event.contentOffset.y < 0) {
      translationY.value = withSpring(Math.abs(event.contentOffset.y * 45), {
        damping: 10,
        stiffness: 100,
        mass: 0.5,
      });
    }
  });

  const handleDrag = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    translationY.value = event.nativeEvent.translationY;

    if (translationY.value > 350 && !shouldPlaySound.current) {
      shouldPlaySound.current = true;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const endDrag = () => {
    translationY.value = withTiming(0, {
      duration: 300,
      easing: Easing.in(Easing.ease),
    });

    if (shouldPlaySound.current) {
      playSound();
      toast.showToast({
        title: "Shaw!",
        duration: 2000,
      });
      shouldPlaySound.current = false;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          translationY.value,
          [0, 350, 800],
          [0, 40, 72],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.default.tint[400],
      }}
    >
      <View style={[{ paddingVertical: 8, alignItems: "center" }]}>
        <View
          style={[
            {
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <BrandingHeader>
            <BrandingHeaderTitle style={[{ color: colors.default.white[100] }]}>
              CSI PRO
            </BrandingHeaderTitle>
            <BrandingHeaderHighlight
              textStyle={[
                {
                  color: colors.default.tint[400],
                  fontFamily: fonts.poppinsBold,
                },
              ]}
              highlightStyle={[{ backgroundColor: colors.default.white[100] }]}
            >
              ACCESS
            </BrandingHeaderHighlight>
          </BrandingHeader>
          <View
            style={[
              {
                ...StyleSheet.absoluteFillObject,
                right: 4,
                alignItems: "flex-end",
                justifyContent: "center",
              },
            ]}
          >
            {(user.isEventOrganizer || user.isRoot) && (
              <Link href="/events" replace style={[{ padding: 4 }]}>
                <MaterialIcon name="event" color="white" size={32} />
              </Link>
            )}
          </View>
        </View>
        <View
          style={[
            {
              position: "absolute",
              bottom: "-100%",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Image
            source={hornet}
            alt="Hornet icon"
            style={[{ width: 32, height: 32 }]}
          />
        </View>
      </View>
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: isLight
              ? colors.default.white[100]
              : colors.default.black[400],
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: "hidden",
          },
          animatedStyle,
        ]}
      >
        <Animated.ScrollView
          onScroll={scrollHandler}
          contentContainerStyle={{
            width: "100%",
            alignItems: "center",
            padding: 8,
            paddingBottom: tabsHeight + window.height * 0.35,
            gap: 6,
            borderRadius: 24,
          }}
        >
          <PanGestureHandler onGestureEvent={handleDrag} onEnded={endDrag}>
            <View
              style={[
                {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  height: 64,
                },
              ]}
            />
          </PanGestureHandler>
          <View style={[{ paddingVertical: 8 }]}>
            <BrandingHeader>
              <BrandingHeaderTitle>ROOM</BrandingHeaderTitle>
              <BrandingHeaderHighlight>STATS</BrandingHeaderHighlight>
            </BrandingHeader>
          </View>
          <RoomStats />
          <View
            style={[
              {
                flex: 1,
                minHeight: 192,
                width: "100%",
                padding: 4,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: colors.default.tint[400],
              },
            ]}
          >
            <LogsList
              disableScroll
              limit={3}
              itemStyle={[{ borderRadius: 4 }]}
            />
          </View>
          <View style={[{ paddingVertical: 8 }]}>
            <BrandingHeader>
              <BrandingHeaderTitle>PERSONAL</BrandingHeaderTitle>
              <BrandingHeaderHighlight>STATS</BrandingHeaderHighlight>
            </BrandingHeader>
          </View>
          <PersonalStats />
        </Animated.ScrollView>
      </Animated.View>
      <Animated.View
        entering={FadeInDown.duration(500).easing(Easing.out(Easing.ease))}
      >
        <PibleScanner />
      </Animated.View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const RoomStats = () => {
  const { data: stats } = useRoomStats();

  return (
    <View style={[{ flexDirection: "row", gap: 6 }]}>
      <SuccessfulLogs value={stats?.successful} />
      <View style={[{ gap: 6, flex: 1 }]}>
        <BluetoothLogs value={stats?.wireless} />
        <FailedLogs value={stats?.failed} />
      </View>
    </View>
  );
};

interface DashboardItemProps {
  value?: number;
}

const SuccessfulLogs: FC<DashboardItemProps> = ({ value = 0 }) => {
  return (
    <DashboardItem color="tint" logs={value ?? 0} style={[{ flex: 2 }]}>
      <DashboardItemBackground>
        <IonIcon
          name="shield-checkmark"
          size={172}
          color={colors.default.tint.translucid[600]}
        />
      </DashboardItemBackground>
      <DashboardItemContent>
        <DashboardItemValue style={[{ fontSize: 72 }]}>
          {value.toString().padStart(2, "0")}
        </DashboardItemValue>
        <DashboardItemTitle style={[{ fontSize: 16 }]}>
          Entries
        </DashboardItemTitle>
      </DashboardItemContent>
    </DashboardItem>
  );
};

const BluetoothLogs: FC<DashboardItemProps> = ({ value = 0 }) => {
  return (
    <DashboardItem color="bluetooth" logs={value ?? 0}>
      <DashboardItemBackground>
        <IonIcon
          name="bluetooth"
          color={colors.default.bluetooth.translucid[600]}
          size={112}
        />
      </DashboardItemBackground>
      <DashboardItemContent>
        <DashboardItemValue>
          {value.toString().padStart(2, "0")}
        </DashboardItemValue>
        <DashboardItemTitle>Wireless</DashboardItemTitle>
      </DashboardItemContent>
    </DashboardItem>
  );
};

const FailedLogs: FC<DashboardItemProps> = ({ value = 0 }) => {
  return (
    <DashboardItem color="secondary" logs={value ?? 0}>
      <DashboardItemBackground>
        <IonIcon
          name="close-circle"
          color={colors.default.secondary.translucid[600]}
          size={112}
        />
      </DashboardItemBackground>
      <DashboardItemContent>
        <DashboardItemValue>
          {value.toString().padStart(2, "0")}
        </DashboardItemValue>
        <DashboardItemTitle>Failed</DashboardItemTitle>
      </DashboardItemContent>
    </DashboardItem>
  );
};

const PersonalStats = () => {
  const { data: stats } = useUserStats();

  return (
    <View style={[{ flexDirection: "row", gap: 6 }]}>
      <View style={[{ gap: 6, flex: 1 }]}>
        <BluetoothLogs value={stats?.wireless} />
        <FailedLogs value={stats?.failed} />
      </View>
      <SuccessfulLogs value={stats?.successful} />
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardTitle: {
    fontFamily: fonts.poppins,
    color: "#222222",
    fontSize: 24,
  },
  logsBubble: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    height: 200,
    width: 200,
  },
  successContainer: {
    flex: 2,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: -16,
    borderWidth: 2,
  },
  successShadow: {
    backgroundColor: "transparent",
    borderRadius: 100,
    shadowColor: "#222222",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },
  dashboardRow: {
    gap: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  dataContainerShadow: {
    backgroundColor: "transparent",
    borderRadius: 8,
    shadowColor: "#222222",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
  dataContainer: {
    position: "relative",
    alignItems: "center",
    backgroundColor: "#fff",
    width: 100,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: "hidden",
  },
  dataTextContainer: {
    alignItems: "center",
    gap: -12,
  },
  dataContainerHighlight: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
  },
  bubbleText: {
    fontFamily: fonts.interMedium,
    fontSize: 14,
  },
});
