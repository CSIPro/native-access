import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useMutation } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { IonIcon } from "@/components/icons/ion";
import { MaterialIcon } from "@/components/icons/material";
import { DatePicker } from "@/components/ui/date-picker";
import { Dropdown } from "@/components/ui/dropdown";
import { Input, InputErrorText } from "@/components/ui/input";

import { useRooms } from "@/hooks/use-rooms";

import { SignUpForm, createUser } from "@/lib/signup-utils";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/modal/modal";

export default function SignUp() {
  const mutation = useMutation<void, Error, SignUpForm>({
    mutationFn: (data: SignUpForm) => {
      return createUser(data);
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignUpForm),
    defaultValues: {
      name: "",
      unisonId: "",
      passcode: "",
      dateOfBirth: new Date(),
      room: undefined,
    },
  });

  const { status: roomsStatus, data: rooms } = useRooms();

  const nameRef = useRef<TextInput>(null);
  const uniSonIdRef = useRef<TextInput>(null);
  const passcodeRef = useRef<TextInput>(null);

  const isLight = useColorScheme() === "light";

  const onSubmit = (data: SignUpForm) => {
    const dob = data.dateOfBirth;
    const offsetDob = new Date(
      data.dateOfBirth.getTime() - dob.getTimezoneOffset() * 60 * 1000
    );
    const normalizedDob = new Date(offsetDob.setHours(0, 0, 0, 0));

    mutation.mutate({ ...data, dateOfBirth: normalizedDob });
  };

  const backgroundColor = isLight
    ? colors.default.white[100]
    : colors.default.black[400];
  const color = isLight ? colors.default.black[400] : colors.default.white[100];
  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  const textButtonBg = isLight
    ? colors.default.tint.translucid[100]
    : colors.default.tint.translucid[200];
  const textButtonColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[100];

  return (
    <ScrollView style={{ flex: 1, width: "100%", backgroundColor }}>
      <Stack.Screen
        options={{
          headerTitle: "Sign up",
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
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              ref={nameRef}
              label="Name"
              value={value}
              onChangeText={onChange}
              placeholder="e.g. Saúl Ramos"
              icon={<IonIcon name="person" size={24} color={iconColor} />}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => {
                uniSonIdRef.current?.focus();
              }}
              errorText={errors.name?.message}
              autoCapitalize="words"
            />
          )}
        />
        <Controller
          control={control}
          name="unisonId"
          render={({ field: { onChange, value } }) => (
            <Input
              ref={uniSonIdRef}
              label="UniSon ID"
              value={value}
              onChangeText={onChange}
              placeholder="e.g. 217200160"
              icon={<MaterialIcon name="badge" size={24} color={iconColor} />}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => {
                passcodeRef.current?.focus();
              }}
              errorText={errors.unisonId?.message}
              inputMode="numeric"
            />
          )}
        />
        <Controller
          control={control}
          name="passcode"
          render={({ field: { onChange, value } }) => (
            <Input
              ref={passcodeRef}
              label="Passcode"
              value={value}
              onChangeText={onChange}
              placeholder="e.g. A1B2C3"
              icon={
                <IonIcon
                  name="md-code-working-outline"
                  size={24}
                  color={iconColor}
                />
              }
              helperText="Must contain numbers and letters from A to D"
              errorText={errors.passcode?.message}
              secureTextEntry={true}
            />
          )}
        />
        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field: { onChange, value } }) => (
            <View>
              <DatePicker label="Birthday" value={value} onChange={onChange} />
              {errors.dateOfBirth && (
                <InputErrorText>{errors.dateOfBirth?.message}</InputErrorText>
              )}
            </View>
          )}
        />
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
                    label: `${room.name} (${room.building}-${room.room})`,
                  }))}
                  onChange={onChange}
                  sheetTitle="Pick a room"
                  placeholder="Pick a room"
                  label="Room"
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
        <View style={[{ paddingVertical: 4 }]} />
        {mutation.isLoading ? (
          <ActivityIndicator size="large" color={iconColor} />
        ) : (
          <Pressable
            onPress={handleSubmit(onSubmit)}
            style={[styles.textButton, { backgroundColor: textButtonBg }]}
          >
            <Text
              style={[
                styles.text,
                styles.mediumText,
                { color: textButtonColor },
              ]}
            >
              Sign up
            </Text>
          </Pressable>
        )}
        {mutation.isError && (
          <Modal visible={true} onClose={() => mutation.reset()}>
            <ModalHeader>Error</ModalHeader>
            <ModalBody>
              <Text style={[styles.text, { color }]}>
                {mutation.error?.message.split(": ")[1]}
              </Text>
            </ModalBody>
            <ModalFooter>
              <Pressable
                onPress={() => mutation.reset()}
                style={[styles.textButton, { backgroundColor: textButtonBg }]}
              >
                <Text
                  style={[
                    styles.text,
                    styles.mediumText,
                    { color: textButtonColor },
                  ]}
                >
                  OK
                </Text>
              </Pressable>
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
});
