import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useUser } from "reactfire";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { Image } from "expo-image";
import {
  AccessUser,
  useNestUser,
  useUserData,
} from "../../hooks/use-user-data";
import { IonIcon } from "../icons/ion";
import { MaterialIcon } from "../icons/material";
import { FAIcon } from "../icons/font-awesome";
import format from "date-fns/format";
import { formatBirthday, formatUserName } from "@/lib/utils";

const googleLogo = require("@/assets/auth/google-g.png");
const githubLogo = require("@/assets/auth/github-mark.png");
const githubLogoWhite = require("@/assets/auth/github-mark-white.png");

export const ProfileCard = () => {
  const colorScheme = useColorScheme();
  const { status: authUserStatus, data: authUserData } = useUser();
  const { status: userDataStatus, data: userData } = useNestUser();

  const isLight = colorScheme === "light";

  if (authUserStatus === "loading" || userDataStatus === "loading") {
    return (
      <View
        style={[
          styles.card,
          styles.centered,
          {
            backgroundColor: isLight
              ? colors.default.white[100]
              : colors.default.black[300],
            height: 200,
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.default.tint[400]} />
      </View>
    );
  }

  if (authUserStatus === "error" || userDataStatus === "error") {
    return (
      <View
        style={[
          styles.card,
          styles.centered,
          {
            backgroundColor: isLight
              ? colors.default.white[100]
              : colors.default.black[300],
          },
        ]}
      >
        <Text
          style={[
            styles.errorLabel,
            {
              color: isLight
                ? colors.default.secondary[400]
                : colors.default.secondary[200],
            },
          ]}
        >
          No fue posible conectar con el servidor
        </Text>
      </View>
    );
  }

  const hasGoogle = authUserData.providerData.some(
    (provider) => provider.providerId === "google.com"
  );
  const hasGithub = authUserData.providerData.some(
    (provider) => provider.providerId === "github.com"
  );

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
        <View style={[styles.row]}>
          <View
            style={[
              styles.photoContainer,
              {
                borderColor: isLight
                  ? colors.default.tint[300]
                  : colors.default.tint[100],
              },
            ]}
          >
            <Image source={authUserData.photoURL} style={[styles.photo]} />
          </View>
          <View style={[{}]}>
            <Text
              numberOfLines={1}
              style={[
                styles.header,
                {
                  color: isLight
                    ? colors.default.black[400]
                    : colors.default.white[100],
                },
              ]}
            >
              {formatUserName(userData)}
            </Text>
            <Text
              style={[
                styles.textBase,
                {
                  color: isLight
                    ? colors.default.tint.translucid[700]
                    : colors.default.gray[600],
                },
              ]}
            >
              {userData.unisonId}
            </Text>
          </View>
        </View>
        <View style={[styles.row]}>
          <View style={[styles.iconWrapper]}>
            <IonIcon
              name="person"
              color={
                isLight ? colors.default.tint[300] : colors.default.tint[100]
              }
              size={24}
            />
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.textBase,
              {
                color: isLight
                  ? colors.default.black[400]
                  : colors.default.white[300],
              },
            ]}
          >
            {userData.csiId}
            {" \u2022 "}
            <Text
              style={[
                {
                  color: isLight
                    ? colors.default.tint.translucid[700]
                    : colors.default.gray[600],
                },
              ]}
            >
              CSI ID
            </Text>
          </Text>
        </View>
        <View style={[styles.row]}>
          <View style={[styles.iconWrapper]}>
            <IonIcon
              name="mail"
              color={
                isLight ? colors.default.tint[300] : colors.default.tint[100]
              }
              size={24}
            />
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.textBase,
              {
                color: isLight
                  ? colors.default.black[400]
                  : colors.default.white[300],
              },
            ]}
          >
            {authUserData.email}
          </Text>
        </View>
        <View style={[styles.row]}>
          <View style={[styles.iconWrapper]}>
            <FAIcon
              name="birthday-cake"
              color={
                isLight ? colors.default.tint[300] : colors.default.tint[100]
              }
              size={24}
            />
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.textBase,
              {
                color: isLight
                  ? colors.default.black[400]
                  : colors.default.white[300],
              },
            ]}
          >
            {formatBirthday(userData.dateOfBirth)}
          </Text>
        </View>
        <View style={[styles.row]}>
          <View style={[styles.iconWrapper]}>
            <IonIcon
              name="at-circle"
              color={
                isLight ? colors.default.tint[300] : colors.default.tint[100]
              }
              size={24}
            />
          </View>
          {hasGoogle && (
            <Image
              source={googleLogo}
              style={[{ width: 24, aspectRatio: 1 }]}
            />
          )}
          {hasGithub && (
            <Image
              source={isLight ? githubLogo : githubLogoWhite}
              style={[{ width: 24, aspectRatio: 1 }]}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 8,
    padding: 8,
    gap: 12,
  },
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  column: {
    flexDirection: "column",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  photoContainer: {
    width: 80,
    aspectRatio: 1,
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 2,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  errorLabel: {
    fontFamily: fonts.interLight,
    fontSize: 16,
    textAlign: "center",
  },
  textBase: {
    fontFamily: fonts.inter,
    fontSize: 16,
  },
  header: {
    fontFamily: fonts.interMedium,
    fontSize: 24,
  },
  iconWrapper: {
    minWidth: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
