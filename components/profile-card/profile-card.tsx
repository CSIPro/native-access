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
import { AccessUser, useUserData } from "../../hooks/use-user-data";
import { IonIcon } from "../icons/ion";
import { MaterialIcon } from "../icons/material";
import { FAIcon } from "../icons/font-awesome";
import format from "date-fns/format";

const googleLogo = require("@/assets/auth/google-g.png");
const githubLogo = require("@/assets/auth/github-mark.png");

export const ProfileCard = () => {
  const colorScheme = useColorScheme();
  const { status: authUserStatus, data: authUserData } = useUser();
  const { status: userDataStatus, data: userData } = useUserData();

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
          Something went wrong while retrieving data
        </Text>
      </View>
    );
  }

  const userAccessData = userData as AccessUser;
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
          <View style={[{ gap: -8 }]}>
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
              {userAccessData.name}
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
              {userAccessData.unisonId}
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
            {userAccessData.csiId}
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
            {format(userAccessData.dateOfBirth.toDate(), "MMMM dd")}
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
              source={githubLogo}
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
    gap: 8,
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
    fontFamily: fonts.poppinsLight,
    fontSize: 16,
    textAlign: "center",
  },
  textBase: {
    fontFamily: fonts.poppins,
    fontSize: 16,
  },
  header: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 24,
  },
  iconWrapper: {
    minWidth: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
