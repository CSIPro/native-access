import {
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import QRCodeGen from "react-native-qrcode-svg";

import { useUserContext } from "@/context/user-context";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

export const QRCode = () => {
  const window = useWindowDimensions();
  const isLight = useColorScheme() === "light";
  const { user } = useUserContext();

  if (!user) {
    return (
      <Text style={styles.text}>
        No fue posible obtener tus datos de usuario
      </Text>
    );
  }

  return (
    <View style={[styles.wrapper]}>
      <QRCodeGen
        value={user.unisonId}
        backgroundColor="transparent"
        color={colors.default.tint[400]}
        size={window.width * 0.8}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: colors.default.tint[400],
    backgroundColor: colors.default.tint.translucid[100],
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.inter,
  },
});
