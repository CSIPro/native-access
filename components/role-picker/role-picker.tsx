import { FC, ReactNode, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../modal/modal";
import { DocumentData, DocumentReference, updateDoc } from "firebase/firestore";
import { UserRoomRole } from "../../hooks/use-user-data";
import { Role, useRoles } from "../../hooks/use-roles";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import fonts from "../../constants/fonts";
import colors from "../../constants/colors";

interface Props {
  open: boolean;
  onClose: () => void;
  currentDoc: DocumentReference<DocumentData>;
  currentData: UserRoomRole;
}

export const RolePicker: FC<Props> = ({
  open,
  onClose,
  currentDoc: doc,
  currentData: data,
}) => {
  const [selectedRole, setSelectedRole] = useState(data.roleId);
  const { data: roles } = useRoles();

  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const submitBg = isLight
    ? colors.default.tint.translucid[100]
    : colors.default.tint.translucid[100];
  const submitText = isLight
    ? colors.default.tint[400]
    : colors.default.tint[100];

  const cancelBg = isLight
    ? colors.default.secondary.translucid[100]
    : colors.default.secondary.translucid[100];
  const cancelText = isLight
    ? colors.default.secondary[400]
    : colors.default.secondary[100];

  const handleSubmit = async () => {
    try {
      await updateDoc(doc, { roleId: selectedRole });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal visible={open} onClose={onClose}>
      <ModalHeader>Update role</ModalHeader>
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
        <Pressable
          onPress={handleSubmit}
          style={[styles.textButton, { backgroundColor: submitBg }]}
        >
          <Text style={[styles.text, { color: submitText }]}>Submit</Text>
        </Pressable>
        <Pressable
          onPress={onClose}
          style={[styles.textButton, { backgroundColor: cancelBg }]}
        >
          <Text style={[styles.text, { color: cancelText }]}>Cancel</Text>
        </Pressable>
      </ModalFooter>
    </Modal>
  );
};

interface RoleItemProps {
  role: Role;
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
