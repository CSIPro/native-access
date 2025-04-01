import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { useRoomRestrictions } from "@/hooks/use-restrictions";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { RoomPicker } from "@/components/room-picker/room-picker";
import { TextButton } from "@/components/ui/text-button";
import { Link } from "expo-router";
import { IonIcon } from "@/components/icons/ion";
import { AddRestriction } from "@/components/restrictions/add-restriction";
import { RestrictionItem } from "@/components/restrictions/restriction-item";

export default function RestrictionsPage() {
  const restrictions = useRoomRestrictions();
  const tabsHeight = useBottomTabBarHeight() + 8;
  const colorScheme = useColorScheme();

  const isLight = colorScheme === "light";

  const tint = isLight ? colors.default.tint[400] : colors.default.tint[200];
  const textColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];

  if (restrictions.status === "loading") {
    return (
      <View style={[styles.centered]}>
        <ActivityIndicator size="large" color={tint} />
        <Text style={[styles.text, styles.centeredText, { color: textColor }]}>
          Cargando restricciones
        </Text>
      </View>
    );
  }

  if (restrictions.status === "error") {
    return (
      <View style={[styles.centered]}>
        <Text style={[styles.text, styles.centeredText, { color: textColor }]}>
          Error loading requests
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: isLight
            ? colors.default.white[100]
            : colors.default.black[400],
        },
      ]}
    >
      <View style={[styles.roomPickerWrapper]}>
        <RoomPicker />
      </View>
      <FlatList
        data={restrictions.data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 4,
          gap: 8,
          paddingBottom: tabsHeight,
        }}
        ListHeaderComponent={
          restrictions.data?.length > 0 ? <AddRestriction /> : null
        }
        renderItem={({ item: restriction }) => (
          <RestrictionItem restriction={restriction} />
        )}
        ListEmptyComponent={
          <View style={[styles.centered, { gap: 8 }]}>
            <Text
              style={[styles.text, styles.centeredText, { color: textColor }]}
            >
              No hay restricciones activas
            </Text>
            <Link href="/members" asChild>
              <TextButton>Crear una</TextButton>
            </Link>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: fonts.poppins,
    fontSize: 16,
  },
  centeredText: {
    textAlign: "center",
  },
  roomPickerWrapper: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    width: "100%",
  },
});
