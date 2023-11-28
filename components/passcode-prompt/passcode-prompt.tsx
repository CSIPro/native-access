import { zodResolver } from "@hookform/resolvers/zod";
import {
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
import { FC, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalTitle,
} from "../modal/modal";

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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      passcode: "",
    },
    resolver: zodResolver(formSchema),
  });

  const colorScheme = useColorScheme();

  const submit = async (data: FormValues) => {
    await saveToStorage("PASSCODE", data.passcode);

    onClose();
  };

  const palette = colors[colorScheme];

  return (
    <Modal visible={isOpen} onClose={onClose}>
      <ModalTitle>Enter your passcode</ModalTitle>
      <ModalBody>
        <Text style={[styles.prompt, { color: palette.text }]}>
          Before attempting to connect, you need to provide your passcode
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
              placeholderTextColor={palette.text}
              textContentType="password"
              style={[
                styles.input,
                { color: palette.text, borderColor: palette.text },
              ]}
            />
          )}
        />
      </ModalBody>
      <ModalFooter>
        <Pressable
          onPress={handleSubmit(submit)}
          style={[
            styles.submitButton,
            { backgroundColor: palette.tint, alignSelf: "center" },
          ]}
        >
          <Text style={[styles.buttonText]}>Submit</Text>
        </Pressable>
      </ModalFooter>
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
