import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { useAuth } from "reactfire";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";

import { IonIcon } from "@/components/icons/ion";
import { MaterialIcon } from "@/components/icons/material";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/modal/modal";
import { DatePicker } from "@/components/ui/date-picker";
import { Dropdown } from "@/components/ui/dropdown";
import { Input, InputAction, InputErrorText } from "@/components/ui/input";
import { TextButton } from "@/components/ui/text-button";

import { useNestRooms } from "@/hooks/use-rooms";

import { deleteAllFromStorage, generatePasscode } from "@/lib/utils";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { SignUpForm, useCreateUser } from "@/hooks/use-user-data";
import { useNestRequestHelpers } from "@/hooks/use-requests";

export default function SignUp() {
  const auth = useAuth();
  const router = useRouter();
  const createUser = useCreateUser();
  const { createRequest } = useNestRequestHelpers();

  const [showPasscode, setShowPasscode] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignUpForm),
    defaultValues: {
      firstName: "",
      lastName: "",
      unisonId: "",
      passcode: "",
      dateOfBirth: new Date(),
      room: undefined,
    },
  });

  const { status: roomsStatus, data: rooms } = useNestRooms();

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const uniSonIdRef = useRef<TextInput>(null);
  const passcodeRef = useRef<TextInput>(null);

  const isLight = useColorScheme() === "light";

  const onSubmit = async (data: SignUpForm) => {
    const dob = data.dateOfBirth;
    const offsetDob = new Date(
      data.dateOfBirth.getTime() - dob.getTimezoneOffset() * 60 * 1000
    );
    const normalizedDob = new Date(offsetDob.setHours(0, 0, 0, 0));

    await createUser.mutateAsync({ ...data, dateOfBirth: normalizedDob });
    await createRequest.mutateAsync(data.room);
  };

  const handleSignOut = () => {
    deleteAllFromStorage();
    auth.signOut();
    router.replace("/sign-in");
  };

  const backgroundColor = isLight
    ? colors.default.white[100]
    : colors.default.black[400];
  const color = isLight ? colors.default.black[400] : colors.default.white[100];
  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  return (
    <ScrollView style={{ flex: 1, width: "100%", backgroundColor }}>
      <Stack.Screen
        options={{
          headerTitle: "Registro",
          headerTitleStyle: {
            fontFamily: fonts.poppinsMedium,
            color: colors.default.white[100],
          },
          headerStyle: {
            backgroundColor: colors.default.tint[400],
          },
          headerTintColor: colors.default.white[100],
        }}
      />
      <View style={[{ padding: 4, gap: 8 }]}>
        <View style={[styles.rowFields]}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={firstNameRef}
                label="Nombre"
                value={value}
                onChangeText={onChange}
                placeholder="Saúl Alberto"
                icon={<IonIcon name="person" size={24} color={iconColor} />}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  lastNameRef.current?.focus();
                }}
                errorText={errors.firstName?.message}
                autoCapitalize="words"
              />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={lastNameRef}
                label="Apellidos"
                value={value}
                onChangeText={onChange}
                placeholder="Ramos Laborín"
                icon={<IonIcon name="person" size={24} color={iconColor} />}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  passcodeRef.current?.focus();
                }}
                errorText={errors.lastName?.message}
                autoCapitalize="words"
              />
            )}
          />
        </View>
        <Controller
          control={control}
          name="passcode"
          render={({ field: { onChange, value } }) => (
            <Input
              ref={passcodeRef}
              label="Código de acceso"
              value={value}
              onChangeText={onChange}
              placeholder="A1B2C3"
              icon={<IonIcon name="code-working" size={24} color={iconColor} />}
              helperText="Debe contener números y letras de la A a la D"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => {
                uniSonIdRef.current?.focus();
              }}
              errorText={errors.passcode?.message}
              secureTextEntry={!showPasscode}
            >
              <InputAction
                onPress={() => {
                  setShowPasscode((prev) => !prev);
                  Haptics.selectionAsync();
                }}
              >
                <MaterialIcon
                  name={showPasscode ? "visibility-off" : "visibility"}
                  color={iconColor}
                  size={24}
                />
              </InputAction>
              <InputAction
                onPress={() => {
                  setValue("passcode", generatePasscode());
                  Haptics.selectionAsync();
                  setShowPasscode(true);
                }}
              >
                <MaterialIcon name="auto-awesome" color={iconColor} size={24} />
              </InputAction>
            </Input>
          )}
        />
        <View style={[styles.rowFields]}>
          <Controller
            control={control}
            name="unisonId"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={uniSonIdRef}
                label="Expediente"
                value={value}
                onChangeText={onChange}
                placeholder="e.g. 217200160"
                icon={<MaterialIcon name="badge" size={24} color={iconColor} />}
                errorText={errors.unisonId?.message}
                inputMode="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field: { onChange, value } }) => (
              <View style={[{ flex: 1 }]}>
                <DatePicker
                  label="Fecha de nacimiento"
                  value={value}
                  onChange={onChange}
                  minimumDate={new Date(1900, 0, 1)}
                  maximumDate={new Date()}
                />
                {errors.dateOfBirth && (
                  <InputErrorText>{errors.dateOfBirth?.message}</InputErrorText>
                )}
              </View>
            )}
          />
        </View>
        {roomsStatus === "loading" && (
          <View style={[styles.wrapper]}>
            <View style={[styles.labelWrapper]}>
              <Text style={[styles.text, { color }]}>Room</Text>
            </View>
            <View style={[styles.inputWrapper]}>
              <ActivityIndicator size="small" color={iconColor} />
            </View>
          </View>
        )}
        {roomsStatus === "success" && (
          <Controller
            control={control}
            name="room"
            render={({ field: { onChange, value } }) => (
              <View>
                <Dropdown
                  items={rooms.map((room) => ({
                    key: room.id,
                    value: room.id,
                    label: `${room.name} (${room.building}${
                      room.roomNumber ? `-${room.roomNumber}` : ""
                    })`,
                  }))}
                  onChange={onChange}
                  sheetTitle="Elige un salón"
                  placeholder="Elige un salón"
                  label="Salón"
                  value={value}
                  icon={
                    <MaterialIcon name="room" size={24} color={iconColor} />
                  }
                />
                {errors.room && (
                  <InputErrorText>{errors.room?.message}</InputErrorText>
                )}
              </View>
            )}
          />
        )}
        <View style={[styles.controls]}>
          {createUser.isLoading || createRequest.isLoading ? (
            <ActivityIndicator size="large" color={iconColor} />
          ) : (
            <View style={[styles.rowFields]}>
              <TextButton
                variant="secondary"
                onPress={handleSignOut}
                wrapperStyle={[{ flex: 1, width: "100%" }]}
              >
                Salir
              </TextButton>
              <TextButton
                onPress={handleSubmit(onSubmit)}
                wrapperStyle={[{ flex: 2, width: "100%" }]}
              >
                Enviar
              </TextButton>
            </View>
          )}
        </View>
        {createUser.isError && (
          <Modal visible={true} onClose={() => createUser.reset()}>
            <ModalHeader>Error</ModalHeader>
            <ModalBody>
              <Text style={[styles.text, { color }]}>
                {createUser.error?.message.split(": ")[1]}
              </Text>
            </ModalBody>
            <ModalFooter>
              <TextButton onPress={() => createUser.reset()}>OK</TextButton>
            </ModalFooter>
          </Modal>
        )}
        {createRequest.isError && (
          <Modal visible={true} onClose={() => createRequest.reset()}>
            <ModalHeader>Error</ModalHeader>
            <ModalBody>
              <Text style={[styles.text, { color }]}>
                {createRequest.error?.message.split(": ")[1]}
              </Text>
            </ModalBody>
            <ModalFooter>
              <TextButton onPress={() => createRequest.reset()}>OK</TextButton>
            </ModalFooter>
          </Modal>
        )}
        {createUser.isSuccess && createRequest.isSuccess && (
          <Modal visible={true} onClose={() => router.replace("/onboarding")}>
            <ModalHeader>¡Registro exitoso!</ModalHeader>
            <ModalBody>
              <Text style={[styles.text, { color }]}>
                Tu registro ha sido exitoso. Ahora puedes continuar.
              </Text>
            </ModalBody>
            <ModalFooter>
              <TextButton onPress={() => router.replace("/onboarding")}>
                Iniciar
              </TextButton>
            </ModalFooter>
          </Modal>
        )}
      </View>
      <StatusBar style="light" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: -4,
  },
  inputWrapper: {
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  labelWrapper: {
    paddingHorizontal: 8,
  },
  text: {
    paddingTop: 4,
    fontFamily: fonts.poppins,
    fontSize: 16,
  },
  mediumText: {
    fontFamily: fonts.poppinsMedium,
  },
  textButton: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  controls: {
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  rowFields: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
});
