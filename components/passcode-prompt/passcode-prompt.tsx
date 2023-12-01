import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { saveToStorage } from "../../lib/utils";
import { storageKeys } from "../../constants/storage-keys";
import { FC, useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../modal/modal";
import { AccessUser, useUserData } from "../../hooks/use-user-data";
import { useUserContext } from "../../context/user-context";
import { useMutation, useQuery } from "react-query";

const formSchema = z.object({
  passcode: z
    .string({ required_error: "Passcode is required" })
    .min(4, { message: "Passcode must be at least 4 characters long" })
    .max(10, { message: "Passcode must be at most 10 characters long" })
    .regex(/^(?=.*[\d])(?=.*[A-D])[\dA-D]{4,10}$/gi, {
      message: "Passcode must be a combination of letters A-D and numbers 0-9",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasscodePromptModal: FC<ModalProps> = ({ isOpen, onClose }) => {
  const { validatePasscode } = useUserContext();
  const {
    mutateAsync,
    data: mutationData,
    isLoading,
    isError,
    error,
  } = useMutation<boolean, Error, string>(validatePasscode);
  const { status, data } = useUserData();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      passcode: "",
    },
    resolver: zodResolver(formSchema),
  });

  const colorScheme = useColorScheme();

  const submit = async (formData: FormValues) => {
    const isValid = await mutateAsync(formData.passcode);

    if (!isValid) return;

    await saveToStorage("PASSCODE", formData.passcode.toUpperCase());

    reset();
    onClose();
  };

  const palette = colors[colorScheme];

  return (
    <Modal visible={isOpen} onClose={onClose}>
      {status === "loading" && (
        <ModalBody>
          <View
            style={[
              {
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              },
            ]}
          >
            <Text style={[styles.prompt]}>Retrieving user data...</Text>
            <ActivityIndicator size="small" color={palette.tint} />
          </View>
        </ModalBody>
      )}
      {status === "error" && (
        <ModalBody>
          <Text style={[styles.prompt]}>Error loading user data</Text>
        </ModalBody>
      )}
      {!!data && (
        <View>
          <ModalHeader>Enter your passcode</ModalHeader>
          <ModalBody>
            <Text style={[styles.prompt, { color: "#222222" }]}>
              Before attempting to connect, you need to provide your passcode.
              Case insensitive.
            </Text>
            <Controller
              control={control}
              name="passcode"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Passcode"
                  placeholderTextColor={"#222222"}
                  textContentType="password"
                  secureTextEntry={true}
                  style={[
                    styles.input,
                    { color: "#222222", borderColor: "#222222" },
                  ]}
                />
              )}
            />
            {errors.passcode && (
              <Text style={[styles.prompt, { fontSize: 12, color: "red" }]}>
                {errors.passcode.message}
              </Text>
            )}
            {isError && (
              <Text style={[styles.prompt, { fontSize: 12, color: "red" }]}>
                {error?.message}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Pressable
              onPress={handleSubmit(submit)}
              style={[
                styles.submitButton,
                { backgroundColor: palette.tint, alignSelf: "center" },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={[styles.buttonText]}>Submit</Text>
              )}
            </Pressable>
          </ModalFooter>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
    gap: 4,
  },
  prompt: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 16,
  },
  input: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 8,
  },
  submitButton: {
    fontFamily: fonts.poppinsRegular,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  buttonText: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 16,
    textTransform: "uppercase",
    color: "#fff",
  },
});
