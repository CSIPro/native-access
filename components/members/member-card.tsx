import { FC, ReactNode, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "../modal/modal";
import fonts from "../../constants/fonts";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import colors from "../../constants/colors";
import { IonIcon } from "../icons/ion";
import { MaterialIcon } from "../icons/material";
import { FAIcon } from "../icons/font-awesome";
import { RolePicker } from "../role-picker/role-picker";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { UserRoomRole } from "../../hooks/use-user-data";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const MemberCard: FC<Props> = ({ open, onClose, children }) => {
  return (
    <Modal visible={open} onClose={onClose}>
      <ModalHeader>Member Details</ModalHeader>
      <ModalBody>{children}</ModalBody>
    </Modal>
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

  const buttonBg = isLight
    ? colors.default.tint.translucid[100]
    : colors.default.tint.translucid[100];
  const buttonText = isLight
    ? colors.default.tint[400]
    : colors.default.tint[100];

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
          <Pressable
            onPress={() => setOpenPicker(true)}
            style={[styles.textButton, { backgroundColor: buttonBg }]}
          >
            <Text style={[styles.text, { fontSize: 14, color: buttonText }]}>
              Change
            </Text>
          </Pressable>
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
    paddingTop: 4,
    fontFamily: fonts.poppins,
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
