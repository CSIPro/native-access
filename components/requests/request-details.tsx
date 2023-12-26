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
import { useStoreRoles, useStoreUser } from "../../store/store";

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
  const colorScheme = useColorScheme();
  // const { data: userData } = useUserData();
  // const { data: roles } = useRoles();
  const userData = useStoreUser();
  const roles = useStoreRoles();

  const isLight = colorScheme === "light";

  const canHandleRequests =
    roles?.find((role) => role.id === userData?.role?.roleId)
      ?.canHandleRequests || userData.isRoot;

  const approveBg = isLight
    ? colors.default.tint.translucid[100]
    : colors.default.tint.translucid[100];
  const approveText = isLight
    ? colors.default.tint[400]
    : colors.default.tint[100];

  const rejectBg = isLight
    ? colors.default.secondary.translucid[100]
    : colors.default.secondary.translucid[100];
  const rejectText = isLight
    ? colors.default.secondary[400]
    : colors.default.secondary[100];

  return (
    <Modal visible={open} onClose={onClose}>
      <ModalHeader>Request Details</ModalHeader>
      <ModalBody>{children}</ModalBody>
      {isPending && canHandleRequests && (
        <ModalFooter>
          <Pressable
            style={[
              styles.textButton,
              {
                backgroundColor: approveBg,
              },
            ]}
            onPress={onApprove}
          >
            <Text style={[styles.text, { color: approveText }]}>Approve</Text>
          </Pressable>
          <Pressable
            style={[
              styles.textButton,
              {
                backgroundColor: rejectBg,
              },
            ]}
            onPress={onReject}
          >
            <Text style={[styles.text, { color: rejectText }]}>Reject</Text>
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
  const textColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];

  return (
    <View style={[styles.dataRow]}>
      <IonIcon
        name="person"
        color={isLight ? colors.default.tint[400] : colors.default.tint[200]}
        size={24}
      />
      <Text style={[styles.text, { color: textColor }]}>{children}</Text>
    </View>
  );
};

export const RequestDetailsRoom: FC<{ children: ReactNode }> = ({
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
      <IonIcon name="location" color={iconColor} size={24} />
      <Text style={[styles.text, { color: textColor }]}>{children}</Text>
    </View>
  );
};

export const RequestDetailsAdmin: FC<{ children: ReactNode }> = ({
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
      <MaterialIcon name="local-police" color={iconColor} size={24} />
      <Text style={[styles.text, { color: textColor }]}>{children}</Text>
    </View>
  );
};

export const RequestDetailsStatus: FC<{ children: ReactNode }> = ({
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
      <IonIcon name="ellipsis-horizontal" color={iconColor} size={24} />
      <Text style={[styles.text, styles.requestStatus, { color: textColor }]}>
        {children}
      </Text>
    </View>
  );
};

export const RequestDetailsDate: FC<{ children: ReactNode }> = ({
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
      <IonIcon name="calendar" color={iconColor} size={24} />
      <Text style={[styles.text, { color: textColor }]}>{children}</Text>
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
    borderRadius: 8,
  },
});
