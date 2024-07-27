import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { QRCode } from "@/components/qrcode/qrcode";
import { TextButton } from "@/components/ui/text-button";

export default function QRCodeScreen() {
  const isLight = useColorScheme() === "light";
  const router = useRouter();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("(app)/profile");
    }
  };

  const color = isLight ? colors.default.black[400] : colors.default.white[100];

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: isLight
            ? colors.default.white[100]
            : colors.default.black[400],
        },
      ]}
    >
      <Stack.Screen
        options={{
          headerTitle: "Código QR",
          headerStyle: {
            backgroundColor: colors.default.tint[400],
          },
          headerTintColor: colors.default.white[100],
        }}
      />
      <Text style={[styles.text, { color }]}>
        Puedes usar este código para autenticarte en la entrada a eventos.
      </Text>
      <View
        style={{
          height: 8,
          borderBottomWidth: 1,
          borderColor: colors.default.tint[400],
        }}
      />
      <View style={[styles.contentWrapper]}>
        <QRCode />
      </View>
      <TextButton variant="secondary" onPress={goBack}>
        Volver
      </TextButton>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: 8,
    padding: 8,
  },
  contentWrapper: {
    gap: 8,
    alignItems: "center",
    paddingVertical: 8,
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.inter,
  },
});
