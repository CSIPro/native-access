import { FC, ReactNode } from "react";
import {
  View,
  Modal as NativeModal,
  StyleSheet,
  Text,
  useColorScheme,
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

  return (
    // <SafeAreaView style={[styles.centered]}>
    <NativeModal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      style={[styles.modal]}
    >
      <View
        style={[{ flex: 1, alignItems: "center", justifyContent: "center" }]}
      >
        <View
          style={[styles.container, { backgroundColor: palette.background }]}
        >
          {children}
        </View>
      </View>
    </NativeModal>
    // </SafeAreaView>
  );
};

export const ModalTitle: FC<{ children: ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();

  const palette = colors[colorScheme];

  return (
    <View
      style={[
        {
          padding: 8,
        },
      ]}
    >
      <Text style={[styles.modalTitle, { color: palette.text }]}>
        {children}
      </Text>
    </View>
  );
};

export const ModalBody: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <View
      style={[
        styles.modalBody,
        {
          width: "100%",
          borderTopWidth: 1,
          borderTopColor: "#e1e1e1",
          borderBottomWidth: 1,
          borderBottomColor: "#e1e1e1",
        },
      ]}
    >
      {children}
    </View>
  );
};

export const ModalFooter: FC<{ children: ReactNode }> = ({ children }) => {
  return <View style={[styles.modalBody]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    minWidth: "50%",
    maxWidth: "90%",
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
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 24,
    color: "#222222",
  },
  modalBody: {
    padding: 8,
    gap: 4,
  },
});
