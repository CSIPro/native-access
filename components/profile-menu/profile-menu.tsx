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

export const ProfileMenu = () => {
  const colorScheme = useColorScheme();

  const isLight = colorScheme === "light";

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
        <MenuItem href="/(app)/profile/requests">Your requests</MenuItem>
        <MenuItem href="/(app)/profile/rooms">Your rooms</MenuItem>
        <MenuItem href="/(app)/profile/passcode">Your passcode</MenuItem>
        <MenuItem href="/(app)/profile/send-notification">
          Send notification
        </MenuItem>
      </View>
    </View>
  );
};

const MenuItem: FC<LinkProps> = ({ href, children }) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  return (
    <Link href={href} asChild>
      <Pressable>
        <View
          style={[
            styles.linkWrapper,
            {
              backgroundColor: isLight
                ? colors.default.tint.translucid[200]
                : colors.default.tint.translucid[100],
            },
          ]}
        >
          <Text
            style={[
              styles.text,
              styles.link,
              {
                color: isLight
                  ? colors.default.tint[400]
                  : colors.default.tint[100],
              },
            ]}
          >
            {children}
          </Text>
        </View>
      </Pressable>
    </Link>
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
