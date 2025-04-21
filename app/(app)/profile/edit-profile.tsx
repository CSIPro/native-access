import { IonIcon } from "@/components/icons/ion";
import { DatePicker } from "@/components/ui/date-picker";
import { Input, InputErrorText } from "@/components/ui/input";
import { TextButton } from "@/components/ui/text-button";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useToast } from "@/context/toast-context";
import { useUserContext } from "@/context/user-context";
import { firebaseAuth } from "@/lib/firebase-config";
import { BASE_API_URL, NestError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useRouter } from "expo-router";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";

const ProfileForm = z.object({
  firstName: z
    .string({
      required_error: "El nombre es obligatorio",
    })
    .min(3, {
      message: "Tu nombre debe tener al menos 3 caracteres",
    })
    .max(50, {
      message: "Tu nombre no puede exceder los 50 caracteres",
    }),
  lastName: z
    .string({
      required_error: "Los apellidos son obligatorios",
    })
    .min(3, {
      message: "Tus apellidos deben tener al menos 3 caracteres",
    })
    .max(50, {
      message: "Tus apellidos no pueden exceder los 50 caracteres",
    }),
  dateOfBirth: z
    .date({
      required_error: "Tu fecha de nacimiento es obligatoria",
    })
    .min(new Date(1900, 0, 1), {
      message: "I don't think you're that old",
    })
    .max(new Date(), {
      message: "Time traveler alert!",
    }),
});

export type ProfileForm = z.infer<typeof ProfileForm>;

export default function EditProfile() {
  const authUser = firebaseAuth.currentUser;
  const { user } = useUserContext();
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(ProfileForm),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dateOfBirth: user
        ? new Date(
            new Date(user.dateOfBirth).getTime() +
              new Date().getTimezoneOffset() * 60 * 1000
          )
        : new Date(),
    },
  });

  const updateUser = useMutation({
    mutationFn: async (data: ProfileForm) => {
      if (!authUser) {
        throw new Error("No estás autenticado.");
      }

      if (!user) {
        throw new Error("No se encontraron datos de usuario.");
      }

      const res = await fetch(`${BASE_API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await authUser?.getIdToken()}`,
        },
        body: JSON.stringify({
          ...data,
          dateOfBirth: data.dateOfBirth.toISOString(),
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        const errorParse = NestError.safeParse(resData);

        if (errorParse.success) {
          switch (errorParse.data.statusCode) {
            case 400:
              throw new Error("La solicitud no tiene el formato correcto.");
            case 401:
              throw new Error("No estás autorizado para actualizar tu perfil.");
            case 403:
              throw new Error("No tienes permisos para actualizar tu perfil.");
            default:
              throw new Error("Error al actualizar el perfil");
          }
        }

        throw new Error("Error al actualizar el perfil");
      }

      return true;
    },
    onSuccess: () => {
      toast.showToast({
        title: "Perfil actualizado",
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["user", user?.id ?? authUser?.uid],
      });

      form.reset();
      router.back();
    },
    onError: (error: Error) => {
      toast.showToast({
        title: "Error al actualizar el perfil",
        description: error.message,
        variant: "error",
      });
    },
  });

  const onSubmit = (data: ProfileForm) => {
    updateUser.mutate(data);
  };

  const backgroundColor = isLight
    ? colors.default.white[100]
    : colors.default.black[400];
  const color = isLight ? colors.default.black[400] : colors.default.white[100];
  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  return (
    <ScrollView style={[{ flex: 1, padding: 8 }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Editar Perfil",
          headerStyle: { backgroundColor: colors.default.tint[400] },
          headerTitleStyle: { fontFamily: fonts.poppinsMedium },
          headerTintColor: colors.default.white[100],
        }}
      />
      <View
        style={[
          {
            flex: 1,
            gap: 8,
            backgroundColor,
          },
        ]}
      >
        <Text style={[styles.text, { color }]}>
          Aquí puedes editar algunos datos de tu perfil.
        </Text>
        <View style={[styles.separator]} />
        <Controller
          control={form.control}
          name="firstName"
          render={({ field, fieldState }) => (
            <Input
              ref={firstNameRef}
              label="Nombre(s)"
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Saúl Alberto"
              icon={<IonIcon name="person" size={24} color={iconColor} />}
              returnKeyType="next"
              helperText="Solo un nombre, de preferencia."
              onSubmitEditing={() => lastNameRef.current?.focus()}
              submitBehavior="submit"
              errorText={fieldState.error?.message}
              autoCapitalize="words"
            />
          )}
        />
        <Controller
          control={form.control}
          name="lastName"
          render={({ field: { onChange, value }, fieldState }) => (
            <Input
              ref={lastNameRef}
              label="Apellidos"
              value={value}
              onChangeText={onChange}
              placeholder="Ramos Laborín"
              icon={<IonIcon name="person" size={24} color={iconColor} />}
              returnKeyType="next"
              submitBehavior="blurAndSubmit"
              errorText={fieldState.error?.message}
              autoCapitalize="words"
            />
          )}
        />
        <Controller
          control={form.control}
          name="dateOfBirth"
          render={({ field: { onChange, value }, fieldState }) => (
            <View style={[{ flex: 1 }]}>
              <DatePicker
                label="Fecha de nacimiento"
                value={value}
                onChange={onChange}
                minimumDate={new Date(1900, 0, 1)}
                maximumDate={new Date()}
              />
              {fieldState.error && (
                <InputErrorText>{fieldState.error.message}</InputErrorText>
              )}
            </View>
          )}
        />
        <View style={[styles.controls]}>
          {updateUser.isLoading ? (
            <ActivityIndicator size="large" color={iconColor} />
          ) : (
            <View style={[styles.rowFields]}>
              <TextButton
                variant="secondary"
                onPress={() => router.back()}
                wrapperStyle={[{ flex: 1, width: "100%" }]}
              >
                Cancelar
              </TextButton>
              <TextButton
                onPress={form.handleSubmit(onSubmit)}
                wrapperStyle={[{ flex: 2, width: "100%" }]}
              >
                Guardar
              </TextButton>
            </View>
          )}
        </View>
      </View>
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
    fontSize: 16,
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: colors.default.tint[400],
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
