import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { FC } from "react";
import { useMutation } from "react-query";
import { useUserContext } from "@/context/user-context";
import { useUserData } from "@/hooks/use-user-data";
import { saveToStorage } from "@/lib/utils";
import colors from "@/constants/colors";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../modal/modal";
import { Input } from "../ui/input";
import { IonIcon } from "../icons/ion";
import { TextButton } from "../ui/text-button";
import fonts from "@/constants/fonts";

const formSchema = z.object({
  passcode: z.string({ required_error: "Passcode is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasscodePromptModal: FC<ModalProps> = ({ isOpen, onClose }) => {
  const { submitPasscode } = useUserContext();
  const { mutateAsync, isLoading, error } = useMutation<boolean, Error, string>(
    submitPasscode,
    {
      onError: (error) => console.log(error),
    }
  );
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
    if (isLoading) return;

    const valid = await mutateAsync(formData.passcode);

    if (valid) {
      await saveToStorage("PASSCODE", formData.passcode.toUpperCase());
      closeModal();
    }
  };

  const closeModal = () => {
    reset();
    onClose();
  };

  const palette = colors[colorScheme];
  const isLight = colorScheme === "light";

  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[100];

  return (
    <Modal visible={isOpen} onClose={closeModal}>
      <View>
        <ModalHeader>Enter your passcode</ModalHeader>
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
            <ModalBody>
              <Text
                style={[
                  styles.prompt,
                  {
                    color: isLight
                      ? colors.default.black[400]
                      : colors.default.white[100],
                  },
                ]}
              >
                Before attempting to connect, you need to provide your passcode.
                Case insensitive.
              </Text>
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
                      <IonIcon
                        name="md-code-working-outline"
                        size={24}
                        color={iconColor}
                      />
                    }
                    errorText={errors.passcode?.message || error?.message}
                    secureTextEntry={true}
                  />
                )}
              />
            </ModalBody>
            <ModalFooter>
              <TextButton onPress={handleSubmit(submit)}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={iconColor} />
                ) : (
                  "Submit"
                )}
              </TextButton>
            </ModalFooter>
          </View>
        )}
      </View>
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
    fontFamily: fonts.poppins,
    fontSize: 16,
  },
  input: {
    fontFamily: fonts.poppins,
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 8,
  },
  submitButton: {
    fontFamily: fonts.poppins,
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
