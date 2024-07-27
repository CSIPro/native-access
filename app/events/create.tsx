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
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useRoomContext } from "@/context/room-context";
import {
  Event,
  EventForm,
  EventTypes,
  eventTypesLabels,
  useSubmitEvent,
} from "@/hooks/events/use-events";
import { useNestRooms } from "@/hooks/use-rooms";
import { formatRoomName } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Easing,
  LinearTransition,
  SlideInLeft,
  SlideOutRight,
} from "react-native-reanimated";

const layoutAnimation = LinearTransition.duration(250).easing(Easing.ease);

export default function CreateEvent() {
  const isLight = useColorScheme() === "light";
  const rooms = useNestRooms();
  const window = useWindowDimensions();
  const router = useRouter();

  const submitEvent = useSubmitEvent();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<EventForm>({
    resolver: zodResolver(EventForm),
    defaultValues: {
      name: "",
      description: "",
      eventStart: new Date(),
      eventEnd: new Date(),
      roomId: undefined,
      spots: undefined,
      participants: [{ name: "" }],
      eventType: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const nameRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);
  const spotsRef = useRef<TextInput>(null);

  const goBack = () => {
    router.back();
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  const onSubmit = (data: EventForm) => {
    const eventStart = data.eventStart;
    const eventEnd = data.eventEnd;

    if (eventEnd < eventStart) {
      setError("eventEnd", {
        type: "manual",
        message: "La fecha de fin debe ser después de la fecha de inicio",
      });

      return;
    }

    const presenters = data.participants.reduce((acc, presenter) => {
      if (presenter.name) {
        acc.push(presenter.name);
      }

      return acc;
    }, []);

    if (presenters.length === 0) {
      setError("participants", {
        type: "manual",
        message: "Debes agregar al menos un(a) presentador(a)",
      });

      return;
    }

    const eventData: Event = {
      ...data,
      participants: presenters,
      eventStart: eventStart.toISOString(),
      eventEnd: eventEnd.toISOString(),
    };

    submitEvent.mutate(eventData);
  };

  const resetMutation = () => submitEvent.reset();

  const color = isLight ? colors.default.black[400] : colors.default.white[100];
  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  return (
    <Animated.ScrollView
      style={[
        styles.wrapper,
        {
          backgroundColor: isLight
            ? colors.default.white[100]
            : colors.default.black[400],
        },
      ]}
    >
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
              returnKeyType="done"
              onSubmitEditing={dismissKeyboard}
              blurOnSubmit={false}
              errorText={errors.name?.message}
              autoCapitalize="words"
            />
          )}
        />
        <Controller
          control={control}
          name="eventType"
          render={({ field: { onChange, value } }) => (
            <View>
              <Dropdown
                items={Object.keys(EventTypes.enum).map((eType) => ({
                  key: eType,
                  value: eType,
                  label: eventTypesLabels[eType],
                }))}
                onChange={onChange}
                sheetTitle="Escoge un tipo de evento"
                placeholder="Tipo de evento"
                label="Tipo de evento"
                value={value}
                icon={<MaterialIcon name="event" size={24} color={iconColor} />}
              />
              {errors.eventType && (
                <InputErrorText>{errors.eventType?.message}</InputErrorText>
              )}
            </View>
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
              returnKeyType="done"
              blurOnSubmit={false}
              onSubmitEditing={dismissKeyboard}
              errorText={errors.description?.message}
              autoCapitalize="sentences"
            />
          )}
        />
        <Controller
          control={control}
          name="eventStart"
          render={({ field: { onChange, value } }) => (
            <>
              <View style={[styles.rowFields]}>
                <View style={[styles.dateFields]}>
                  <DatePicker
                    label="Fecha de inicio"
                    value={new Date(value)}
                    onChange={onChange}
                    maximumDate={
                      new Date(new Date().getTime() + 3600 * 1000 * 24 * 90)
                    }
                  />
                </View>
                <View style={[styles.timeFields]}>
                  <DatePicker
                    label="Hora de inicio"
                    value={new Date(value)}
                    onChange={onChange}
                    mode="time"
                  />
                </View>
              </View>
              {errors.eventStart && (
                <InputErrorText>{errors.eventStart?.message}</InputErrorText>
              )}
            </>
          )}
        />
        <Controller
          control={control}
          name="eventEnd"
          render={({ field: { onChange, value } }) => (
            <>
              <View style={[styles.rowFields]}>
                <View style={[styles.dateFields]}>
                  <DatePicker
                    label="Fecha de fin"
                    value={new Date(value)}
                    onChange={onChange}
                    minimumDate={new Date(watch("eventStart"))}
                    mode="date"
                  />
                </View>
                <View style={[styles.timeFields]}>
                  <DatePicker
                    label="Hora de fin"
                    value={new Date(value)}
                    onChange={onChange}
                    mode="time"
                  />
                </View>
              </View>
              {errors.eventEnd && (
                <InputErrorText>{errors.eventEnd?.message}</InputErrorText>
              )}
            </>
          )}
        />
        <Controller
          control={control}
          name="spots"
          render={({ field: { onChange, value } }) => (
            <Input
              inputMode="numeric"
              ref={spotsRef}
              label="Cupos"
              value={value?.toString()}
              onChangeText={(e) => onChange(+e)}
              placeholder="100"
              icon={<IonIcon name="people" size={24} color={iconColor} />}
              returnKeyType="done"
              blurOnSubmit={false}
              onSubmitEditing={dismissKeyboard}
              errorText={errors.spots?.message}
            />
          )}
        />
        {rooms.status === "loading" && (
          <View style={[styles.placeholder]}>
            <ActivityIndicator size="small" color={iconColor} />
          </View>
        )}
        {rooms.status === "success" && (
          <Controller
            control={control}
            name="roomId"
            render={({ field: { onChange, value } }) => (
              <View>
                <Dropdown
                  items={rooms.data.map((room) => ({
                    key: room.id,
                    value: room.id,
                    label: formatRoomName(room),
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
                {errors.roomId && (
                  <InputErrorText>{errors.roomId?.message}</InputErrorText>
                )}
              </View>
            )}
          />
        )}
        {fields.map((field, index) => (
          <Animated.View
            key={field.id}
            entering={SlideInLeft}
            exiting={SlideOutRight}
            layout={layoutAnimation}
          >
            <Controller
              control={control}
              name={`participants.${index}.name`}
              render={({ field: { onChange, value, ref } }) => (
                <Input
                  label={`Presentador(a) ${index + 1}`}
                  value={value}
                  onChangeText={onChange}
                  placeholder="John Doe"
                  icon={<IonIcon name="person" size={24} color={iconColor} />}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    if (index === fields.length - 1) {
                      append({ name: "" });
                    }

                    dismissKeyboard();
                  }}
                  onBlur={() => {
                    if (index === fields.length - 1 && value.length > 0) {
                      append({ name: "" });
                    }

                    dismissKeyboard();
                  }}
                  errorText={errors.participants?.[index]?.name?.message}
                  autoCapitalize="words"
                >
                  {fields.length > 1 && (
                    <InputAction
                      onPress={() => remove(index)}
                      style={[
                        {
                          backgroundColor:
                            colors.default.secondary.translucid[200],
                        },
                      ]}
                    >
                      <MaterialIcon
                        name="delete"
                        color={colors.default.secondary[400]}
                        size={24}
                      />
                    </InputAction>
                  )}
                </Input>
              )}
            />
          </Animated.View>
        ))}
        {errors.participants && (
          <InputErrorText>{errors.participants.message}</InputErrorText>
        )}
        <View style={[{ height: 8 }]} />
        {submitEvent.status === "loading" && (
          <ActivityIndicator size="large" color={iconColor} />
        )}
        {submitEvent.status !== "loading" && (
          <Animated.View layout={layoutAnimation} style={[styles.rowFields]}>
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
          </Animated.View>
        )}
        {submitEvent.status === "error" && (
          <Modal visible={true} onClose={resetMutation}>
            <ModalHeader>Error</ModalHeader>
            <ModalBody>
              <Text style={[styles.text, { color }]}>
                {(submitEvent.error as Error).message}
              </Text>
            </ModalBody>
            <ModalFooter>
              <TextButton onPress={resetMutation}>OK</TextButton>
            </ModalFooter>
          </Modal>
        )}
        {submitEvent.status === "success" && (
          <Modal visible={true} onClose={goBack}>
            <ModalHeader>Evento creado</ModalHeader>
            <ModalBody>
              <Text style={[styles.text, { color }]}>
                El evento ha sido creado correctamente
              </Text>
            </ModalBody>
            <ModalFooter>
              <TextButton onPress={goBack}>OK</TextButton>
            </ModalFooter>
          </Modal>
        )}
        <View style={[{ height: window.height * 0.35 }]} />
      </View>
      <StatusBar style="light" />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
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
  placeholder: {
    backgroundColor: colors.default.tint.translucid[200],
    width: "100%",
    height: 64,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: fonts.inter,
    fontSize: 16,
  },
});
