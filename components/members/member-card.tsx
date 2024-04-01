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

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  kickable?: boolean;
  doc: DocumentReference<DocumentData>;
}

export const MemberCard: FC<Props> = ({
  kickable = false,
  open,
  onClose,
  children,
  doc,
}) => {
  const [openKickModal, setOpenKickModal] = useState(false);

  const closeKickModal = () => setOpenKickModal(false);

  const handleKick = async () => {
    try {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to kick a member",
        cancelLabel: "Cancel",
      });

      if (!auth.success) {
        closeKickModal();
        return;
      }

      await deleteDoc(doc);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal visible={open} onClose={onClose}>
        <ModalHeader>Member Details</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          {kickable && (
            <TextButton
              variant="secondary"
              onPress={() => setOpenKickModal(true)}
            >
              Kick
            </TextButton>
          )}
          <TextButton onPress={onClose}>Okay</TextButton>
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
  canSetRoles?: boolean;
  roleDoc?: DocumentReference<DocumentData>;
  roleData?: UserRoomRole;
}

export const MemberCardRole: FC<MemberCardRoleProps> = ({
  children,
  canSetRoles = false,
  roleDoc: memberRoleDoc,
  roleData: memberRoleData,
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
      {canSetRoles && (
        <>
          <TextButton
            onPress={() => setOpenPicker(true)}
            textStyle={[{ fontSize: 14 }]}
          >
            Change
          </TextButton>
          <RolePicker
            open={openPicker}
            onClose={handleClosePicker}
            currentDoc={memberRoleDoc}
            currentData={memberRoleData}
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
        {authorized ? "Authorized" : "Unauthorized"}
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
      <ModalHeader>Kick member</ModalHeader>
      <ModalBody>
        <Text style={[styles.text, { color: textColor }]}>
          Are you sure you want to kick this member?
        </Text>
      </ModalBody>
      <ModalFooter>
        <TextButton variant="secondary" onPress={onKick}>
          Kick
        </TextButton>
        <TextButton onPress={onClose}>Cancel</TextButton>
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
