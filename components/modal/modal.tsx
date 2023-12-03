import { FC, ReactNode } from "react";
import {
  View,
  Modal as NativeModal,
  StyleSheet,
  Text,
  useColorScheme,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import fonts from "../../constants/fonts";
import colors from "../../constants/colors";

interface Props {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: FC<Props> = ({ visible, onClose, children }) => {
  const colorScheme = useColorScheme();

  const palette = colors[colorScheme];
  const isLight = colorScheme === "light";

  return (
    // <SafeAreaView style={[styles.centered]}>
    <NativeModal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      onOrientationChange={onClose}
    >
      <Pressable onPress={onClose} style={[styles.backdrop]}>
        <View />
      </Pressable>
      <View style={[styles.modal]}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: isLight
                ? colors.default.white[100]
                : colors.default.black[300],
            },
          ]}
        >
          {children}
        </View>
      </View>
    </NativeModal>
    // </SafeAreaView>
  );
};

export const ModalHeader: FC<{ children: ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();

  const isLight = colorScheme === "light";

  return (
    <View
      style={[
        styles.modalHeader,
        {
          borderBottomWidth: 1,
          borderBottomColor: isLight
            ? colors.default.gray[400]
            : colors.default.black[100],
        },
      ]}
    >
      <Text
        style={[
          styles.modalTitle,
          {
            color: isLight
              ? colors.default.black[400]
              : colors.default.white[200],
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

export const ModalBody: FC<{ children: ReactNode }> = ({ children }) => {
  return <View style={[styles.modalBody]}>{children}</View>;
};

export const ModalFooter: FC<{ children: ReactNode }> = ({ children }) => {
  return <View style={[styles.modalBody]}>{children}</View>;
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.24)",
  },
  container: {
    width: "80%",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    elevation: 10,
    shadowOpacity: 0.24,
    shadowRadius: 8,
  },
  modal: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 24,
    color: "#222222",
  },
  modalHeader: {
    padding: 8,
    width: "100%",
  },
  modalBody: {
    padding: 8,
    gap: 8,
    width: "100%",
  },
});
