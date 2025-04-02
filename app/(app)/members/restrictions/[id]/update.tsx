import * as Haptics from "expo-haptics";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

import colors from "@/constants/colors";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { TextButton } from "@/components/ui/text-button";
import { IonIcon } from "@/components/icons/ion";
import fonts from "@/constants/fonts";
import {
  Restriction,
  useRestriction,
  useRestrictionActions,
} from "@/hooks/use-restrictions";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Animated from "react-native-reanimated";
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
import { useEffect, useState } from "react";

const RestrictionForm = z.object({
  daysBitmask: z
    .array(z.boolean())
    .length(7)
    .default(() => Array(7).fill(true)),
  startTime: z.date(),
  endTime: z.date(),
  isActive: z.boolean().default(true),
});

type RestrictionFormType = z.infer<typeof RestrictionForm>;

export default function UpdateRestrictionPage() {
  const router = useRouter();
  const window = useWindowDimensions();

  const { id } = useLocalSearchParams<{ id: string }>();

  const restrictionQuery = useRestriction(id);
  const { updateRestriction, deleteRestriction } = useRestrictionActions();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [bitmask, setBitmask] = useState(
    restrictionQuery.data?.daysBitmask
      ? Array.from(
          { length: 7 },
          (_, i) => (restrictionQuery.data?.daysBitmask & (1 << i)) !== 0
        )
      : Array(7).fill(true)
  );

  const startHour = (restrictionQuery.data?.startTime ?? "00:00:00").substring(
    0,
    2
  );
  const startMinute = (
    restrictionQuery.data?.startTime ?? "00:00:00"
  ).substring(3, 5);
  const startSecond = (
    restrictionQuery.data?.startTime ?? "00:00:00"
  ).substring(6, 8);

  const endHour = (restrictionQuery.data?.endTime ?? "23:59:59").substring(
    0,
    2
  );
  const endMinute = (restrictionQuery.data?.endTime ?? "23:59:59").substring(
    3,
    5
  );
  const endSecond = (restrictionQuery.data?.endTime ?? "23:59:59").substring(
    6,
    8
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RestrictionFormType>({
    resolver: zodResolver(RestrictionForm),
    defaultValues: {
      daysBitmask: bitmask,
      startTime: new Date(
        new Date().setHours(+startHour, +startMinute, +startSecond)
      ),
      endTime: new Date(new Date().setHours(+endHour, +endMinute, +endSecond)),
      isActive: restrictionQuery.data?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (restrictionQuery.data) {
      setBitmask(
        Array.from(
          { length: 7 },
          (_, i) => (restrictionQuery.data.daysBitmask & (1 << i)) !== 0
        )
      );
    }
  }, [restrictionQuery.data]);

  const onSubmit = (data: RestrictionFormType) => {
    const daysBitmask = data.daysBitmask.reduce(
      (acc, curr, index) => acc + (curr ? 1 << index : 0),
      0
    );

    const startTime = format(data.startTime, "HH:mm:ss");
    const endTime = format(data.endTime, "HH:mm:ss");

    const restrictionData: Restriction = {
      ...data,
      startTime,
      endTime,
      daysBitmask,
      id: restrictionQuery.data?.id ?? "",
      roleId: restrictionQuery.data?.role.id ?? "",
      roomId: restrictionQuery.data?.room.id ?? "",
    };

    updateRestriction.mutate(restrictionData);
  };

  const handleDeleteRestriction = async () => {
    if (!restrictionQuery.data) return;
    if (deleteRestriction.isLoading) return;

    try {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirma tu identidad para continuar",
        cancelLabel: "Cancelar",
      });

      if (!auth.success) {
        setOpenDeleteModal(false);
        return;
      }

      deleteRestriction.mutate(restrictionQuery.data.id);
    } catch (error) {
      console.error(error);
    }
  };

  const resetMutation = () => updateRestriction.reset();

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
            Editar restricción
          </Text>
        </View>
        <TextButton onPress={handleSubmit(onSubmit)}>Guardar</TextButton>
      </View>
      {restrictionQuery.isLoading && (
        <View
          style={[
            {
              height: 250,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <ActivityIndicator size="large" color={iconColor} />
        </View>
      )}
      {restrictionQuery.isError && (
        <View
          style={[
            {
              height: 250,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={[styles.text, { color: textColor }]}>
            {(restrictionQuery.error as Error).message}
          </Text>
        </View>
      )}
      {restrictionQuery.isSuccess && restrictionQuery.data && (
        <>
          <View style={[styles.formContainer]}>
            <View style={[styles.header]}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <View style={[styles.inputTextContainer]}>
                  <Text
                    style={[
                      styles.text,
                      styles.inputLabel,
                      { color: textColor },
                    ]}
                  >
                    Rol
                  </Text>
                </View>
                <TextButton onPress={() => {}}>
                  {restrictionQuery.data.role.name}
                </TextButton>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <View style={[styles.inputTextContainer]}>
                  <Text
                    style={[
                      styles.text,
                      styles.inputLabel,
                      { color: textColor },
                    ]}
                  >
                    Salón
                  </Text>
                </View>
                <TextButton onPress={() => {}}>
                  {restrictionQuery.data.room.name}
                </TextButton>
              </View>
            </View>
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
          <Controller
            control={control}
            name="isActive"
            render={({ field: { onChange, value } }) => (
              <Pressable
                onPressIn={() => Haptics.selectionAsync()}
                onPress={() => onChange(!value)}
                style={[
                  styles.rowFields,
                  {
                    backgroundColor: value
                      ? isLight
                        ? colors.default.tint.translucid[400]
                        : colors.default.tint.translucid[200]
                      : isLight
                      ? colors.default.secondary.translucid[400]
                      : colors.default.secondary.translucid[200],
                    borderRadius: 8,
                  },
                  { padding: 8 },
                ]}
              >
                <Text
                  style={[styles.text, styles.inputLabel, { color: textColor }]}
                >
                  {value ? "Activa" : "Inactiva"}
                </Text>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  thumbColor={colors.default.white[100]}
                  onTouchStart={() => Haptics.selectionAsync()}
                  trackColor={{
                    false: isLight
                      ? colors.default.secondary.translucid[400]
                      : colors.default.secondary.translucid[200],
                    true: isLight
                      ? colors.default.tint.translucid[400]
                      : colors.default.tint.translucid[200],
                  }}
                />
              </Pressable>
            )}
          />
          <View style={[{ height: 8 }]} />
          {updateRestriction.status === "loading" && (
            <ActivityIndicator size="large" color={iconColor} />
          )}
          {updateRestriction.status !== "loading" && (
            <View style={[{ width: "100%", gap: 8 }]}>
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
                  Guardar restricción
                </TextButton>
              </Animated.View>

              {!deleteRestriction.isLoading && (
                <TextButton
                  variant="secondary"
                  onPress={() => setOpenDeleteModal(true)}
                >
                  Eliminar restricción
                </TextButton>
              )}
            </View>
          )}
          {updateRestriction.status === "error" && (
            <Modal visible={true} onClose={resetMutation}>
              <ModalHeader>Error</ModalHeader>
              <ModalBody>
                <Text style={[styles.text, { color: textColor }]}>
                  {(updateRestriction.error as Error).message}
                </Text>
              </ModalBody>
              <ModalFooter>
                <TextButton onPress={resetMutation}>OK</TextButton>
              </ModalFooter>
            </Modal>
          )}
          {updateRestriction.status === "success" && (
            <Modal visible={true} onClose={goBack}>
              <ModalHeader>Restricción creado</ModalHeader>
              <ModalBody>
                <Text style={[styles.text, { color: textColor }]}>
                  La restricción fue actualizada con éxito.
                </Text>
              </ModalBody>
              <ModalFooter>
                <TextButton onPress={goBack}>OK</TextButton>
              </ModalFooter>
            </Modal>
          )}
          <View style={[{ height: window.height * 0.35 }]} />
          <Modal
            visible={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
          >
            <ModalHeader>Eliminar restricción</ModalHeader>
            <ModalBody>
              <Text style={[styles.text, { color: textColor }]}>
                ¿Seguro de que quieres eliminar esta restricción?
              </Text>
            </ModalBody>
            <ModalFooter>
              <TextButton variant="secondary" onPress={handleDeleteRestriction}>
                {deleteRestriction.isLoading ? (
                  <ActivityIndicator
                    color={
                      isLight
                        ? colors.default.secondary[400]
                        : colors.default.secondary[100]
                    }
                  />
                ) : (
                  "Eliminar"
                )}
              </TextButton>
              <TextButton onPress={() => setOpenDeleteModal(false)}>
                Cancelar
              </TextButton>
            </ModalFooter>
          </Modal>
          {deleteRestriction.status === "error" && (
            <Modal visible={true} onClose={resetMutation}>
              <ModalHeader>Error</ModalHeader>
              <ModalBody>
                <Text style={[styles.text, { color: textColor }]}>
                  {(deleteRestriction.error as Error).message}
                </Text>
              </ModalBody>
              <ModalFooter>
                <TextButton onPress={resetMutation}>OK</TextButton>
              </ModalFooter>
            </Modal>
          )}
          {deleteRestriction.status === "success" && (
            <Modal visible={true} onClose={goBack}>
              <ModalHeader>Restricción eliminada</ModalHeader>
              <ModalBody>
                <Text style={[styles.text, { color: textColor }]}>
                  La restricción fue eliminada con éxito.
                </Text>
              </ModalBody>
              <ModalFooter>
                <TextButton onPress={goBack}>OK</TextButton>
              </ModalFooter>
            </Modal>
          )}
        </>
      )}
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
    paddingVertical: 4,
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
    alignItems: "center",
    gap: 8,
  },
  helperText: {
    fontSize: 14,
    fontFamily: fonts.interLight,
  },
});
