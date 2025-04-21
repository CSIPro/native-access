import { Link } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { FC, ReactNode } from "react";
import { LinkProps } from "expo-router/build/link/Link";
import { useUserContext } from "@/context/user-context";
import { useMemberships } from "@/hooks/use-membership";
import { IonIcon } from "../icons/ion";
import { MaterialIcon } from "../icons/material";
import { FAIcon } from "../icons/font-awesome";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const ProfileMenu = () => {
  const colorScheme = useColorScheme();

  const { user } = useUserContext();
  const { status, data } = useMemberships(user.id);

  const isLight = colorScheme === "light";

  const canSendNotifications =
    user.isRoot || data?.some((membership) => membership.role.level >= 50);

  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[100];

  return (
    <View style={[styles.cardShadow]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: isLight
              ? colors.default.white[100]
              : colors.default.black[300],
          },
        ]}
      >
        <MenuItem href="/(app)/profile/requests">
          <MenuItemIcon>
            <FAIcon name="wpforms" color={iconColor} size={24} />
          </MenuItemIcon>
          <MenuItemLabel>Tus solicitudes</MenuItemLabel>
        </MenuItem>
        <MenuItem href="/(app)/profile/rooms">
          <MenuItemIcon>
            <MaterialIcon name="room" color={iconColor} size={24} />
          </MenuItemIcon>
          <MenuItemLabel>Tus salones</MenuItemLabel>
        </MenuItem>
        <MenuItem href="/(app)/profile/passcode">
          <MenuItemIcon>
            <IonIcon name="code-working" color={iconColor} size={24} />
          </MenuItemIcon>
          <MenuItemLabel>Código de acceso</MenuItemLabel>
        </MenuItem>
        <MenuItem href="/(app)/profile/qrcode">
          <MenuItemIcon>
            <IonIcon name="qr-code" color={iconColor} size={24} />
          </MenuItemIcon>
          <MenuItemLabel>Código QR</MenuItemLabel>
        </MenuItem>
        <MenuItem href="/(app)/profile/edit-profile">
          <MenuItemIcon>
            <IonIcon name="pencil" color={iconColor} size={24} />
          </MenuItemIcon>
          <MenuItemLabel>Editar perfil</MenuItemLabel>
        </MenuItem>
        {status === "success" && canSendNotifications && (
          <MenuItem href="/(app)/profile/send-notification">
            <MenuItemIcon>
              <IonIcon name="notifications" color={iconColor} size={24} />
            </MenuItemIcon>
            <MenuItemLabel>Notificaciones</MenuItemLabel>
          </MenuItem>
        )}
      </View>
    </View>
  );
};

const MenuItem: FC<LinkProps> = ({ href, children }) => {
  const sv = useSharedValue(0);

  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const viewStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      sv.value,
      [0, 1],
      [
        isLight
          ? colors.default.tint.translucid[200]
          : colors.default.tint.translucid[100],
        isLight
          ? colors.default.tint.translucid[300]
          : colors.default.tint.translucid[200],
      ]
    );

    return { backgroundColor };
  });

  const onPressIn = () => {
    sv.value = withTiming(1, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const onPressOut = () => {
    sv.value = withTiming(0, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
  };

  return (
    <Link href={href} asChild>
      <Pressable>
        <Animated.View
          style={[styles.linkWrapper, viewStyles]}
          onTouchStart={onPressIn}
          onTouchEnd={onPressOut}
        >
          {children}
        </Animated.View>
      </Pressable>
    </Link>
  );
};

const MenuItemIcon = ({ children }: { children: ReactNode }) => {
  const isLight = useColorScheme() === "light";

  return (
    <View
      style={[
        styles.iconWrapper,
        {
          backgroundColor: isLight
            ? colors.default.tint.translucid[200]
            : colors.default.black.translucid[200],
        },
      ]}
    >
      {children}
    </View>
  );
};

const MenuItemLabel = ({ children }: { children: ReactNode }) => {
  const isLight = useColorScheme() === "light";

  return (
    <Text
      style={[
        styles.text,
        styles.link,
        {
          color: isLight ? colors.default.tint[400] : colors.default.tint[100],
        },
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    backgroundColor: "transparent",
    borderRadius: 8,
    shadowColor: "#222222",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 6,
  },
  card: {
    width: "100%",
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  linkWrapper: {
    padding: 8,
    borderRadius: 8,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrapper: {
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    padding: 4,
  },
  text: {
    paddingTop: 4,
    fontFamily: fonts.poppins,
    fontSize: 16,
  },
  link: {
    fontFamily: fonts.poppinsMedium,
  },
});
