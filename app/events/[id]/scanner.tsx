import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { useEvent } from "@/hooks/events/use-events";
import { useEffect, useState } from "react";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { TextButton } from "@/components/ui/text-button";

export default function EventScanner() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mutation } = useEvent(id);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<BarCodeScannerResult | null>(null);

  const requestPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarCodeScanned = (result: BarCodeScannerResult) => {
    setScanned(result);
  };

  const handleSubmit = () => {
    mutation.mutate(scanned?.data);
    setScanned(null);
  };

  const clearScanned = () => {
    setScanned(null);
  };

  return (
    <View style={[styles.container]}>
      <Stack.Screen
        options={{
          headerTitle: "Escáner",
          headerStyle: { backgroundColor: colors.default.tint[400] },
        }}
      />
      <View style={[styles.viewFinder]}>
        {hasPermission ? (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
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
            {!scanned ? (
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
                  <TextButton onPress={handleSubmit}>Agregar</TextButton>
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
