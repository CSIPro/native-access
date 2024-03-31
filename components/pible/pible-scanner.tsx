import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import IonIcons from "@expo/vector-icons/Ionicons";

import { FC, useEffect, useState } from "react";
import {
  useColorScheme,
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  StretchInX,
  StretchOutX,
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { State } from "react-native-ble-plx";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  Blur,
  Canvas,
  Group,
  Path,
  Skia,
  fitbox,
  mix,
  rect,
} from "@shopify/react-native-skia";

import { PibleItem } from "./pible-item";
import { RoomPicker } from "../room-picker/room-picker";
import { Checkbox, CheckboxLabel } from "../ui/checkbox";
import { Particle } from "../ui/particle/particle";

import { useStore } from "@/store/store";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

const accessLogo = require("@/assets/access-logo.svg");

const quintEasing = (x: number) => {
  "worklet";
  return x * x * x * x * x;
};

export const PibleScanner = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const connect = useStore((state) => state.connect);
  const devices = useStore((state) => state.devices);
  const bleState = useStore((state) => state.bluetoothState);
  const autoConnect = useStore((state) => state.autoConnect);
  const setAutoConnect = useStore((state) => state.setAutoConnect);
  const selectedRoom = useStore((state) => state.selectedRoom);
  const scanState = useStore((state) => state.scanState);
  const isScanning = scanState === "scanning";
  const isConnecting = scanState === "connecting";
  const window = useWindowDimensions();

  const sv = useSharedValue(0);
  const button = useSharedValue(0);
  const wave = useSharedValue(1);

  useEffect(() => {
    const generateWaves = () => {
      wave.value = withRepeat(
        withTiming(1, {
          duration: 2000,
          easing: Easing.in(Easing.cubic),
        }),
        -1,
        false
      );
    };

    const clearWave = () => {
      wave.value = 0;
    };

    const clearParticles = () => {
      setParticles([]);
    };

    if (isScanning) {
      button.value = withRepeat(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        0,
        true
      );

      generateWaves();
      clearParticles();
    } else if (isConnecting) {
      sv.value = withRepeat(withTiming(1, { duration: 2000 }), 0, true);
      button.value = withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      });

      setParticles([]);
      const particles: Particle[] = [];

      for (let i = 0; i < 100; i++) {
        const offsetX = Math.random() * (window.width - 8) + 4;
        const offsetY = Math.random() * 30 + 76;
        const id = i * offsetX * Math.random();

        const particle: Particle = {
          id,
          offsetX,
          offsetY,
          delay: Math.random() * 300 * i + 750,
        };

        particles.push(particle);
      }

      setParticles(particles);
      clearWave();
    } else {
      sv.value = withTiming(0, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      });
      button.value = withTiming(0, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      });

      clearParticles();
      clearWave();
    }

    return () => {
      clearParticles();
      clearWave();

      cancelAnimation(sv);
      cancelAnimation(button);
    };
  }, [isScanning, isConnecting]);

  useEffect(() => {
    if (autoConnect) {
      if (devices.length > 0) {
        setTimeout(() => {
          const device = devices.find((d) =>
            d.localName?.includes(selectedRoom)
          );

          if (device) {
            connect(device);
          }
        }, 750);
      }
    }
  }, [autoConnect, devices]);

  const animatedItemStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      sv.value,
      [0, 1],
      [colors.default.tint.translucid[200], colors.default.tint.translucid[700]]
    );

    return { backgroundColor };
  });

  const isLight = useColorScheme() === "light";
  const tabsHeight = useBottomTabBarHeight() + 4;

  const btState =
    bleState === State.PoweredOn
      ? "ON"
      : bleState === State.PoweredOff
      ? "OFF"
      : "ERR";

  const showDevices =
    devices.length > 0 && (isScanning || isConnecting) && !autoConnect;

  return (
    <View
      style={[styles.wrapper, { alignItems: "center", bottom: tabsHeight + 4 }]}
    >
      {showDevices ? (
        <Animated.View
          entering={StretchInX}
          exiting={StretchOutX}
          style={[
            styles.container,
            {
              height: 64,
            },
          ]}
        >
          <BlurView intensity={24} tint="dark" style={[styles.blur]} />
          <FlatList
            horizontal
            data={devices}
            keyExtractor={(item, index) =>
              `${item.id}-${item.localName}-${item.rssi}-${index}`
            }
            renderItem={({ item }) => <PibleItem device={item} />}
            contentContainerStyle={{
              flexGrow: 1,
              gap: 4,
              alignItems: "center",
            }}
          />
        </Animated.View>
      ) : (
        <View style={[{ height: 64 }]} />
      )}
      <Animated.View style={[styles.container, animatedItemStyle]}>
        <BlurView intensity={24} tint="dark" style={[styles.blur]} />
        <Canvas
          style={[
            styles.container,
            {
              ...StyleSheet.absoluteFillObject,
              overflow: "hidden",
              backgroundColor: "transparent",
            },
          ]}
        >
          <ScanWave progress={wave} />
          {particles.map((particle) => (
            <Particle
              key={particle.id}
              offsetX={particle.offsetX}
              offsetY={particle.offsetY}
              delay={particle.delay}
            />
          ))}
        </Canvas>
        <PibleButton progress={button} />
        <View style={[styles.actionsContainer]}>
          <View style={[styles.actions]}>
            <View
              style={[
                styles.actionButton,
                {
                  width: "100%",
                  flexDirection: "row",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Checkbox
                checked={autoConnect}
                onChange={() => setAutoConnect(!autoConnect)}
                disabled={scanState !== "idle"}
              >
                <CheckboxLabel style={[styles.actionLabel]}>
                  Auto-connect
                </CheckboxLabel>
              </Checkbox>
            </View>
          </View>
          <View style={[styles.actions]}>
            <View
              style={[
                styles.actionButton,
                { height: "100%", flex: 3, padding: 0 },
              ]}
            >
              <RoomPicker
                compact
                disabled={scanState !== "idle"}
                style={[
                  {
                    backgroundColor: colors.default.tint.translucid[100],
                    borderRadius: 4,
                    borderWidth: 1,
                    height: "100%",
                  },
                ]}
                textStyle={[
                  {
                    fontSize: 10,
                    color: colors.default.white[100],
                    fontFamily: fonts.interMedium,
                    paddingTop: 0,
                  },
                ]}
                chevronColor={colors.default.white[100]}
              />
            </View>
            <View
              style={[
                styles.actionButton,
                {
                  backgroundColor:
                    bleState === State.PoweredOn
                      ? isLight
                        ? colors.default.tint.translucid[400]
                        : colors.default.tint.translucid[100]
                      : "transparent",
                  borderTopRightRadius: 24,
                  borderBottomRightRadius: 24,
                  justifyContent: "center",
                },
              ]}
            >
              <IonIcons
                name="bluetooth"
                size={16}
                color={colors.default.white[100]}
              />
              <Text
                style={[
                  styles.actionLabel,
                  { color: colors.default.white[100] },
                ]}
                numberOfLines={1}
              >
                {btState}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

interface ScanWaveProps {
  progress: Animated.SharedValue<number>;
}

const ScanWave: FC<ScanWaveProps> = ({ progress }) => {
  const window = useWindowDimensions();
  const padding = 4;

  const circle = Skia.Path.Make();
  circle.addCircle((window.width - 2 * padding) / 2, 8, 40);

  const pathSource = circle.computeTightBounds();
  const pathDest = rect(0, -40, window.width - 2 * padding, 96);

  const transform = useDerivedValue(() => {
    return [{ scale: mix(progress.value, 0.85, 6) }];
  });
  const blur = useDerivedValue(() => mix(progress.value, 3, 5));
  const strokeWidth = useDerivedValue(() => mix(progress.value, 8, 1));

  return (
    <Group
      transform={transform}
      origin={{ x: (window.width - 2 * padding) / 2, y: 8 }}
    >
      <Group transform={fitbox("contain", pathSource, pathDest)}>
        <Path
          path={circle}
          style="stroke"
          color={colors.default.tint[400]}
          strokeWidth={strokeWidth}
        >
          <Blur blur={blur} />
        </Path>
      </Group>
    </Group>
  );
};

interface PibleButtonProps {
  progress: Animated.SharedValue<number>;
}

const PibleButton: FC<PibleButtonProps> = ({ progress }) => {
  const startScan = useStore((state) => state.scan);

  const border = useDerivedValue(() =>
    interpolateColor(
      progress.value,
      [0, 1],
      [colors.default.white[100], colors.default.tint[200]]
    )
  );

  const containerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.default.tint.translucid[200], colors.default.tint.translucid[700]]
    );

    return { backgroundColor, borderColor: border.value };
  });

  return (
    <Pressable onPress={startScan} style={[styles.scanButtonWrapper]}>
      <Animated.View
        style={[
          styles.scanButton,
          { borderWidth: 2, borderColor: colors.default.white[100] },
          containerStyle,
        ]}
      >
        <BlurView
          intensity={24}
          tint="dark"
          style={[
            styles.blur,
            {
              borderRadius: 9999,
              borderWidth: 0,
              backgroundColor: colors.default.white.translucid[100],
            },
          ]}
        />
        <Image
          source={accessLogo}
          alt="CSI PRO ACCESS Logo"
          style={[{ width: "100%", aspectRatio: 1 }]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: "100%",
    gap: 12,
    paddingHorizontal: 4,
    zIndex: 10,
  },
  container: {
    backgroundColor: colors.default.tint.translucid[200],
    padding: 8,
    borderRadius: 32,
    height: 64,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    alignItems: "center",
    padding: 8,
    borderWidth: 2,
    borderRadius: 32,
    borderColor: colors.default.tint[400],
  },
  scanButtonWrapper: {
    position: "absolute",
    zIndex: 20,
    top: -40,
    borderRadius: 9999,
    width: 96,
  },
  scanButton: {
    backgroundColor: colors.default.tint.translucid[200],
    borderRadius: 9999,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 96,
    aspectRatio: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    gap: 104,
  },
  actions: {
    flexDirection: "row",
    flex: 1,
    gap: 4,
  },
  actionButton: {
    height: "100%",
    flex: 1,
    padding: 4,
    borderRadius: 4,
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionLabel: {
    fontFamily: fonts.inter,
    fontSize: 10,
    color: "#fff",
  },
  label: {
    fontFamily: fonts.inter,
    fontSize: 20,
    color: "#fff",
  },
  stateLabel: {
    fontFamily: fonts.interMedium,
    fontSize: 14,
    color: "#fff",
  },
  scanStateContainer: {
    borderWidth: 1,
    borderColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    maxHeight: 32,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxHeight: 48,
    padding: 8,
  },
  scanControlButton: {
    gap: 4,
    flexDirection: "row",
    borderRadius: 4,
    backgroundColor: "#fff",
    padding: 4,
    paddingRight: 6,
    height: "100%",
    maxHeight: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyList: {
    alignItems: "center",
    justifyContent: "center",
  },
});
