import { FC, ReactNode } from "react";
import { RequestStatusEnum } from "../../hooks/use-requests";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../modal/modal";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { IonIcon } from "../icons/ion";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { MaterialIcon } from "../icons/material";
import { useUserData } from "../../hooks/use-user-data";
import { useRoles } from "../../hooks/use-roles";

interface Props {
  isPending?: boolean;
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  children: ReactNode;
}

export const RequestDetails: FC<Props> = ({
  children,
  open,
  isPending = false,
  onClose,
  onApprove,
  onReject,
}) => {
  const { data: userData } = useUserData();
  const { data: roles } = useRoles();

  const canHandleRequests =
    roles?.find((role) => role.id === userData?.role?.roleId)
      ?.canHandleRequests || userData.isRoot;

  return (
    <Modal visible={open} onClose={onClose}>
      <ModalHeader>Request Details</ModalHeader>
      <ModalBody>{children}</ModalBody>
      {isPending && canHandleRequests && (
        <ModalFooter>
          <Pressable style={[styles.textButton]} onPress={onApprove}>
            <Text style={[styles.text, { color: colors.default.tint[400] }]}>
              Approve
            </Text>
          </Pressable>
          <Pressable style={[styles.textButton]} onPress={onReject}>
            <Text
              style={[styles.text, { color: colors.default.secondary[400] }]}
            >
              Reject
            </Text>
          </Pressable>
        </ModalFooter>
      )}
    </Modal>
  );
};

export const RequestDetailsUser: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  return (
    <View style={[styles.dataRow]}>
      <IonIcon
        name="person"
        color={isLight ? colors.default.tint[400] : colors.default.tint[200]}
        size={24}
      />
      <Text style={[styles.text]}>{children}</Text>
    </View>
  );
};

export const RequestDetailsRoom: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  return (
    <View style={[styles.dataRow]}>
      <IonIcon
        name="location"
        color={isLight ? colors.default.tint[400] : colors.default.tint[200]}
        size={24}
      />
      <Text style={[styles.text]}>{children}</Text>
    </View>
  );
};

export const RequestDetailsAdmin: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  return (
    <View style={[styles.dataRow]}>
      <MaterialIcon
        name="local-police"
        color={isLight ? colors.default.tint[400] : colors.default.tint[200]}
        size={24}
      />
      <Text style={[styles.text]}>{children}</Text>
    </View>
  );
};

export const RequestDetailsStatus: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  return (
    <View style={[styles.dataRow]}>
      <IonIcon
        name="ellipsis-horizontal"
        color={isLight ? colors.default.tint[400] : colors.default.tint[200]}
        size={24}
      />
      <Text style={[styles.text, styles.requestStatus]}>{children}</Text>
    </View>
  );
};

export const RequestDetailsDate: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  return (
    <View style={[styles.dataRow]}>
      <IonIcon
        name="calendar"
        color={isLight ? colors.default.tint[400] : colors.default.tint[200]}
        size={24}
      />
      <Text style={[styles.text]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  },
});
