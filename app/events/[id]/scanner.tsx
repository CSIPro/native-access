import { CameraView, Camera, BarcodeScanningResult } from "expo-camera/next";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { useEvent } from "@/hooks/events/use-events";
import { useEffect, useState } from "react";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { TextButton } from "@/components/ui/text-button";

const dataRegex = /^\d{4,9}$/;

export default function EventScanner() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addAttendee } = useEvent(id);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<BarcodeScanningResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (scanned) {
      setError(null);
    }
  }, [scanned]);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (!dataRegex.test(result.data)) {
      console.log("Invalid data", result.data);
      setError("El código escaneado no es válido");

      return;
    }

    setScanned(result);
  };

  const handleSubmit = () => {
    addAttendee.mutate(scanned!.data);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setScanned(null);
  };

  const clearScanned = () => {
    setError(null);
    setScanned(null);
  };

  return (
    <View style={[styles.container]}>
      <Stack.Screen
        options={{
          headerTitle: "Escáner",
          headerStyle: { backgroundColor: colors.default.tint[400] },
          headerTintColor: colors.default.white[100],
        }}
      />
      <View style={[styles.viewFinder]}>
        {hasPermission ? (
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={[StyleSheet.absoluteFillObject]}
          />
        ) : (
          <>
            <Text style={[styles.text, { textAlign: "center" }]}>
              Es necesario acceder a la cámara para escanear códigos de barras
            </Text>
            <TextButton onPress={requestPermission}>
              Otorgar permisos
            </TextButton>
          </>
        )}
      </View>
      <View style={[styles.lowerSheet]}>
        <View style={[styles.controlsContainer]}>
          <View style={[styles.centered, { gap: 6 }]}>
            {error ? (
              <>
                <Text style={[styles.text, styles.error]}>Error</Text>
                <Text style={[styles.text]}>{error}</Text>
                <View style={[styles.actionsRow]}>
                  <TextButton onPress={clearScanned}>Continuar</TextButton>
                </View>
              </>
            ) : !scanned ? (
              <Text style={[styles.text, { textAlign: "center" }]}>
                Escanea el código de barras de la credencial universitaria
              </Text>
            ) : (
              <>
                <Text style={[styles.text]}>Código escaneado</Text>
                <Text style={[styles.text, styles.unisonId]}>
                  {scanned.data}
                </Text>
                <View style={[styles.actionsRow]}>
                  <TextButton onPress={handleSubmit}>Continuar</TextButton>
                  <TextButton variant="secondary" onPress={clearScanned}>
                    Omitir
                  </TextButton>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.default.black[400],
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewFinder: {
    flex: 2,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  lowerSheet: {
    flex: 1,
    width: "100%",
    padding: 8,
  },
  controlsContainer: {
    flex: 1,
    width: "100%",
    borderWidth: 2,
    borderColor: colors.default.tint[400],
    borderRadius: 8,
    backgroundColor: colors.default.tint.translucid[100],
    padding: 8,
  },
  unisonId: {
    fontFamily: fonts.interMedium,
    fontSize: 24,
  },
  error: {
    fontFamily: fonts.interMedium,
    fontSize: 20,
    color: colors.default.secondary[400],
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.default.white[100],
  },
});
