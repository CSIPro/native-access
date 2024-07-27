import * as LocalAuthentication from "expo-local-authentication";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { FC, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";

import { Modal, ModalBody, ModalFooter, ModalHeader } from "../modal/modal";
import { TextButton } from "../ui/text-button";

import { NestRole, useNestRoles } from "@/hooks/use-roles";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useMemberActions } from "@/hooks/use-room-members";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  roleId: string;
}

export const RolePicker: FC<Props> = ({ open, onClose, userId, roleId }) => {
  const [selectedRole, setSelectedRole] = useState(roleId);
  const { data: roles } = useNestRoles();
  const { roleUpdate } = useMemberActions(userId);

  const handleSubmit = async () => {
    try {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirm your identity",
      });

      if (!auth.success) return;

      roleUpdate.mutate(selectedRole);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal visible={open} onClose={onClose}>
      <ModalHeader>Cambiar rol</ModalHeader>
      <ModalBody>
        <FlatList
          data={roles}
          keyExtractor={(item) => item.id}
          renderItem={({ item: role }) => (
            <RoleItem
              role={role}
              selected={role.id === selectedRole}
              onPress={setSelectedRole}
            />
          )}
        />
      </ModalBody>
      <ModalFooter>
        <TextButton variant="secondary" onPress={onClose}>
          Cancelar
        </TextButton>
        <TextButton onPress={handleSubmit}>Confirmar</TextButton>
      </ModalFooter>
    </Modal>
  );
};

interface RoleItemProps {
  role: NestRole;
  onPress: (roleId: string) => void;
  selected: boolean;
}

const RoleItem: FC<RoleItemProps> = ({ role, onPress, selected }) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const bgColor = isLight
    ? selected
      ? colors.default.tint.translucid[300]
      : "transparent"
    : selected
    ? colors.default.tint.translucid[200]
    : "transparent";

  const textColor = isLight
    ? selected
      ? colors.default.tint[400]
      : colors.default.black[400]
    : selected
    ? colors.default.tint[100]
    : colors.default.white[100];

  return (
    <Pressable
      onPress={() => onPress(role.id)}
      style={[styles.roleItem, { backgroundColor: bgColor }]}
    >
      <Text style={[styles.text, { color: textColor }]}>{role.name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  roleItem: {
    width: "100%",
    padding: 8,
    borderRadius: 8,
  },
  text: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 16,
    paddingTop: 4,
  },
  textButton: {
    padding: 8,
    borderRadius: 8,
  },
});
