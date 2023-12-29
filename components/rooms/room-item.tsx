import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Room } from "@/hooks/use-rooms";
import { LinearGradient } from "expo-linear-gradient";
import { FC, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { IonIcon } from "../icons/ion";
import { useMutation } from "react-query";
import {
  RequestStatusEnum,
  useRequestHelpers,
  useUserRequests,
} from "@/hooks/use-requests";
import { useUserContext } from "@/context/user-context";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../modal/modal";
import { router } from "expo-router";

type DialogContent = {
  title: string;
  message: string;
  status: "error" | "success";
};

interface Props {
  room: Room;
  isAvailable?: boolean;
}

export const RoomItem: FC<Props> = ({ room, isAvailable = false }) => {
  const [dialogContent, setDialogContent] = useState<DialogContent>();

  const { user } = useUserContext();
  const { status: requestsStatus, data: userRequests } = useUserRequests();
  const { createRequest } = useRequestHelpers();
  const mutation = useMutation({
    mutationFn: () => {
      if (
        userRequests.some(
          (req) =>
            req.roomId === room.id &&
            req.status === RequestStatusEnum.enum.pending
        )
      ) {
        throw new Error("You already have a pending request for this room");
      }

      return createRequest(room.id);
    },
    onError: (error) => {
      setDialogContent({
        title: "Error",
        message: error instanceof Error ? error.message : error.toString(),
        status: "error",
      });
    },
    onSuccess: () => {
      setDialogContent({
        title: "Request sent",
        message:
          "Your request has been sent; you can check its status on the Requests screen!",
        status: "success",
      });
    },
  });

  const isLight = useColorScheme() === "light";

  const startColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[400];

  const endColor = isLight
    ? colors.default.white[100]
    : colors.default.black[400];

  const defaultText = isLight
    ? colors.default.black[400]
    : colors.default.white[100];

  const primaryButtonBg = isLight
    ? colors.default.tint.translucid[100]
    : colors.default.tint.translucid[200];

  const secondaryButtonBg = isLight
    ? colors.default.secondary.translucid[100]
    : colors.default.secondary.translucid[200];

  const primaryButtonText = isLight
    ? colors.default.tint[400]
    : colors.default.tint[100];

  const secondaryButtonText = isLight
    ? colors.default.secondary[400]
    : colors.default.secondary[300];

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
      <LinearGradient
        colors={[startColor, endColor]}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        locations={[0, 0.4]}
        style={[styles.outerWrapper]}
      >
        <LinearGradient
          colors={[startColor, endColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0.4, 1]}
          style={[styles.wrapper]}
        >
          <Text
            numberOfLines={1}
            style={[styles.text]}
          >{`${room.name} (${room.building}-${room.room})`}</Text>
          <View style={[styles.actionWrapper]}>
            {requestsStatus === "loading" || mutation.status === "loading" ? (
              <ActivityIndicator
                size="small"
                color={isLight ? startColor : colors.default.tint[200]}
              />
            ) : (
              canRequest && (
                <Pressable onPress={() => mutation.mutate()}>
                  <IonIcon
                    name="add-circle"
                    color={isLight ? startColor : colors.default.tint[200]}
                  />
                </Pressable>
              )
            )}
          </View>
        </LinearGradient>
      </LinearGradient>
      <Modal visible={!!dialogContent} onClose={() => setDialogContent(null)}>
        <ModalHeader>{dialogContent?.title}</ModalHeader>
        <ModalBody>
          <Text style={[styles.text, { color: defaultText }]}>
            {dialogContent?.message}
          </Text>
        </ModalBody>
        <ModalFooter>
          {dialogContent?.status === "success" && (
            <Pressable
              style={[
                styles.textButton,
                {
                  backgroundColor: primaryButtonBg,
                },
              ]}
              onPress={() => {
                setDialogContent(null);
                router.push("/(app)/profile/requests");
              }}
            >
              <Text style={[styles.text, { color: primaryButtonText }]}>
                Go to Requests
              </Text>
            </Pressable>
          )}
          <Pressable
            style={[
              styles.textButton,
              {
                backgroundColor:
                  dialogContent?.status === "success"
                    ? secondaryButtonBg
                    : primaryButtonBg,
              },
            ]}
            onPress={() => setDialogContent(null)}
          >
            <Text
              style={[
                styles.text,
                {
                  color:
                    dialogContent?.status === "success"
                      ? secondaryButtonText
                      : primaryButtonText,
                },
              ]}
            >
              OK
            </Text>
          </Pressable>
        </ModalFooter>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    width: "100%",
    borderRadius: 8,
    padding: 2,
  },
  wrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
  },
  text: {
    paddingTop: 4,
    fontFamily: fonts.poppinsMedium,
    fontSize: 16,
    color: colors.default.white[100],
  },
  actionWrapper: {
    width: 32,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});
