import Constants from "expo-constants";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { IonIcon } from "@/components/icons/ion";
import { ProfileCard } from "@/components/profile-card/profile-card";
import { ProfileMenu } from "@/components/profile-menu/profile-menu";
import { TextButton } from "@/components/ui/text-button";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { deleteAllFromStorage } from "@/lib/utils";
import { firebaseAuth } from "@/lib/firebase-config";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/modal/modal";

export default function Settings() {
  const [showModal, setShowModal] = useState(false);

  const auth = firebaseAuth;
  const colorScheme = useColorScheme();

  const isLight = colorScheme === "light";

  const handleSignOut = () => {
    setShowModal(true);
  };

  const cancelSignOut = () => setShowModal(false);

  const confirmSignOut = () => {
    setShowModal(false);
    deleteAllFromStorage();
    auth.signOut();
  };

  return (
    <ScrollView
      style={{
        padding: 8,
        backgroundColor: isLight
          ? colors.default.white[100]
          : colors.default.black[400],
      }}
    >
      <Stack.Screen
        options={{
          headerRight: (props) => {
            return (
              <Link
                {...props}
                href="/(app)/profile/settings"
                style={[{ padding: 4, paddingLeft: 8 }]}
              >
                <IonIcon
                  name="settings-outline"
                  size={24}
                  color={colors.default.white[100]}
                />
              </Link>
            );
          },
          headerShown: true,
          headerTitle: "Tu perfil",
          headerStyle: { backgroundColor: colors.default.tint[400] },
          headerTitleStyle: {
            fontFamily: fonts.poppinsMedium,
            color: colors.default.white[100],
          },
        }}
      />
      <View style={[{ flex: 1, gap: 8 }]}>
        <ProfileCard />
        <ProfileMenu />
        <View style={[{ width: "100%" }]}>
          <TextButton variant="secondary" onPress={handleSignOut}>
            Cerrar sesión
          </TextButton>
        </View>
        <Text
          style={[
            styles.text,
            {
              textAlign: "center",
              color: isLight
                ? colors.default.black.translucid[400]
                : colors.default.white.translucid[400],
            },
          ]}
        >{`${Constants.expoConfig.name} v${Constants.expoConfig.version}`}</Text>
      </View>
      <Modal visible={showModal} onClose={cancelSignOut}>
        <ModalHeader>Cerrar sesión</ModalHeader>
        <ModalBody>
          <Text
            style={[
              styles.text,
              {
                color: isLight
                  ? colors.default.black[400]
                  : colors.default.white[100],
              },
            ]}
          >
            ¿Seguro de que deseas cerrar sesión?
          </Text>
        </ModalBody>
        <ModalFooter>
          <TextButton variant="secondary" onPress={confirmSignOut}>
            Confirmar
          </TextButton>
          <TextButton onPress={cancelSignOut}>Cancelar</TextButton>
        </ModalFooter>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.inter,
    fontSize: 16,
  },
});
