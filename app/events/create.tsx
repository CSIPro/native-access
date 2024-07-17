import { IonIcon } from "@/components/icons/ion";
import { MaterialIcon } from "@/components/icons/material";
import { DatePicker } from "@/components/ui/date-picker";
import { Input, InputErrorText } from "@/components/ui/input";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useRoomContext } from "@/context/room-context";
import { EventForm } from "@/hooks/events/use-events";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "expo-router";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

export default function CreateEvent() {
  const isLight = useColorScheme() === "light";
  const { rooms } = useRoomContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EventForm>({
    resolver: zodResolver(EventForm),
    defaultValues: {
      name: "",
      description: "",
      eventStart: new Date().toISOString(),
      eventEnd: new Date().toISOString(),
      roomId: undefined,
      spots: 0,
      participants: [],
    },
  });

  const nameRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);

  const backgroundColor = isLight
    ? colors.default.white[100]
    : colors.default.black[400];
  const color = isLight ? colors.default.black[400] : colors.default.white[100];
  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: colors.default.tint[400] },
          headerTintColor: colors.default.white[100],
          headerTitle: "Create Event",
          headerTitleStyle: { fontFamily: fonts.poppinsMedium },
        }}
      />
      <View style={[styles.formWrapper]}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              ref={nameRef}
              label="Nombre del evento"
              value={value}
              onChangeText={onChange}
              placeholder="CSI PRO KICK-OFF"
              icon={<IonIcon name="text" size={24} color={iconColor} />}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => descriptionRef.current?.focus()}
              errorText={errors.name?.message}
              autoCapitalize="words"
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input
              ref={descriptionRef}
              label="Descripción del evento"
              value={value}
              onChangeText={onChange}
              icon={
                <MaterialIcon name="description" size={24} color={iconColor} />
              }
              multiline
              numberOfLines={4}
              style={{ textAlignVertical: "top" }}
              returnKeyType="next"
              blurOnSubmit={false}
              errorText={errors.description?.message}
              autoCapitalize="sentences"
            />
          )}
        />
        <View style={[styles.rowFields]}>
          <Controller
            control={control}
            name="eventStart"
            render={({ field: { onChange, value } }) => (
              <View style={[styles.dateFields]}>
                <DatePicker
                  label="Fecha de inicio"
                  value={new Date(value)}
                  onChange={onChange}
                />
                {errors.eventStart && (
                  <InputErrorText>{errors.eventStart?.message}</InputErrorText>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="eventStart"
            render={({ field: { onChange, value } }) => (
              <View style={[styles.timeFields]}>
                <DatePicker
                  label="Hora de inicio"
                  value={new Date(value)}
                  onChange={onChange}
                  mode="time"
                />
                {errors.eventStart && (
                  <InputErrorText>{errors.eventStart?.message}</InputErrorText>
                )}
              </View>
            )}
          />
        </View>
        <View style={[styles.rowFields]}>
          <Controller
            control={control}
            name="eventEnd"
            render={({ field: { onChange, value } }) => (
              <View style={[styles.dateFields]}>
                <DatePicker
                  label="Fecha de fin"
                  value={new Date(value)}
                  onChange={onChange}
                  mode="date"
                />
                {errors.eventEnd && (
                  <InputErrorText>{errors.eventEnd?.message}</InputErrorText>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="eventEnd"
            render={({ field: { onChange, value } }) => (
              <View style={[styles.timeFields]}>
                <DatePicker
                  label="Hora de fin"
                  value={new Date(value)}
                  onChange={onChange}
                  mode="time"
                />
                {errors.eventEnd && (
                  <InputErrorText>{errors.eventEnd?.message}</InputErrorText>
                )}
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
  dateFields: {
    flex: 3,
  },
  timeFields: {
    flex: 2,
  },
});
