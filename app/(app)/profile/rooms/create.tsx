import { FAIcon } from "@/components/icons/font-awesome";
import { IonIcon } from "@/components/icons/ion";
import { MaterialIcon } from "@/components/icons/material";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/modal/modal";
import { Input } from "@/components/ui/input";
import { TextButton } from "@/components/ui/text-button";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { RoomForm, useSubmitRoom } from "@/hooks/use-rooms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useRouter } from "expo-router";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function NewRoom() {
  const isLight = useColorScheme() === "light";
  const submitRoom = useSubmitRoom();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RoomForm>({
    resolver: zodResolver(RoomForm),
    defaultValues: {
      building: undefined,
      name: undefined,
      roomNumber: undefined,
    },
  });

  const buildingRef = useRef<TextInput>(null);
  const roomNumberRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);

  const onSubmit = (data: RoomForm) => {
    submitRoom.mutate({
      ...data,
      building: data.building.toUpperCase(),
    });
  };

  const goBack = () => {
    router.back();
  };

  const resetMutation = () => submitRoom.reset();

  const color = isLight ? colors.default.black[400] : colors.default.white[100];
  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  const placeholderName =
    watch("building") && watch("roomNumber")
      ? `${watch("building")}-${watch("roomNumber")}`
      : "CSI PRO";

  return (
    <ScrollView style={[styles.wrapper]}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: colors.default.tint[400] },
          headerTitle: "Create Room",
          headerTintColor: colors.default.white[100],
        }}
      />
      <View style={[styles.formWrapper]}>
        <View style={[styles.rowFields]}>
          <View style={[{ flex: 1 }]}>
            <Controller
              control={control}
              name="building"
              render={({ field: { value, onChange } }) => (
                <Input
                  ref={buildingRef}
                  label="Edificio"
                  value={value}
                  onChangeText={onChange}
                  placeholder="5J"
                  icon={<FAIcon name="building" color={iconColor} size={24} />}
                  returnKeyType="next"
                  onSubmitEditing={() => roomNumberRef.current?.focus()}
                  blurOnSubmit={false}
                  errorText={errors.building?.message}
                  autoCapitalize="characters"
                />
              )}
            />
          </View>
          <View style={[{ flex: 1 }]}>
            <Controller
              control={control}
              name="roomNumber"
              render={({ field: { value, onChange } }) => (
                <Input
                  ref={roomNumberRef}
                  label="Salón"
                  value={value}
                  onChangeText={onChange}
                  placeholder="205"
                  icon={
                    <MaterialIcon
                      name="meeting-room"
                      color={iconColor}
                      size={24}
                    />
                  }
                  returnKeyType="next"
                  onSubmitEditing={() => nameRef.current?.focus()}
                  blurOnSubmit={false}
                  inputMode="numeric"
                  errorText={errors.roomNumber?.message}
                  autoCapitalize="characters"
                />
              )}
            />
          </View>
        </View>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <Input
              ref={nameRef}
              label="Nombre"
              value={value}
              onChangeText={onChange}
              placeholder={placeholderName}
              icon={<IonIcon name="text" color={iconColor} size={24} />}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              errorText={errors.name?.message}
              autoCapitalize="words"
            />
          )}
        />
        {submitRoom.status === "loading" && (
          <ActivityIndicator size="large" color={iconColor} />
        )}
        {submitRoom.status !== "loading" && (
          <View style={[styles.rowFields]}>
            <TextButton
              variant="secondary"
              wrapperStyle={[{ flex: 1 }]}
              onPress={goBack}
            >
              Volver
            </TextButton>
            <TextButton
              wrapperStyle={[{ flex: 2, width: "100%" }]}
              onPress={handleSubmit(onSubmit)}
            >
              Enviar
            </TextButton>
          </View>
        )}
        {submitRoom.status === "error" && (
          <Modal visible={true} onClose={resetMutation}>
            <ModalHeader>Error</ModalHeader>
            <ModalBody>
              <Text style={[styles.text, { color }]}>
                {(submitRoom.error as Error).message}
              </Text>
            </ModalBody>
            <ModalFooter>
              <TextButton onPress={resetMutation}>OK</TextButton>
            </ModalFooter>
          </Modal>
        )}
        {submitRoom.status === "success" && (
          <Modal visible={true} onClose={goBack}>
            <ModalHeader>Salón creado</ModalHeader>
            <ModalBody>
              <Text style={[styles.text, { color }]}>
                El salón ha sido creado correctamente
              </Text>
            </ModalBody>
            <ModalFooter>
              <TextButton onPress={goBack}>OK</TextButton>
            </ModalFooter>
          </Modal>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.default.black[400],
  },
  formWrapper: {
    flex: 1,
    padding: 4,
    gap: 8,
  },
  rowFields: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  text: {
    fontFamily: fonts.inter,
    fontSize: 16,
  },
});
