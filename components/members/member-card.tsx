import * as LocalAuthentication from "expo-local-authentication";
import { FC, ReactNode, useState } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { DocumentData, DocumentReference, deleteDoc } from "firebase/firestore";

import { IonIcon } from "../icons/ion";
import { MaterialIcon } from "../icons/material";
import { FAIcon } from "../icons/font-awesome";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../modal/modal";
import { RolePicker } from "../role-picker/role-picker";
import { TextButton } from "../ui/text-button";

import { UserRoomRole } from "@/hooks/use-user-data";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useMemberActions } from "@/hooks/use-room-members";

interface Props {
  memberId: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  kickable?: boolean;
}

export const MemberCard: FC<Props> = ({
  kickable = false,
  memberId,
  open,
  onClose,
  children,
}) => {
  const [openKickModal, setOpenKickModal] = useState(false);
  const { kickMember } = useMemberActions(memberId);

  const closeKickModal = () => setOpenKickModal(false);

  const handleKick = async () => {
    try {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirma tu identidad para continuar",
        cancelLabel: "Cancelar",
      });
      if (!auth.success) {
        closeKickModal();
        return;
      }

      kickMember.mutate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal visible={open} onClose={onClose}>
        <ModalHeader>Detalles de usuario</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          {kickable && (
            <TextButton
              variant="secondary"
              onPress={() => setOpenKickModal(true)}
            >
              Expulsar
            </TextButton>
          )}
          <TextButton onPress={onClose}>Cerrar</TextButton>
        </ModalFooter>
      </Modal>
      <KickModal
        open={openKickModal}
        onClose={closeKickModal}
        onKick={handleKick}
      />
    </>
  );
};

export const MemberCardName: FC<{ children: ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const textColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];
  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  return (
    <View style={[styles.dataRow]}>
      <View style={[styles.iconWrapper]}>
        <IonIcon name="person" color={iconColor} size={24} />
      </View>
      <Text style={[styles.text, { color: textColor }]}>{children}</Text>
    </View>
  );
};

export const MemberCardUniSonId: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const textColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];
  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  return (
    <View style={[styles.dataRow]}>
      <View style={[styles.iconWrapper]}>
        <MaterialIcon name="badge" color={iconColor} size={24} />
      </View>
      <Text style={[styles.text, { color: textColor }]}>{children}</Text>
    </View>
  );
};

export const MemberCardBirthday: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const textColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];
  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  return (
    <View style={[styles.dataRow]}>
      <View style={[styles.iconWrapper]}>
        <FAIcon name="birthday-cake" color={iconColor} size={24} />
      </View>
      <Text style={[styles.text, { color: textColor }]}>{children}</Text>
    </View>
  );
};

interface MemberCardRoleProps {
  children: ReactNode;
  canManageRoles?: boolean;
  userId: string;
  roleId: string;
}

export const MemberCardRole: FC<MemberCardRoleProps> = ({
  children,
  canManageRoles = false,
  userId,
  roleId,
}) => {
  const [openPicker, setOpenPicker] = useState(false);

  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const handleClosePicker = () => setOpenPicker(false);

  const textColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];
  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  return (
    <View style={[styles.dataRow]}>
      <View style={[styles.iconWrapper]}>
        <MaterialIcon name="grade" color={iconColor} size={24} />
      </View>
      <Text style={[styles.text, { color: textColor }]}>{children}</Text>
      {canManageRoles && (
        <>
          <TextButton
            onPress={() => setOpenPicker(true)}
            style={[{ paddingVertical: 0 }]}
            textStyle={[{ fontSize: 12 }]}
          >
            Cambiar
          </TextButton>
          <RolePicker
            open={openPicker}
            onClose={handleClosePicker}
            roleId={roleId}
            userId={userId}
          />
        </>
      )}
    </View>
  );
};

export const MemberCardAuthorized: FC<{ authorized: boolean }> = ({
  authorized,
}) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const textColor = isLight
    ? authorized
      ? colors.default.tint[400]
      : colors.default.secondary[400]
    : authorized
    ? colors.default.tint[200]
    : colors.default.secondary[100];
  const iconColor = isLight
    ? authorized
      ? colors.default.tint[400]
      : colors.default.secondary[400]
    : authorized
    ? colors.default.tint[200]
    : colors.default.secondary[100];

  return (
    <View style={[styles.dataRow]}>
      <View style={[styles.iconWrapper]}>
        <IonIcon name="log-in" color={iconColor} size={24} />
      </View>
      <Text
        style={[
          styles.text,
          {
            color: textColor,
          },
        ]}
      >
        {authorized ? "Autorizado" : "No autorizado"}
      </Text>
    </View>
  );
};

interface KickModalProps {
  open: boolean;
  onClose: () => void;
  onKick: () => void;
}

const KickModal: FC<KickModalProps> = ({ open, onClose, onKick }) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const textColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];

  return (
    <Modal visible={open} onClose={onClose}>
      <ModalHeader>Expulsar miembro</ModalHeader>
      <ModalBody>
        <Text style={[styles.text, { color: textColor }]}>
          ¿Seguro de que quieres expulsar a este usuario?
        </Text>
      </ModalBody>
      <ModalFooter>
        <TextButton variant="secondary" onPress={onKick}>
          Expulsar
        </TextButton>
        <TextButton onPress={onClose}>Cancelar</TextButton>
      </ModalFooter>
    </Modal>
  );
};

const styles = StyleSheet.create({
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrapper: {
    minWidth: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: fonts.inter,
    fontSize: 16,
  },
  requestStatus: {
    textTransform: "capitalize",
  },
  textButton: {
    padding: 8,
    borderRadius: 8,
  },
});
