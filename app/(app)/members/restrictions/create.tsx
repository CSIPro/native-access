import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";

import colors from "@/constants/colors";
import { Link, useRouter } from "expo-router";
import { TextButton } from "@/components/ui/text-button";
import { IonIcon } from "@/components/icons/ion";
import fonts from "@/constants/fonts";
import { useRoomContext } from "@/context/room-context";
import { useRestrictionActions } from "@/hooks/use-restrictions";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Animated from "react-native-reanimated";
import { useNestRoles } from "@/hooks/use-roles";
import { Dropdown } from "@/components/ui/dropdown";
import { MaterialIcon } from "@/components/icons/material";
import { InputErrorText } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/modal/modal";
import { format } from "date-fns";
import { RestrictionDayButton } from "@/components/restrictions/restriction-day-button";

const RestrictionForm = z.object({
  roomId: z
    .string({ required_error: "Debes escoger un salón" })
    .uuid({ message: "El salón no es válido" }),
  roleId: z
    .string({ required_error: "Debes escoger un rol" })
    .uuid({ message: "El rol no es válido" }),
  daysBitmask: z
    .array(z.boolean())
    .length(7)
    .default(() => Array(7).fill(true)),
  startTime: z.date(),
  endTime: z.date(),
});

type RestrictionFormType = z.infer<typeof RestrictionForm>;

export default function CreateRestrictionPage() {
  const router = useRouter();
  const { selectedRoom } = useRoomContext();
  const rolesQuery = useNestRoles();
  const window = useWindowDimensions();
  const { createRestriction } = useRestrictionActions();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RestrictionFormType>({
    resolver: zodResolver(RestrictionForm),
    defaultValues: {
      roomId: selectedRoom,
      roleId: "",
      daysBitmask: Array(7).fill(true),
      startTime: new Date(new Date().setHours(0, 0, 0)),
      endTime: new Date(new Date().setHours(23, 59, 59)),
    },
  });

  const onSubmit = (data: RestrictionFormType) => {
    const daysBitmask = data.daysBitmask.reduce(
      (acc, curr, index) => acc + (curr ? 1 << index : 0),
      0
    );

    const startTime = format(data.startTime, "HH:mm:ss");
    const endTime = format(data.endTime, "HH:mm:ss");

    const restrictionData = {
      ...data,
      startTime,
      endTime,
      daysBitmask,
    };

    createRestriction.mutate(restrictionData);
  };

  const resetMutation = () => createRestriction.reset();

  const goBack = () => router.back();

  const isLight = useColorScheme() === "light";

  const backgroundColor = isLight
    ? colors.default.white[100]
    : colors.default.black[400];
  const textColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];
  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];
  const helperTextColor = isLight
    ? colors.default.black.translucid[600]
    : colors.default.gray.translucid[800];

  const availableRoles = (rolesQuery.data ?? []).filter(
    (role) => role.name !== "Admin"
  );

  return (
    <Animated.ScrollView style={[styles.main, { backgroundColor }]}>
      <View style={[styles.header]}>
        <Link href="../" asChild style={[styles.backButton]}>
          <Pressable>
            <IonIcon name="chevron-back" size={28} color={iconColor} />
          </Pressable>
        </Link>
        <View style={[styles.titleContainer]}>
          <Text style={[styles.text, styles.title, { color: textColor }]}>
            Crear restricción
          </Text>
        </View>
        <TextButton onPress={handleSubmit(onSubmit)}>Crear</TextButton>
      </View>
      <View style={[styles.formContainer]}>
        {rolesQuery.status === "loading" && (
          <View style={[styles.placeholder]}>
            <ActivityIndicator size="small" color={iconColor} />
          </View>
        )}
        {rolesQuery.status === "error" && (
          <Text style={[styles.text, { color: textColor }]}>
            Error al cargar los roles
          </Text>
        )}
        {rolesQuery.status === "success" && (
          <Controller
            control={control}
            name="roleId"
            render={({ field: { onChange, value } }) => (
              <View style={[styles.inputContainer]}>
                <Dropdown
                  items={availableRoles.map((role) => ({
                    key: role.id,
                    value: role.id,
                    label: role.name,
                  }))}
                  onChange={onChange}
                  value={value}
                  sheetTitle="Escoge un rol"
                  placeholder="Escoge un rol"
                  label="Rol"
                  icon={
                    <MaterialIcon name="grade" size={24} color={iconColor} />
                  }
                />
                <View style={[styles.inputTextContainer]}>
                  {errors.roleId ? (
                    <InputErrorText>{errors.roleId?.message}</InputErrorText>
                  ) : (
                    <Text
                      style={[
                        styles.text,
                        styles.helperText,
                        { color: helperTextColor },
                      ]}
                    >
                      El rol al que se le aplicará la restricción.
                    </Text>
                  )}
                </View>
              </View>
            )}
          />
        )}
        <View style={[styles.inputContainer]}>
          <View style={[styles.inputTextContainer]}>
            <Text
              style={[styles.text, styles.inputLabel, { color: textColor }]}
            >
              Días de la semana
            </Text>
          </View>
          <View style={[styles.restrictionTimeContainer]}>
            <Controller
              control={control}
              name="daysBitmask"
              render={({ field: { onChange, value } }) => (
                <>
                  {value.map((_, index) => (
                    <RestrictionDayButton
                      key={index}
                      onPress={() => {
                        const newValue = [...value];
                        newValue[index] = !newValue[index];
                        onChange(newValue);
                      }}
                      isActive={value[index]}
                      wrapperStyle={[
                        {
                          flex: 1,
                        },
                      ]}
                    >
                      {["D", "L", "M", "X", "J", "V", "S"][index]}
                    </RestrictionDayButton>
                  ))}
                </>
              )}
            />
          </View>
          <View style={[styles.inputTextContainer]}>
            {errors.daysBitmask ? (
              <InputErrorText>{errors.daysBitmask?.message}</InputErrorText>
            ) : (
              <Text
                style={[
                  styles.text,
                  styles.helperText,
                  { color: helperTextColor },
                ]}
              >
                Los días en los que los usuarios tienen acceso.
              </Text>
            )}
          </View>
        </View>
        <View style={[styles.inputContainer]}>
          <View style={[styles.restrictionTimeContainer]}>
            <View style={[styles.timeField]}>
              <Controller
                control={control}
                name="startTime"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Hora de inicio"
                    value={new Date(value)}
                    onChange={onChange}
                    mode="time"
                  />
                )}
              />
            </View>
            <View style={[styles.timeField]}>
              <Controller
                control={control}
                name="endTime"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Hora de fin"
                    value={new Date(value)}
                    onChange={onChange}
                    mode="time"
                  />
                )}
              />
            </View>
          </View>
          <View style={[styles.inputTextContainer]}>
            {errors.startTime ? (
              <InputErrorText>{errors.startTime?.message}</InputErrorText>
            ) : (
              <Text
                style={[
                  styles.text,
                  styles.helperText,
                  { color: helperTextColor },
                ]}
              >
                Las horas entre las que los usuarios tienen acceso.
              </Text>
            )}
          </View>
        </View>
      </View>
      <View style={[{ height: 8 }]} />
      {createRestriction.status === "loading" && (
        <ActivityIndicator size="large" color={iconColor} />
      )}
      {createRestriction.status !== "loading" && (
        <Animated.View style={[styles.rowFields]}>
          <Link href="../" asChild>
            <TextButton variant="secondary" wrapperStyle={[{ flex: 1 }]}>
              Volver
            </TextButton>
          </Link>
          <TextButton
            wrapperStyle={[{ flex: 2, width: "100%" }]}
            onPress={handleSubmit(onSubmit)}
          >
            Crear restricción
          </TextButton>
        </Animated.View>
      )}
      {createRestriction.status === "error" && (
        <Modal visible={true} onClose={resetMutation}>
          <ModalHeader>Error</ModalHeader>
          <ModalBody>
            <Text style={[styles.text, { color: textColor }]}>
              {(createRestriction.error as Error).message}
            </Text>
          </ModalBody>
          <ModalFooter>
            <TextButton onPress={resetMutation}>OK</TextButton>
          </ModalFooter>
        </Modal>
      )}
      {createRestriction.status === "success" && (
        <Modal visible={true} onClose={goBack}>
          <ModalHeader>Restricción creado</ModalHeader>
          <ModalBody>
            <Text style={[styles.text, { color: textColor }]}>
              La restricción fue creada con éxito.
            </Text>
          </ModalBody>
          <ModalFooter>
            <TextButton onPress={goBack}>OK</TextButton>
          </ModalFooter>
        </Modal>
      )}
      <View style={[{ height: window.height * 0.35 }]} />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 8,
  },
  formContainer: {
    gap: 8,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    backgroundColor: colors.default.tint.translucid[100],
    borderRadius: 8,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flexGrow: 1,
  },
  text: {
    fontFamily: fonts.inter,
    fontSize: 16,
  },
  inputLabel: {
    fontFamily: fonts.poppins,
  },
  title: {
    paddingTop: 4,
    fontFamily: fonts.poppinsMedium,
    fontSize: 20,
  },
  placeholder: {
    backgroundColor: colors.default.tint.translucid[200],
    width: "100%",
    height: 64,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    gap: 2,
  },
  inputTextContainer: {
    paddingHorizontal: 8,
  },
  restrictionTimeContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeField: {
    flex: 1,
  },
  rowFields: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  helperText: {
    fontSize: 14,
    fontFamily: fonts.interLight,
  },
});
