import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { NestRoom } from "@/hooks/use-rooms";
import { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import {
  RequestStatusEnum,
  useNestRequestHelpers,
  useUserRequests,
} from "@/hooks/use-requests";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../modal/modal";
import { router } from "expo-router";
import { TextButton } from "../ui/text-button";
import { formatRoomName } from "@/lib/utils";
import { BrandingHeaderHighlight } from "../ui/branding-header";

type DialogContent = {
  title: string;
  message: string;
  status: "error" | "success";
};

interface Props {
  room: NestRoom;
  isAvailable?: boolean;
}

export const RoomItem: FC<Props> = ({ room, isAvailable = false }) => {
  const [dialogContent, setDialogContent] = useState<DialogContent>();

  const { status: requestsStatus, data: userRequests } = useUserRequests();
  const { createRequest } = useNestRequestHelpers();

  useEffect(() => {
    switch (createRequest.status) {
      case "success":
        setDialogContent({
          title: "Request sent",
          message: "Your request has been sent successfully",
          status: "success",
        });
        break;

      case "error":
        setDialogContent({
          title: "Request error",
          message:
            createRequest.error instanceof Error
              ? createRequest.error.message
              : "An unexpected error occurred",
          status: "error",
        });
        break;
    }
  }, [createRequest.status, createRequest.error, setDialogContent]);

  const isLight = useColorScheme() === "light";

  const startColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[400];

  const defaultText = isLight
    ? colors.default.black[400]
    : colors.default.white[100];

  const canRequest =
    (isAvailable &&
      !userRequests?.some(
        (req) =>
          req.roomId === room.id &&
          req.status === RequestStatusEnum.enum.pending
      )) ??
    false;

  return (
    <>
      <View style={[styles.wrapper]}>
        <Text numberOfLines={1} style={[styles.text]}>
          {formatRoomName(room)}
        </Text>
        <View style={[styles.actionWrapper]}>
          {requestsStatus === "loading" ||
          createRequest.status === "loading" ? (
            <ActivityIndicator
              size="small"
              color={isLight ? startColor : colors.default.tint[200]}
            />
          ) : canRequest ? (
            <Pressable onPress={() => createRequest.mutate(room.id)}>
              <BrandingHeaderHighlight textStyle={[{ fontSize: 12 }]}>
                Request
              </BrandingHeaderHighlight>
            </Pressable>
          ) : (
            <BrandingHeaderHighlight textStyle={[{ fontSize: 12 }]}>
              Joined
            </BrandingHeaderHighlight>
          )}
        </View>
      </View>
      <Modal visible={!!dialogContent} onClose={() => setDialogContent(null)}>
        <ModalHeader>{dialogContent?.title}</ModalHeader>
        <ModalBody>
          <Text style={[styles.text, { color: defaultText }]}>
            {dialogContent?.message}
          </Text>
        </ModalBody>
        <ModalFooter>
          {dialogContent?.status === "success" && (
            <TextButton
              onPress={() => {
                setDialogContent(null);
                router.push("/(app)/profile/requests");
              }}
            >
              Go to Requests
            </TextButton>
          )}
          <TextButton
            variant={
              dialogContent?.status === "success" ? "secondary" : "default"
            }
            onPress={() => setDialogContent(null)}
          >
            OK
          </TextButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    backgroundColor: colors.default.tint.translucid[200],
    borderWidth: 2,
    borderColor: colors.default.tint[300],
  },
  text: {
    fontFamily: fonts.interMedium,
    fontSize: 16,
    color: colors.default.white[100],
  },
  actionWrapper: {
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});
