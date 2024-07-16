import { Stack, useRouter } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { z } from "zod";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useUserContext } from "@/context/user-context";
import { useMutation } from "react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, InputAction } from "@/components/ui/input";
import { IonIcon } from "@/components/icons/ion";
import { TextButton } from "@/components/ui/text-button";
import { useState } from "react";
import { MaterialIcon } from "@/components/icons/material";
import { generatePasscode } from "@/lib/utils";

const PasscodeSchema = z.object({
  passcode: z
    .string({
      required_error: "Your passcode is required",
    })
    .min(4, {
      message: "Your passcode must be at least 4 characters long",
    })
    .max(10, {
      message: "Your passcode must be at most 10 characters long",
    })
    .regex(/^(?=.*[\d])(?=.*[A-D])[\dA-D]{4,10}$/, {
      message: "Your passcode must contain numbers and letters from A to D",
    })
    .optional(),
});
type PasscodeForm = z.infer<typeof PasscodeSchema>;

export default function Passcode() {
  const router = useRouter();
  const { submitPasscode } = useUserContext();
  const [showPasscode, setShowPasscode] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PasscodeForm>({
    defaultValues: { passcode: "" },
    resolver: zodResolver(PasscodeSchema),
  });
  const { mutate, isLoading, error } = useMutation<void, Error, string>(
    submitPasscode,
    {
      onSuccess: () => {
        reset();
        router.back();
      },
      onError: (error) => console.log(error),
    }
  );
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  const submit = async (data: PasscodeForm) => {
    if (isLoading) return;

    mutate(data.passcode);
  };

  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[100];

  return (
    <View
      style={[
        {
          backgroundColor: isLight
            ? colors.default.white[100]
            : colors.default.black[400],
          flex: 1,
          width: "100%",
        },
      ]}
    >
      <Stack.Screen
        options={{
          headerTitle: "Update passcode",
          headerStyle: {
            backgroundColor: colors.default.tint[400],
          },
          headerTitleStyle: {
            fontFamily: fonts.interMedium,
            color: colors.default.white[100],
          },
        }}
      />
      <View style={{ flex: 1, padding: 4 }}>
        <Text
          style={[
            styles.text,
            {
              color: isLight
                ? colors.default.black[400]
                : colors.default.white[100],
            },
          ]}
        >
          Here you can update your passcode in case you need it
        </Text>
        <View
          style={[
            {
              gap: 8,
            },
          ]}
        >
          <Controller
            control={control}
            name="passcode"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Passcode"
                value={value}
                onChangeText={onChange}
                placeholder="e.g. A1B2C3"
                icon={
                  <IonIcon name="code-working" size={24} color={iconColor} />
                }
                errorText={errors.passcode?.message || error?.message}
                secureTextEntry={!showPasscode}
              >
                <InputAction onPress={() => setShowPasscode((prev) => !prev)}>
                  <MaterialIcon
                    name={showPasscode ? "visibility-off" : "visibility"}
                    color={iconColor}
                    size={24}
                  />
                </InputAction>
                <InputAction
                  onPress={() => {
                    setValue("passcode", generatePasscode());
                    setShowPasscode(true);
                  }}
                >
                  <MaterialIcon
                    name="auto-awesome"
                    color={iconColor}
                    size={24}
                  />
                </InputAction>
              </Input>
            )}
          />
          <TextButton onPress={handleSubmit(submit)}>
            {isLoading ? (
              <ActivityIndicator size="small" color={iconColor} />
            ) : (
              "Submit"
            )}
          </TextButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.inter,
    fontSize: 16,
  },
});
