import { Stack, useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { useRef } from "react";
import { Input, InputErrorText } from "@/components/ui/input";
import { IonIcon } from "@/components/icons/ion";
import { useUserContext } from "@/context/user-context";
import { useRoomContext } from "@/context/room-context";
import { useMemberships } from "@/hooks/use-membership";
import { Dropdown } from "@/components/ui/dropdown";
import {
  BASE_API_URL,
  formatRoomName,
  formatUserName,
  NestError,
} from "@/lib/utils";
import { MaterialIcon } from "@/components/icons/material";
import { Checkbox, CheckboxLabel } from "@/components/ui/checkbox";
import { TextButton } from "@/components/ui/text-button";
import { firebaseAuth } from "@/lib/firebase-config";
import { useMutation } from "react-query";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/modal/modal";
import { zodResolver } from "@hookform/resolvers/zod";

const NotificationForm = z.object({
  title: z
    .string()
    .min(1, { message: "El título es obligatorio" })
    .max(100, { message: "El título no puede tener más de 100 caracteres" }),
  body: z
    .string()
    .min(1, { message: "El mensaje es obligatorio" })
    .max(250, { message: "El mensaje no puede tener más de 250 caracteres" }),
  roomId: z.string({ required_error: "El salón es obligatorio" }),
  appendAuthor: z.boolean(),
});

type NotificationForm = z.infer<typeof NotificationForm>;

const pushNotification = async (form: NotificationForm) => {
  const authUser = firebaseAuth.currentUser;

  const { title, body, roomId } = form;

  const res = await fetch(
    `${BASE_API_URL}/notifications/send-to-room/${roomId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await authUser.getIdToken()}`,
      },
      body: JSON.stringify({ title, body }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    const errorParse = NestError.safeParse(data);

    if (errorParse.success) {
      switch (errorParse.data.statusCode) {
        case 400:
          throw new Error("La solicitud no tiene el formato correcto.");
        case 401:
          throw new Error("No estás autorizado para enviar notificaciones.");
        case 403:
          throw new Error("No tienes permisos para enviar notificaciones.");
        default:
          throw new Error("Error al enviar la notificación");
      }
    } else {
      throw new Error("Error al enviar la notificación");
    }
  }
};

export default function SendNotification() {
  const isLight = useColorScheme() === "light";
  const router = useRouter();

  const sendNotification = useMutation<void, Error, NotificationForm, void>(
    pushNotification,
    {
      onSuccess: () => router.back(),
    }
  );
  const { user } = useUserContext();
  const { rooms } = useRoomContext();
  const { status: membershipsStatus, data: memberships } = useMemberships(
    user.id
  );

  const titleRef = useRef<TextInput>(null);
  const bodyRef = useRef<TextInput>(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<NotificationForm>({
    resolver: zodResolver(NotificationForm),
    defaultValues: {
      title: "",
      body: "",
      roomId: undefined,
      appendAuthor: true,
    },
  });

  if (membershipsStatus === "loading") {
    return (
      <View style={[styles.centered]}>
        <ActivityIndicator size="large" color={colors.default.tint[400]} />
      </View>
    );
  }

  if (membershipsStatus === "error") {
    return (
      <View style={[styles.centered]}>
        <Text style={[styles.text, { color: colors.default.black[400] }]}>
          No fue posible obtener los salones a los que perteneces
        </Text>
      </View>
    );
  }

  const onChangeAppendSender = (value: boolean) => {
    setValue("appendAuthor", value);
  };

  const onSubmit = (data: NotificationForm) => {
    data.title = data.title.trim();
    data.body = data.body.trim();

    if (data.appendAuthor) {
      data.body += `\n\n- ${formatUserName(user)}.`;
    }

    sendNotification.mutate(data);
  };

  const items = user.isRoot
    ? rooms
    : rooms.filter((room) => memberships.some((m) => m.room.id === room.id));

  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  return (
    <ScrollView style={{ flex: 1, padding: 8, gap: 8 }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Enviar Notificación",
          headerStyle: { backgroundColor: colors.default.tint[400] },
          headerTitleStyle: { fontFamily: fonts.poppinsMedium },
          headerTintColor: colors.default.white[100],
        }}
      />
      <Text style={[styles.text]}>
        Puedes enviar notificaciones a todos los usuarios que pertenecen al
        salón seleccionado
      </Text>
      <View
        style={{
          height: 8,
          borderBottomWidth: 1,
          borderColor: colors.default.tint[400],
        }}
      />
      <Controller
        control={control}
        name="title"
        render={({ field: { value, onChange } }) => (
          <Input
            ref={titleRef}
            label="Título"
            value={value}
            onChangeText={onChange}
            icon={<IonIcon name="text" color={iconColor} size={24} />}
            placeholder="Título de la notificación"
            returnKeyType="next"
            onSubmitEditing={() => bodyRef.current?.focus()}
            blurOnSubmit={false}
            errorText={errors.title?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="body"
        render={({ field: { value, onChange } }) => (
          <Input
            ref={bodyRef}
            label="Mensaje"
            value={value}
            onChangeText={onChange}
            icon={<IonIcon name="mail" color={iconColor} size={24} />}
            placeholder="Contenido de la notificación"
            returnKeyType="done"
            errorText={errors.body?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="roomId"
        render={({ field: { onChange, value } }) => (
          <View>
            <Dropdown
              items={items.map((room) => ({
                key: room.id,
                value: room.id,
                label: formatRoomName(room),
              }))}
              onChange={onChange}
              sheetTitle="Escoge un salón"
              placeholder="Escoge un salón"
              label="Salón"
              value={value}
              icon={<MaterialIcon name="room" size={24} color={iconColor} />}
            />
            {errors.roomId && (
              <InputErrorText>{errors.roomId?.message}</InputErrorText>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="appendAuthor"
        render={({ field: { value } }) => (
          <View style={styles.checkboxWrapper}>
            <Checkbox checked={value} onChange={onChangeAppendSender}>
              <CheckboxLabel>Incluir nombre del remitente</CheckboxLabel>
            </Checkbox>
          </View>
        )}
      />
      <TextButton
        onPress={
          sendNotification.status === "loading" ? null : handleSubmit(onSubmit)
        }
      >
        {sendNotification.status === "loading" ? (
          <ActivityIndicator color={iconColor} />
        ) : (
          "Enviar notificación"
        )}
      </TextButton>
      {sendNotification.error && (
        <Modal visible={true} onClose={() => sendNotification.reset()}>
          <ModalHeader>Error</ModalHeader>
          <ModalBody>
            <Text style={[styles.text]}>
              {sendNotification.error?.message ??
                "Error al enviar la notificación"}
            </Text>
          </ModalBody>
          <ModalFooter>
            <TextButton onPress={() => sendNotification.reset()}>OK</TextButton>
          </ModalFooter>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: fonts.inter,
    color: colors.default.white[100],
    fontSize: 16,
  },
  checkboxWrapper: {
    paddingVertical: 4,
  },
});
